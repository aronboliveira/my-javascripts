// import { toast } from "react-hot-toast";
import {
  HTTPReturnsFriendly,
  Processor,
  PseudoNum,
} from "../../foundations";
import DOMValidator from "../DOMValidator";
import { entryElement } from "../../helpers";
import MathHandler from "../../utils/MathHandler";
import StyleHandler from "../styles/StyleHandler";
import DOMHandler from "../DOMHandler";
import flags from "../domFlags";
import {
  HTTPRes,
  HTTPReturnsFriendlyEn,
  HTTPReturnsFriendlyPt,
  StartingHTTPDigits,
} from "../domVars";
export default class FormProcessor implements Processor<HTMLElement> {
  private static _instance: FormProcessor;
  constructor() {
    if (!FormProcessor._instance) FormProcessor._instance = this;
  }
  public construct(): FormProcessor {
    return FormProcessor._instance
      ? FormProcessor._instance
      : new FormProcessor();
  }
  public process(el: HTMLElement): number {
    if (DOMValidator.isDefaultEntry(el)) {
      const res = this.#evaluateDefaulEntry(el);
      if (typeof res !== "boolean") return -1;
      else return res ? 1 : 0;
    } else {
      const res = this.#evaluateCustomEntry(el);
      if (typeof res !== "boolean") return -1;
      else return res ? 1 : 0;
    }
  }
  #evaluateDefaulEntry(el: entryElement): boolean | void {
    if (el instanceof HTMLInputElement) {
      const res = this.#evaluateDefaultInput(el);
      if (typeof res !== "boolean") return;
      else return res;
    } else if (el instanceof HTMLSelectElement) return this.#evaluateSelect(el);
    else if (el instanceof HTMLTextAreaElement)
      return this.#evaluateTextArea(el);
    else return;
  }
  #evaluateDefaultInput(el: HTMLInputElement): boolean | void {
    if (el.type === "checkbox" || el.type === "radio")
      return this.#evaluateCheckable(el);
    else if (DOMValidator.isDefaultWritableInput(el))
      return DOMHandler.verifyValidity(el);
    else if ((el as HTMLInputElement).type === "color") {
      const max = (el as HTMLInputElement).dataset.max,
        min = (el as HTMLInputElement).dataset.min,
        id = DOMHandler.getIdentifier(el),
        handleInvalidity = (el: HTMLElement): void => {
          el.dataset.invalid = "true";
          el.setAttribute("aria-invalid", "true");
          StyleHandler.pulseColor(el);
          setTimeout(() => {
            if (!id) return;
            const el = document.getElementById(id);
            if (!el) return;
            el.removeAttribute("dataset-invalid");
            el.removeAttribute("aria-invalid");
          }, 4000);
        };
      if (max) {
        const decMax = MathHandler.hexToDecimal(max),
          decV = MathHandler.hexToDecimal((el as HTMLInputElement).value);
        if (!Number.isFinite(decMax)) return true;
        if (!Number.isFinite(decV) || decV > decMax) {
          /* eslint-disable */
          (el as HTMLInputElement).required && handleInvalidity(el);
          /* eslint-enable */
          return false;
        }
      }
      if (min) {
        const decMin = MathHandler.hexToDecimal(min),
          decV = MathHandler.hexToDecimal((el as HTMLInputElement).value);
        if (!Number.isFinite(decMin)) return true;
        if (!Number.isFinite(decV) || decV < decMin) {
          (el as HTMLInputElement).required && handleInvalidity(el);
          return false;
        }
      }
      return true;
    } else if ((el as HTMLInputElement).type === "file") {
      const res = this.#evaluateFileInput(el);
      if (typeof res !== "boolean") return;
      else return res;
    }
    return;
  }
  #evaluateFileInput(el: HTMLInputElement): boolean | void {
    const { dataset: ds } = el;
    const friendlyname =
      el.dataset.friendlyname ||
      el.labels?.[0]?.innerText ||
      el.name ||
      el.id ||
      el.tagName;
    if (el.type !== "file") return;
    if (
      ds.minfiles &&
      (!el.files ||
        (el.files &&
          el.files.length < MathHandler.parseNotNaN(ds.minfiles, 1, "int")))
    ) {
			// PLACEHOLDER > USE YOUR ACTUAL TOAST
      alert(
        flags.pt
          ? `Elemento de upload de arquivos ${friendlyname} recebeu menos arquivos do que esperado`
          : `Element for uploading files ${friendlyname} received less files than expected`
      );
    }
    if (ds.maxfiles) {
      if (!el.files) return;
      if (el.files.length > MathHandler.parseNotNaN(ds.maxfiles, 1, "int"))
        return false;
    }
    if (el.files) {
      for (let i = 0; i < el.files.length; i++) {
        const f = el.files[i];
        if (ds.maxsize) {
          const maxSize = MathHandler.parseNotNaN(ds.maxsize, 1048576, "int"); // default 1MB
          if (f.size > maxSize) {
            alert(
              flags.pt
                ? `Arquivo de índice ${i} para ${friendlyname} maior do que o aceito`
                : `File of index ${i} for ${friendlyname} larger than what is accepted`
            );
            return false;
          }
        }
        if (ds.minsize) {
          const minSize = MathHandler.parseNotNaN(ds.minsize, 1, "int");
          if (f.size < minSize) {
            alert(
              flags.pt
                ? `Arquivo de índice ${i} para ${friendlyname} menor do que o aceito`
                : `File of index ${i} for ${friendlyname} smaller than what is accepted`
            );
            return false;
          }
        }
        if (ds.accept) {
          const exts = ds.accept.split(",").map(s => s.trim().toLowerCase()),
            mime = f.type.toLowerCase();
          if (
            !exts.some(
              ext => `.${f.name.split(".").pop()?.toLowerCase()}` === ext
            ) ||
            exts.some(ext => mime === ext)
          )
            return false;
        }
      }
    }
    return DOMHandler.verifyValidity(el);
  }
  #evaluateCheckable(el: HTMLInputElement): boolean | void {
    if (el.type === "radio" || el.type === "checkbox") {
      const nameds = document.getElementsByName(el.name);
      if (nameds.length === 1) return el.checked;
      else if (nameds.length > 1) return this.#evaluateRadioGroup(el);
      else return;
    } else return;
  }
  #evaluateRadioGroup(el: HTMLInputElement): boolean | void {
    try {
      const parent =
        el.closest(".radioGroup") ||
        el.closest(`[role="radiogroup"]`) ||
        el.closest(".checkGroup") ||
        el.parentElement?.parentElement;
      if (!(parent instanceof Element)) return;
      const radios = [
        ...parent.querySelectorAll('input[type="radio"]'),
        ...parent.querySelectorAll('input[type="checkbox"]'),
      ].filter(e => e instanceof HTMLInputElement && e.name === el.name);
      if (radios.length === 0) return;
      if (radios.length === 1) return el.checked;
      if (radios.length > 1) {
        return Array.from(radios).some(
          r =>
            r instanceof HTMLInputElement &&
            (r.type === "radio" || r.type === "checkbox") &&
            r.checked &&
            r.dataset.notaccepted !== "true"
        );
      }
    } catch (e) {
      return;
    }
  }
  #evaluateSelect(el: HTMLSelectElement): boolean {
    if (el.multiple) {
      const { dataset: ds } = el,
        selected = [...el.options].filter(e => e.selected);
      if (
        ds.minoptions &&
        MathHandler.parseNotNaN(ds.minoptions, 0, "int") > selected.length
      )
        return false;
      if (
        ds.maxoptions &&
        MathHandler.parseNotNaN(ds.maxoptions, el.options.length - 1, "int") <
          selected.length
      )
        return false;
    }
    if (el.dataset.notaccepted) {
      const res = el.dataset.notaccepted
        .split(",")
        .map(v => v.trim())
        .some(v => v === el.value);
      if (!res) StyleHandler.pulseColor(el);
      return res;
    }
    return true;
  }
  #evaluateTextArea(el: HTMLTextAreaElement): boolean {
    return DOMHandler.verifyValidity(el);
  }
  #evaluateCustomEntry(el: HTMLElement): boolean {
    const { dataset } = el,
      value = DOMHandler.extractValue(el);
    if (
      dataset.minlength &&
      value.length < MathHandler.parseNotNaN(dataset.minlength, 0, "int")
    )
      return false;
    if (
      dataset.maxlength &&
      value.length > MathHandler.parseNotNaN(dataset.maxlength, 0, "int")
    )
      return false;
    if (
      dataset.min &&
      MathHandler.parseNotNaN(value, 0, "float") <
        MathHandler.parseNotNaN(dataset.min, 0, "float")
    )
      return false;
    if (
      dataset.max &&
      MathHandler.parseNotNaN(value, 0, "float") >
        MathHandler.parseNotNaN(dataset.max, 0, "float")
    )
      return false;
    if (dataset.pattern && !new RegExp(dataset.pattern).test(value))
      return false;
    if (dataset.checked && (!value || value === "false")) return false;
    if (el.dataset.notaccepted)
      return el.dataset.notaccepted
        .split(",")
        .map(v => v.trim())
        .some(v => v === value);
    return true;
  }
  static getHttpResponseFriendlyMessage(code: number): string {
    const firstDigit = code.toString().slice(0, 1) as PseudoNum,
      def = "Internal Server Error";
    if (
      !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].some(
        n => n === firstDigit
      )
    )
      return def;
    const dict = HTTPRes[StartingHTTPDigits[firstDigit] || 500]?.get(code),
      lang = flags.pt ? "pt" : "en";
    if (!(dict as any)[lang]) return def;
    const msg = `${FormProcessor.classifyHttpCategory(firstDigit)} — ${
      (dict as any)[lang]
    }`;
    if (!msg) return def;
    return msg;
  }
  static classifyHttpCategory(code: string): HTTPReturnsFriendly {
    if (code.length > 1) code = code.slice(0, 1);
    switch (code) {
      case "1":
        return flags.pt ? HTTPReturnsFriendlyPt.i : HTTPReturnsFriendlyEn.i;
      case "2":
        return flags.pt ? HTTPReturnsFriendlyPt.s : HTTPReturnsFriendlyEn.s;
      case "3":
        return flags.pt ? HTTPReturnsFriendlyPt.r : HTTPReturnsFriendlyEn.r;
      case "4":
        return flags.pt ? HTTPReturnsFriendlyPt.ce : HTTPReturnsFriendlyEn.ce;
      default:
        return flags.pt ? HTTPReturnsFriendlyPt.se : HTTPReturnsFriendlyPt.se;
    }
  }
}
