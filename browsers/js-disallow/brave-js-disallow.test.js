/**
 * Vitest tests for src/automation.js
 *
 * Environment: happy-dom (configured in vite.config.js).
 *
 * Strategy:
 *   - Build a minimal DOM that mirrors the real Brave shadow-root chain.
 *   - Inject it into `document.body` before each test.
 *   - Override timing constants (set to 0 ms) so tests run instantly.
 *   - Assert that the right elements were found and interacted with.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  sleep,
  walkDeep,
  queryDeep,
  waitForElement,
  setNativeValue,
  clickElement,
  getAddSiteButton,
  getPopupInput,
  getAddButton,
  addSite,
  runAutomation,
  SITES,
} from "./automation.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build the mock DOM that mirrors the Brave settings page:
 *
 *   <button id="addSite">          (in document)
 *   <input  id="input" aria-label="Site">  (in document, represents popup)
 *   <cr-button id="add">
 *     #shadow-root
 *       <leo-button>
 *         #shadow-root
 *           <button>               ← innermost real button
 *
 * Returns references to the key elements.
 */
function buildMockDOM() {
  document.body.innerHTML = "";

  // #addSite button
  const addSiteBtn = document.createElement("button");
  addSiteBtn.id = "addSite";
  document.body.appendChild(addSiteBtn);

  // URL input (popup – already in DOM for simplicity)
  const input = document.createElement("input");
  input.id = "input";
  input.setAttribute("aria-label", "Site");
  input.type = "text";
  document.body.appendChild(input);

  // cr-button#add  →  leo-button  →  <button>
  const crButton = document.createElement("cr-button");
  crButton.id = "add";

  const crShadow = crButton.attachShadow({ mode: "open" });
  const leoButton = document.createElement("leo-button");
  crShadow.appendChild(leoButton);

  const leoShadow = leoButton.attachShadow({ mode: "open" });
  const innerBtn = document.createElement("button");
  leoShadow.appendChild(innerBtn);

  document.body.appendChild(crButton);

  return { addSiteBtn, input, crButton, leoButton, innerBtn };
}

// Speed up all waits to 0 for tests
const fastOpts = {
  waitPopupOpen: 0,
  waitAfterInput: 0,
  waitAfterAdd: 0,
  elementTimeout: 300, // fail fast in error-path tests
  pollInterval: 30,
};

// ── Unit tests ────────────────────────────────────────────────────────────────

describe("sleep", () => {
  it("resolves after the given delay", async () => {
    const start = Date.now();
    await sleep(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(40);
  });
});

describe("walkDeep", () => {
  beforeEach(() => buildMockDOM());

  it("yields document as first node", () => {
    const [first] = walkDeep(document);
    expect(first).toBe(document);
  });

  it("yields shadow roots of custom elements", () => {
    const nodes = [...walkDeep(document)];
    // Should include the cr-button's shadow root and leo-button's shadow root
    const hasCrShadow = nodes.some(
      (n) => n instanceof ShadowRoot && n.host?.id === "add",
    );
    const hasLeoShadow = nodes.some(
      (n) =>
        n instanceof ShadowRoot &&
        n.host?.tagName?.toLowerCase() === "leo-button",
    );
    expect(hasCrShadow).toBe(true);
    expect(hasLeoShadow).toBe(true);
  });
});

describe("queryDeep", () => {
  beforeEach(() => buildMockDOM());

  it("finds a top-level element by selector", () => {
    expect(queryDeep("#addSite")).not.toBeNull();
  });

  it("finds an element inside a nested shadow root", () => {
    const crButton = document.querySelector("cr-button");
    // The final <button> is two shadow roots deep (cr-button → leo-button → button)
    // queryDeep must drill into cr-button's own shadowRoot first
    const btn = queryDeep("button", crButton);
    expect(btn).not.toBeNull();
  });

  it("returns null for non-existent selector", () => {
    expect(queryDeep("#nonexistent")).toBeNull();
  });
});

describe("waitForElement", () => {
  beforeEach(() => buildMockDOM());

  it("resolves with the element when it exists immediately", async () => {
    const el = await waitForElement("#addSite", document, 500);
    expect(el).not.toBeNull();
    expect(el.id).toBe("addSite");
  });

  it("resolves after the element is added asynchronously", async () => {
    // Remove then re-add after 80 ms
    const existing = document.getElementById("addSite");
    existing.remove();
    setTimeout(() => document.body.appendChild(existing), 80);

    const el = await waitForElement("#addSite", document, 2_000, 30);
    expect(el).toBe(existing);
  });

  it("throws when element never appears", async () => {
    await expect(
      waitForElement("#neverHere", document, 100, 30),
    ).rejects.toThrow("Timeout waiting for: #neverHere");
  });
});

describe("setNativeValue", () => {
  it("sets the input value: types URL, adds extra char, deletes it", () => {
    const input = document.createElement("input");
    const beforeInputSpy = vi.fn();
    const inputSpy = vi.fn();
    const changeSpy = vi.fn();
    input.addEventListener("beforeinput", beforeInputSpy);
    input.addEventListener("input", inputSpy);
    input.addEventListener("change", changeSpy);

    const testUrl = "https://example.com";
    setNativeValue(input, testUrl);

    expect(input.value).toBe(testUrl);
    // input events: URL chars + 1 unlock char + 1 backspace = URL.length + 2
    expect(inputSpy.mock.calls.length).toBe(testUrl.length + 2);
    // beforeinput events: same count
    expect(beforeInputSpy.mock.calls.length).toBe(testUrl.length + 2);
    expect(changeSpy).toHaveBeenCalledOnce();

    // Last event is backspace (deleteContentBackward) after unlock trick
    const lastInputEvent =
      inputSpy.mock.calls[inputSpy.mock.calls.length - 1][0];
    expect(lastInputEvent).toBeInstanceOf(InputEvent);
    expect(lastInputEvent.inputType).toBe("deleteContentBackward");

    // Second-to-last is the unlock char 'a'
    const unlockCharEvent =
      inputSpy.mock.calls[inputSpy.mock.calls.length - 2][0];
    expect(unlockCharEvent.inputType).toBe("insertText");
    expect(unlockCharEvent.data).toBe("a");
  });

  it("sets .value on the shadow host (cr-input) when input is inside a shadow root", () => {
    // Build a minimal cr-input-like host with a shadow root containing the input
    const host = document.createElement("cr-input");
    host.value = ""; // Polymer-style property
    const shadow = host.attachShadow({ mode: "open" });
    const inner = document.createElement("input");
    shadow.appendChild(inner);
    document.body.appendChild(host);

    setNativeValue(inner, "https://example.com");

    // The Polymer host's .value property must be updated
    expect(host.value).toBe("https://example.com");
    // The native inner input must also reflect the value
    expect(inner.value).toBe("https://example.com");

    document.body.removeChild(host);
  });
});

describe("clickElement", () => {
  it("calls .click() on the element", async () => {
    const el = document.createElement("button");
    const spy = vi.spyOn(el, "click");
    await clickElement(el, 0);
    expect(spy).toHaveBeenCalledOnce();
  });

  it("throws when element is null", async () => {
    await expect(clickElement(null, 0)).rejects.toThrow(
      "Attempted click on null element",
    );
  });
});

describe("getAddSiteButton", () => {
  beforeEach(() => buildMockDOM());

  it("finds #addSite", async () => {
    const btn = await getAddSiteButton(document);
    expect(btn.id).toBe("addSite");
  });
});

describe("getPopupInput", () => {
  beforeEach(() => buildMockDOM());

  it("finds input[aria-label='Site']", async () => {
    const input = await getPopupInput(document);
    expect(input instanceof HTMLInputElement).toBe(true);
    expect(input.getAttribute("aria-label")).toBe("Site");
  });

  it("finds input by fallback #input when aria-label missing", async () => {
    document.querySelector("input").removeAttribute("aria-label");
    const input = await getPopupInput(document);
    expect(input?.id).toBe("input");
  });
});

describe("getAddButton", () => {
  beforeEach(() => buildMockDOM());

  it("returns the native <button> inside the leo-button shadow root", async () => {
    const btn = await getAddButton(document);
    expect(btn.tagName.toLowerCase()).toBe("button");
    // Must NOT be the cr-button host itself
    expect(btn.id).not.toBe("add");
  });
});

describe("addSite", () => {
  let mocks;

  beforeEach(() => {
    mocks = buildMockDOM();
  });

  it("clicks #addSite, fills input, clicks Add button", async () => {
    const addSiteSpy = vi.spyOn(mocks.addSiteBtn, "click");
    const innerBtnSpy = vi.spyOn(mocks.innerBtn, "click");
    const log = vi.fn();

    await addSite("https://example.com", {
      ...fastOpts,
      root: document,
      log,
    });

    expect(addSiteSpy).toHaveBeenCalledOnce();
    expect(mocks.input.value).toBe("https://example.com");
    expect(innerBtnSpy).toHaveBeenCalledOnce();
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("https://example.com"),
    );
  });

  it("throws when #addSite is missing", async () => {
    document.getElementById("addSite").remove();
    await expect(
      addSite("https://example.com", { ...fastOpts, root: document }),
    ).rejects.toThrow();
  });

  it("throws when URL input is missing", async () => {
    document.getElementById("input").remove();
    await expect(
      addSite("https://example.com", { ...fastOpts, root: document }),
    ).rejects.toThrow();
  });
});

describe("runAutomation", () => {
  let mocks;

  beforeEach(() => {
    mocks = buildMockDOM();
  });

  it("adds each URL in sequence", async () => {
    const urls = ["https://a.com", "https://b.com", "https://c.com"];
    const progress = [];
    const log = vi.fn();

    await runAutomation(urls, {
      ...fastOpts,
      waitBetweenSites: 0,
      root: document,
      log,
      onProgress: (i, total, url) => progress.push({ i, total, url }),
    });

    expect(progress).toHaveLength(3);
    expect(progress[0]).toMatchObject({ i: 0, total: 3, url: "https://a.com" });
    expect(progress[2]).toMatchObject({ i: 2, total: 3, url: "https://c.com" });
  });

  it("respects the shouldStop() kill-switch", async () => {
    const urls = ["https://a.com", "https://b.com", "https://c.com"];
    const added = [];
    const log = vi.fn();

    let callCount = 0;
    await runAutomation(urls, {
      ...fastOpts,
      waitBetweenSites: 0,
      root: document,
      log,
      onProgress: (_i, _t, url) => added.push(url),
      shouldStop: () => ++callCount > 1, // stop after the first site
    });

    expect(added.length).toBeLessThan(3);
  });

  it("continues after a per-site error", async () => {
    const urls = ["https://good.com", "https://good2.com"];
    const log = vi.fn();

    // Make the add button disappear only for the first call
    let firstCall = true;
    vi.spyOn(mocks.crButton, "querySelector").mockImplementationOnce(() => {
      if (firstCall) {
        firstCall = false;
        throw new Error("mock error");
      }
    });

    // runAutomation should not throw
    await expect(
      runAutomation(urls, {
        ...fastOpts,
        waitBetweenSites: 0,
        root: document,
        log,
      }),
    ).resolves.not.toThrow();
  });

  it("does not wait after the last site", async () => {
    const urls = ["https://only.com"];
    const sleepSpy = vi.spyOn(await import("./automation.js"), "sleep");

    const log = vi.fn();
    await runAutomation(urls, {
      ...fastOpts,
      waitBetweenSites: 999_999, // would be slow if called
      root: document,
      log,
    });

    // The 999_999 ms sleep should never have been called
    const longSleepCalls = sleepSpy.mock.calls.filter(([ms]) => ms === 999_999);
    expect(longSleepCalls).toHaveLength(0);

    sleepSpy.mockRestore();
  });
});

describe("SITES list", () => {
  it("contains 299 entries", () => {
    expect(SITES.length).toBe(299);
  });

  it("every entry starts with http:// or https://", () => {
    for (const url of SITES) {
      expect(url.startsWith("https://") || url.startsWith("http://")).toBe(
        true,
      );
    }
  });
});
