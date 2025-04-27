export type imageLikeElement = HTMLInputElement | HTMLImageElement;
export type inputLikeElement =
  | HTMLInputElement
  | HTMLTextAreaElement;
export type listElement =
  | HTMLUListElement
  | HTMLOListElement
  | HTMLMenuElement;
export type genericElement =
  | HTMLDivElement
  | HTMLSpanElement;
export type entryElement =
  | inputLikeElement
  | HTMLSelectElement;
export type disableableElement =
  | entryElement
  | HTMLButtonElement;
export type pressableElement =
  | HTMLButtonElement
  | HTMLInputElement;
export default class DOMValidator {
  static hasAnyClass(el: Element, compared: Array<string>) {
    return compared.some(cls => el.classList.contains(cls));
  }
  static isGeneric(el: Element): el is genericElement {
    return (
      el instanceof HTMLDivElement ||
      el instanceof HTMLSpanElement
    );
  }
  static isCustomTextbox(
    el: EventTarget
  ): el is HTMLElement {
    return (
      el instanceof HTMLElement &&
      el.contentEditable === "true" &&
      el.classList.contains("textbox")
    );
  }
  static isTextbox(
    el: EventTarget
  ): el is inputLikeElement {
    return (
      this.isDefaultTextbox(el) || this.isCustomTextbox(el)
    );
  }
  static isDefaultTextbox(
    el: EventTarget
  ): el is inputLikeElement {
    return (
      (el instanceof HTMLInputElement &&
        el.type === "text") ||
      el instanceof HTMLTextAreaElement
    );
  }
  static isCustomCheckbox(
    el: EventTarget
  ): el is HTMLElement {
    return (
      el instanceof HTMLElement &&
      (el.role === "checkbox" ||
        el.classList.contains("checkbox"))
    );
  }
  static isDefaultCheckbox(
    el: EventTarget
  ): el is HTMLInputElement {
    return (
      el instanceof HTMLInputElement &&
      el.type === "checkbox"
    );
  }
  static isCheckbox(el: EventTarget): el is HTMLElement {
    return (
      this.isDefaultCheckbox(el) ||
      this.isCustomCheckbox(el)
    );
  }
  static isCustomRadio(el: EventTarget): el is HTMLElement {
    return (
      el instanceof HTMLElement &&
      (el.role === "radio" ||
        el.classList.contains("radio"))
    );
  }
  static isDefaultRadio(
    el: EventTarget
  ): el is HTMLInputElement {
    return (
      el instanceof HTMLInputElement && el.type === "radio"
    );
  }
  static isRadio(el: EventTarget): el is HTMLElement {
    return (
      this.isDefaultRadio(el) || this.isCustomRadio(el)
    );
  }
  static isCustomButton(
    el: EventTarget
  ): el is HTMLElement {
    return (
      el instanceof HTMLElement &&
      (el.role === "button" ||
        el.classList.contains("button") ||
        el.classList.contains("btn"))
    );
  }
  static isButton(el: EventTarget): el is HTMLElement {
    return (
      this.isDefaultPressable(el) || this.isCustomButton(el)
    );
  }
  static isCustomImage(el: EventTarget): el is HTMLElement {
    return (
      el instanceof HTMLElement &&
      (el.role === "img" ||
        el.classList.contains("img") ||
        el.classList.contains("image"))
    );
  }
  static isDefaultImage(
    el: EventTarget
  ): el is imageLikeElement {
    return (
      el instanceof HTMLImageElement ||
      (el instanceof HTMLInputElement &&
        el.type === "image")
    );
  }
  static isImage(el: EventTarget): el is HTMLElement {
    return (
      this.isDefaultImage(el) || this.isCustomImage(el)
    );
  }
  static isTable(el: EventTarget): el is HTMLElement {
    return (
      el instanceof HTMLTableElement ||
      (el instanceof HTMLElement &&
        el.classList.contains("table"))
    );
  }
  static isCustomPressable(
    el: EventTarget
  ): el is HTMLElement {
    return (
      this.isCustomButton(el) ||
      (el instanceof HTMLElement &&
        el.classList.contains("pressable"))
    );
  }
  static isDefaultPressable(
    el: EventTarget
  ): el is pressableElement {
    return (
      el instanceof HTMLButtonElement ||
      (el instanceof HTMLInputElement &&
        (el.type === "button" ||
          el.type === "submit" ||
          el.type === "reset"))
    );
  }
  static isPressable(el: EventTarget): el is HTMLElement {
    return (
      this.isDefaultPressable(el) ||
      this.isCustomPressable(el)
    );
  }
  static isCustomCheckable(
    el: EventTarget
  ): el is HTMLElement {
    return (
      this.isCustomCheckbox(el) ||
      this.isCustomRadio(el) ||
      (el instanceof HTMLElement &&
        el.classList.contains("checkable"))
    );
  }
  static isDefaultCheckable(
    el: EventTarget
  ): el is HTMLInputElement {
    return (
      el instanceof HTMLInputElement &&
      (el.type === "checkbox" || el.type === "radio")
    );
  }
  static isCheckable(el: EventTarget): el is HTMLElement {
    return (
      this.isDefaultCheckable(el) ||
      this.isCustomCheckable(el)
    );
  }
  static isDefaultRequireableInput(
    el: EventTarget
  ): el is HTMLInputElement {
    return (
      el instanceof HTMLInputElement &&
      !(
        el.type === "hidden" ||
        el.type === "button" ||
        el.type === "reset" ||
        el.type === "submit" ||
        el.type === "image"
      )
    );
  }
  static isDefaultWritableInput(
    el: EventTarget
  ): el is HTMLInputElement {
    return (
      el instanceof HTMLInputElement &&
      [
        "text",
        "number",
        "email",
        "password",
        "tel",
        "url",
        "search",
        "date",
        "datetime-local",
        "month",
        "week",
        "time",
      ].some(t => t === el.type)
    );
  }
  static isCustomSelector(
    el: EventTarget
  ): el is HTMLElement {
    return (
      (el as HTMLElement).role === "listbox" ||
      (el as HTMLElement).role === "menubox" ||
      (el as HTMLElement).role === "combobox"
    );
  }
  static isCustomEntry(el: EventTarget): el is HTMLElement {
    return (
      this.isCustomCheckable(el) ||
      this.isCustomTextbox(el) ||
      this.isCustomSelector(el)
    );
  }
  static isDefaultEntry(
    el: EventTarget
  ): el is entryElement {
    return (
      this.isDefaultRequireableInput(el) ||
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLSelectElement
    );
  }
  static isEntry(el: EventTarget): el is HTMLElement {
    return (
      this.isDefaultEntry(el) || this.isCustomEntry(el)
    );
  }
  static isCustomDisableable(
    el: EventTarget
  ): el is HTMLElement {
    return (
      this.isCustomPressable(el) || this.isCustomEntry(el)
    );
  }
  static isDefaultDisableable(
    el: EventTarget
  ): el is disableableElement {
    return (
      this.isDefaultPressable(el) || this.isDefaultEntry(el)
    );
  }
  static isDisableable(el: EventTarget): el is HTMLElement {
    return (
      this.isDefaultDisableable(el) ||
      this.isCustomDisableable(el)
    );
  }
  static isDefaultList(el: EventTarget): el is listElement {
    return (
      el instanceof HTMLUListElement ||
      el instanceof HTMLOListElement ||
      el instanceof HTMLDataListElement ||
      el instanceof HTMLMenuElement
    );
  }
  static isHourInput(
    el: EventTarget
  ): el is HTMLInputElement {
    return (
      el instanceof HTMLInputElement &&
      (el.type === "datetime-local" || el.type === "time")
    );
  }
  static isDayInput(
    el: EventTarget
  ): el is HTMLInputElement {
    return (
      el instanceof HTMLInputElement &&
      (el.type === "date" || el.type === "datetime-local")
    );
  }
  static isMonthInput(
    el: EventTarget
  ): el is HTMLInputElement {
    return (
      el instanceof HTMLInputElement &&
      (el.type === "date" ||
        el.type === "datetime-local" ||
        el.type === "month")
    );
  }
  static isYearInput(
    el: EventTarget
  ): el is HTMLInputElement {
    return (
      el instanceof HTMLInputElement &&
      (el.type === "date" ||
        el.type === "datetime-local" ||
        el.type === "month" ||
        el.type === "week")
    );
  }
}
