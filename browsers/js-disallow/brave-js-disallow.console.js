/**
 * BRAVE – Block JavaScript – bulk site adder
 * Paste into DevTools console and press Enter.
 *
 * Controls:
 *   window.__stopBraveSiteAutomation = true;  // stop
 *   window.__runBraveSiteAutomation();        // restart
 *   window.__sitesBraveSiteAutomation;        // inspect list
 */
(async () => {
  const BASE_SITES = [
    // ADICIONE AQUI A SUA LISTA DE SITES A TEREM O JAVASCRIPT DESATIVADO PELO BRAVE BROWSER
  ];

  /** @param {string[]} list - Expands URLs to include bare domain and [*.] wildcard variants */
  function expandSites(list) {
    const expanded = new Set();
    for (const url of list) {
      expanded.add(url);
      const bare = url.replace(/^https?:\/\//, "");
      expanded.add(bare);
      expanded.add(`[*.]${bare}`);
    }
    return [...expanded];
  }

  const SITES = expandSites(BASE_SITES);

  const WAIT_BETWEEN_SITES_MS = 5_000;
  const WAIT_POPUP_OPEN_MS = 2_000;
  const WAIT_AFTER_INPUT_MS = 500;
  const WAIT_AFTER_ADD_MS = 2_000;
  const MAX_RETRIES = 3;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /** @generator Yields document/ShadowRoot nodes lazily for deep DOM traversal */
  function* walkDeep(root = document) {
    if (!root) return;
    yield root;
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) yield* walkDeep(el.shadowRoot);
    }
  }

  /** @param {string} selector - querySelector through all shadow roots */
  function queryDeep(selector, root = document) {
    for (const node of walkDeep(root)) {
      const hit = node.querySelector(selector);
      if (hit) return hit;
    }
    return null;
  }

  /** @param {string} selector - Polls until element appears or timeout */
  async function waitForElement(selector, timeout = 10_000, interval = 250) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const el = queryDeep(selector);
      if (el) return el;
      await sleep(interval);
    }
    throw new Error(`[automation] Timeout waiting for: ${selector}`);
  }

  /** @returns {boolean} True if #error contains "Not a valid web address" */
  function hasValidationError() {
    const errorDiv = queryDeep("#error");
    return errorDiv?.textContent?.includes("Not a valid web address") ?? false;
  }

  /** @param {HTMLInputElement} input - Simulates keydown/beforeinput/input/keyup for a single character */
  function simulateKeystroke(input, char, shadowHost) {
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: char,
        code: `Key${char.toUpperCase()}`,
        keyCode: char.charCodeAt(0),
        bubbles: true,
        composed: true,
      }),
    );
    input.dispatchEvent(
      new InputEvent("beforeinput", {
        bubbles: true,
        composed: true,
        cancelable: true,
        inputType: "insertText",
        data: char,
      }),
    );
    input.value += char;
    if (shadowHost && "value" in shadowHost) shadowHost.value = input.value;
    input.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        composed: true,
        cancelable: false,
        inputType: "insertText",
        data: char,
      }),
    );
    input.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: char,
        code: `Key${char.toUpperCase()}`,
        keyCode: char.charCodeAt(0),
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** @param {HTMLInputElement} input - Simulates backspace keystroke */
  function simulateBackspace(input, shadowHost) {
    if (!input.value) return;
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Backspace",
        code: "Backspace",
        keyCode: 8,
        bubbles: true,
        composed: true,
      }),
    );
    input.dispatchEvent(
      new InputEvent("beforeinput", {
        bubbles: true,
        composed: true,
        cancelable: true,
        inputType: "deleteContentBackward",
        data: null,
      }),
    );
    input.value = input.value.slice(0, -1);
    if (shadowHost && "value" in shadowHost) shadowHost.value = input.value;
    input.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        composed: true,
        cancelable: false,
        inputType: "deleteContentBackward",
        data: null,
      }),
    );
    input.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Backspace",
        code: "Backspace",
        keyCode: 8,
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Sets input value for Polymer cr-input: clears, types URL char-by-char,
   * appends+removes extra char to trigger validation, then focuses to enable Add button.
   * @param {HTMLInputElement} input
   * @param {string} value
   */
  function setNativeValue(input, value) {
    input.focus();
    const shadowHost = input.getRootNode?.()?.host;

    while (input.value.length > 0) simulateBackspace(input, shadowHost);
    for (const char of value) simulateKeystroke(input, char, shadowHost);

    // Append+remove extra char to trigger Polymer re-validation
    simulateKeystroke(input, "a", shadowHost);
    simulateBackspace(input, shadowHost);

    // Set value directly as fallback
    const desc = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(input),
      "value",
    );
    if (desc?.set) desc.set.call(input, value);
    if (shadowHost && "value" in shadowHost) shadowHost.value = value;

    // Clear invalid state
    if (shadowHost) {
      if ("invalid" in shadowHost) shadowHost.invalid = false;
      if (typeof shadowHost.validate === "function") shadowHost.validate();
    }

    input.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    // Focus is required to activate the Add button
    input.blur();
    input.focus();
  }

  /** @returns {boolean} True if cr-button#add inside cr-dialog#dialog is enabled */
  function isAddButtonEnabled() {
    const dialog = queryDeep("cr-dialog#dialog");
    const addBtn = dialog?.querySelector("cr-button.action-button#add");
    return addBtn ? !addBtn.disabled : false;
  }

  /** @param {Element} el - Clicks element using coordinate-based MouseEvents */
  async function clickElementByCoords(el) {
    if (!el) throw new Error("[automation] Attempted click on null element");
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const eventInit = {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window,
      clientX: x,
      clientY: y,
      screenX: x + window.screenX,
      screenY: y + window.screenY,
      button: 0,
      buttons: 1,
    };
    el.dispatchEvent(new MouseEvent("mousedown", eventInit));
    await sleep(50);
    el.dispatchEvent(new MouseEvent("mouseup", eventInit));
    el.dispatchEvent(new MouseEvent("click", eventInit));
    await sleep(150);
  }

  /** @param {Element} el - Clicks element and flushes microtasks */
  async function clickElement(el, useCoords = false) {
    if (!el) throw new Error("[automation] Attempted click on null element");
    if (useCoords) return clickElementByCoords(el);
    el.click();
    await sleep(150);
  }

  /** @returns {Promise<Element>} #addSite button */
  function getAddSiteButton() {
    return waitForElement("#addSite");
  }

  /** @returns {Promise<HTMLInputElement>} URL input inside popup */
  async function getPopupInput() {
    const SELECTORS = [
      'input#input[aria-label="Site"]',
      '#input[aria-label="Site"]',
      'input[aria-label="Site"]',
      "#input",
    ];
    const deadline = Date.now() + 10_000;
    while (Date.now() < deadline) {
      for (const sel of SELECTORS) {
        const el = queryDeep(sel);
        if (el instanceof HTMLInputElement) return el;
      }
      await sleep(250);
    }
    throw new Error("[automation] Timeout: URL input not found");
  }

  /** @returns {Promise<Element>} Add button (drills into shadow DOM chain) */
  async function getAddButton() {
    const host = await waitForElement("cr-button#add");
    return (
      host.shadowRoot
        ?.querySelector("leo-button")
        ?.shadowRoot?.querySelector("button") ?? host
    );
  }

  /** Closes popup via Cancel button or Escape key */
  async function closePopup() {
    const cancelBtn = queryDeep("cr-button#cancel");
    if (cancelBtn) {
      await clickElement(cancelBtn);
      await sleep(500);
      return;
    }
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        bubbles: true,
        composed: true,
      }),
    );
    await sleep(500);
  }

  /**
   * Adds a single site URL with retry logic.
   * @param {string} url
   * @param {number} attempt
   */
  async function addSite(url, attempt = 1) {
    console.log(`[automation] ▶ ${url} (attempt ${attempt})`);

    await clickElement(await getAddSiteButton());
    await sleep(WAIT_POPUP_OPEN_MS);

    const input = await getPopupInput();
    setNativeValue(input, url);

    // Focus input again to ensure Add button activates
    input.focus();
    await sleep(WAIT_AFTER_INPUT_MS);

    let addBtnEnabled = false;
    for (let i = 0; i < 10; i++) {
      if (isAddButtonEnabled()) {
        addBtnEnabled = true;
        console.log(`[automation] ✓ Add button enabled for: ${url}`);
        break;
      }
      await sleep(200);
    }

    if (!addBtnEnabled) {
      console.warn(`[automation] ⚠ Add button still disabled for: ${url}`);
      if (hasValidationError())
        console.warn(`[automation] ⚠ Validation error detected`);
      if (attempt < MAX_RETRIES) {
        await closePopup();
        await sleep(1000);
        return addSite(url, attempt + 1);
      }
      console.log(`[automation] 🎯 Trying click anyway for: ${url}`);
    }

    const dialog = queryDeep("cr-dialog#dialog");
    const addBtn =
      dialog?.querySelector("cr-button.action-button#add") ??
      (await getAddButton());

    addBtn.click();
    await sleep(100);
    addBtn.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        composed: true,
        view: window,
      }),
    );
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        bubbles: true,
        composed: true,
      }),
    );
    await sleep(WAIT_AFTER_ADD_MS);

    if (hasValidationError()) {
      console.warn(`[automation] ⚠ Error persisted after Add click: ${url}`);
      if (attempt < MAX_RETRIES) {
        await closePopup();
        await sleep(1000);
        return addSite(url, attempt + 1);
      }
      throw new Error(`Failed to add after ${MAX_RETRIES} attempts`);
    }

    console.log(`[automation] ✅ ${url}`);
  }

  /** Main loop: iterates through SITES array with 5s delay between entries */
  async function run() {
    console.log(`[automation] 🚀 Starting – ${SITES.length} site(s)`);

    for (let i = 0; i < SITES.length; i++) {
      if (window.__stopBraveSiteAutomation === true) {
        console.warn("[automation] ⛔ Stopped manually.");
        break;
      }

      const url = SITES[i];
      console.log(`[automation] [${i + 1}/${SITES.length}] Adding → ${url}`);

      try {
        await addSite(url);
      } catch (err) {
        console.error(`[automation] ❌ ${url}`, err);
      }

      if (i < SITES.length - 1) {
        console.log("[automation] ⏳ Waiting 5s…");
        await sleep(WAIT_BETWEEN_SITES_MS);
      }
    }

    console.log("[automation] 🎉 Done!");
  }

  window.__stopBraveSiteAutomation = false;
  window.__runBraveSiteAutomation = run;
  window.__sitesBraveSiteAutomation = SITES;

  run();
})();
