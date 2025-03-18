import {
  CSSDisplay,
  inputLikeElement,
  nlHtEl,
  nlStr,
} from "../../helpers";
import StyleValidator from "./StyleValidator";
import CompabilityValidator from "../CompabilityValidator";
import DOMHandler from "./DOMHandler";
import DOMValidator from "../DOMValidator";
import { PseudoNum } from "../../foundations";
import MathHandler from "../../utils/MathHandler";
export const borderColors: { [k: string]: string } = {};
export const fontColors: { [k: string]: string } = {};
export const pseudos: Map<
  string,
  Map<string, Map<string, string>>
> = new Map();
export default class StyleHandler {
  static placeholderCounter = 0.7;
  static alarmColor = "#811";
  static toggleVisibility(
    element: nlHtEl,
    condition: any,
    visibleAs: CSSDisplay = "block"
  ): void {
    if (!(element instanceof HTMLElement)) return;
    if (!StyleValidator.evaluateDisplay(visibleAs))
      element.style.display = "block";
    /* eslint-disable */
    condition
      ? (element.style.display = visibleAs)
      : "none";
    /* eslint-enable */
  }
  static blurOnChange(
    el: nlHtEl,
    curr: number = 0.8,
    prev: number = 1
  ): void {
    if (!(el instanceof HTMLElement)) return;
    const cps = getComputedStyle(el);
    if (cps.transition === "")
      el.style.transition = "opacity 0.5s ease-in-out";
    else
      el.style.transition += ", opacity 0.5s ease-in-out";
    setTimeout(() => {
      if (!(el instanceof HTMLElement)) return;
      el.style.opacity = curr.toString();
    }, 50);
    setTimeout(() => {
      if (!(el instanceof HTMLElement)) return;
      el.style.opacity = prev.toString();
    }, 50);
  }
  static findStyleSheet(
    styleSheetIdentifier: RegExp,
    attr = "href"
  ): CSSStyleSheet | undefined {
    const matchedSheets = [...document.styleSheets].filter(
      s => attr in s && (s as any)[attr]
    );
    if (!matchedSheets) return;
    return matchedSheets.find(s =>
      styleSheetIdentifier.test((s as any)[attr])
    );
  }
  static findCssRule(
    sheet: CSSStyleSheet,
    ruleIdentifier: RegExp
  ): number {
    return [...sheet.cssRules].findIndex(r =>
      ruleIdentifier.test(r.cssText)
    );
  }
  static replaceCssRule(
    sheet: CSSStyleSheet,
    i: number,
    newRule: string,
    expand: boolean = false
  ): boolean {
    if (i < 0) return false;
    let previous;
    if (expand) previous = sheet.cssRules[i];
    sheet.deleteRule(i);
    if (expand) {
      if (!previous) return false;
      sheet.insertRule(
        `${previous.cssText.slice(0, -3)}; ${newRule}; }`,
        i
      );
    } else sheet.insertRule(newRule, i);
    return true;
  }
  static defineRangeThumbPseudoElement(): nlStr {
    if (CompabilityValidator.isWebkit())
      return "::-webkit-slider-thumb";
    else if (CompabilityValidator.isFirefox())
      return "::-moz-range-thumb";
    else if (CompabilityValidator.isExplorer())
      return "::-ms-thumb";
    else return null;
  }
  static defineRangeTrackPseudoElement(): nlStr {
    if (CompabilityValidator.isWebkit())
      return "::-webkit-slider-runnable-track";
    else if (CompabilityValidator.isFirefox())
      return "::-moz-range-track";
    else if (CompabilityValidator.isExplorer())
      return "::-ms-track";
    else return null;
  }
  static updatePseudos({
    idf,
    pseudo,
    prop,
    value,
  }: {
    idf: string;
    pseudo: string;
    prop: string;
    value: string;
  }): void {
    const pseudoStyles = document.getElementById("pseudos");
    if (!pseudoStyles) return;
    if (!CSS.supports(prop, value)) return;
    let identified = pseudos.get(idf);
    if (!identified) {
      identified = new Map();
      pseudos.set(idf, identified);
    }
    let selector = identified.get(pseudo);
    if (!selector) {
      selector = new Map();
      identified.set(pseudo, selector);
    }
    selector.set(prop, value);
    pseudoStyles.innerText = "";
    let styles = "";
    for (const [pseudoKey, rules] of identified.entries()) {
      styles += `${idf}${pseudoKey} { `;
      for (const [ruleKey, ruleValue] of rules.entries())
        styles += `${ruleKey}: ${ruleValue}; `;
      styles += `}`;
    }
    pseudoStyles.innerText = styles;
  }
  static pulseColor(
    el: nlHtEl,
    color: string = StyleHandler.alarmColor,
    context: string = "both",
    double: boolean = false
  ): void {
    if (
      !(
        el instanceof HTMLElement &&
        typeof color === "string"
      )
    )
      return;
    const id = DOMHandler.getIdentifier(el),
      iniColor = id
        ? borderColors[id]
        : "rgb(222, 226, 230)",
      iniFontColor = id
        ? fontColors[id]
        : "rgb(33, 37, 41)",
      pulseBColor = (): void => {
        setTimeout(() => {
          if (!id) return;
          const el = DOMHandler.queryByUniqueName(id);
          if (!el) return;
          if (!el.style.transition)
            el.style.transition = "border 0.5s ease-in";
          else el.style.transition += "border 0.5s ease-in";
          el.style.borderColor = color;
          setTimeout(() => {
            const el = DOMHandler.queryByUniqueName(id);
            if (!el) return;
            el.style.borderColor = iniColor;
          }, 750);
        }, 250);
      },
      pulseFColor = (): void => {
        setTimeout(() => {
          if (!id) return;
          const el = DOMHandler.queryByUniqueName(id);
          if (!el) return;
          if (el.style.transition)
            el.style.transition += "color 0.5s ease-in";
          else el.style.transition = "color 0.5s ease-in";
          el.style.color = color;
          setTimeout(() => {
            const el = DOMHandler.queryByUniqueName(id);
            if (!el) return;
            el.style.color = iniFontColor;
          }, 750);
        }, 250);
      };
    el.dataset.pulsing = "true";
    if (context === "both" || context === "border") {
      pulseBColor();
      double && setTimeout(pulseBColor, 1600);
    }
    if (context === "both" || context === "font") {
      pulseFColor();
      double && setTimeout(pulseFColor, 1600);
    }
    setTimeout(() => {
      if (!id) return;
      const el = DOMHandler.queryByUniqueName(id);
      if (!el) return;
      el.dataset.pulsing = "false";
    }, 1600);
  }
  static alarmBorder(
    el: HTMLElement,
    color: string = StyleHandler.alarmColor
  ): void {
    const id = DOMHandler.getIdentifier(el);
    if (!id) return;
    const baseColor = borderColors[id];
    if (!baseColor) return;
    if (
      (DOMValidator.isDefaultEntry(el) &&
        !el.checkValidity()) ||
      (DOMValidator.isCustomEntry(el) &&
        el.dataset.invalid === "true")
    ) {
      el.style.borderColor = color;
      setTimeout(() => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.borderColor = baseColor;
      }, 2000);
    } else el.style.borderColor = baseColor;
  }
  static switchPlaceholder(
    el: inputLikeElement,
    newPh: string = "...",
    newColor = StyleHandler.alarmColor
  ): void {
    const prev = el.placeholder,
      id = DOMHandler.getIdentifier(el),
      idRef = "placeholdersStyles";
    if (!id || !newPh) return;
    el.placeholder = newPh;
    let phs = document.getElementById(idRef);
    if (!phs) {
      phs = document.createElement("style");
      phs.id = idRef;
    }
    if (!phs.innerHTML)
      phs.innerHTML = `${[...el.classList].map(
        c => `.${c}`
      )}${
        el.id ? `#${el.id}` : ""
      }::placeholder { color: ${newColor}; opacity: ${0.7}; }`;
    else
      phs.innerHTML += `\n${[...el.classList].map(
        c => `.${c}`
      )}${
        el.id ? `#${el.id}` : ""
      }::placeholder { color: ${newColor}; opacity: ${0.7}; }`;
    const interv = setInterval(i => {
      const phs = document.getElementById(idRef);
      if (!phs || !/opacity/g.test(phs.innerHTML)) {
        clearInterval(i);
        return;
      }
      StyleHandler.placeholderCounter -= 0.05;
      phs.innerHTML.replace(
        /opacity\:\s([0-1]?\.[0-9]+);/g,
        () => `opacity: ${StyleHandler.placeholderCounter};`
      );
    }, 250);
    setTimeout(() => {
      interv && clearInterval(interv);
      const phs = document.getElementById(idRef);
      phs && phs.remove();
      if (!id) return;
      const el = DOMHandler.queryByUniqueName(id);
      if (
        !(
          el &&
          (DOMValidator.isDefaultTextbox(el) ||
            DOMValidator.isDefaultWritableInput(el))
        )
      )
        return;
      el.placeholder = prev;
    }, 3500);
  }
  static ticking: { [k: string]: boolean } = {};
  static tickFading(
    el: nlHtEl,
    base: PseudoNum = "1",
    limit: number = 1,
    js?: boolean
  ): void {
    if (!el) return;
    const transition = getComputedStyle(el).transition;
    if (/opacity/gi.test(transition)) {
      if (transition.includes(","))
        el.style.transition = `${transition
          .split(",")
          .filter(r => !/opacity/gi.test(r))
          .map(r => r.trim())
          .join(", ")}`;
      else el.style.transition = "";
    }
    let prev = getComputedStyle(el).opacity;
    const id = DOMHandler.getIdentifier(el);
    if (!id) return;
    void el.offsetHeight;
    StyleHandler.ticking[id] = true;
    if (!js) {
      el.style.opacity = "0";
      setTimeout(() => {
        let element = el;
        if (!element?.isConnected)
          element = DOMHandler.queryByUniqueName(id);
        if (!element?.isConnected) return;
        element.style.opacity = "1";
      }, 500);
    } else {
      let acc = 0;
      const interv = setInterval(i => {
        if (MathHandler.parseNotNaN(prev) >= limit) {
          StyleHandler.ticking[id] = false;
          clearInterval(i);
          return;
        }
        if (!StyleHandler.ticking[id]) return;
        if (prev === "0" && base === "1") return;
        if (!el?.isConnected) {
          if (!id) return;
          el = DOMHandler.queryByUniqueName(id);
        }
        if (!el?.isConnected) return;
        let newValue = MathHandler.parseNotNaN(
          getComputedStyle(el).opacity,
          MathHandler.parseNotNaN(prev)
        );
        if (
          !/^(?=.*\d)\d+(\.\d+)?$/.test(newValue.toString())
        )
          return;
        const ft = 0.025;
        if (!acc && newValue % ft !== 0)
          newValue = newValue - (newValue % ft);
        newValue += ft;
        if (newValue > limit) newValue = limit;
        el.style.opacity = newValue.toString();
        acc += 1;
      }, 100);
      setTimeout(() => {
        clearInterval(interv);
        const el = DOMHandler.queryByUniqueName(id);
        if (!el) return;
        if (StyleHandler.ticking[id]) {
          el.style.opacity = limit.toString();
          StyleHandler.ticking[id] = false;
        }
      }, 2000);
    }
  }
}
