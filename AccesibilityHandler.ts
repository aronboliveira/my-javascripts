import DOMValidator from "./DOMValidator";
export default class AccessibilityHandler {
  static trackAriaState(el: HTMLElement, def: boolean = false): void {
    if (el.dataset.trackingaria !== "true") {
      el.dataset.trackingaria = "true";
      if (DOMValidator.isCustomDisableable(el)) {
        this.handleStaticAttrs(el);
        if (DOMValidator.isCustomCheckable(el)) {
          el.dataset.checked = def.toString();
          this.handleCheckState(el);
        } else if (DOMValidator.isCustomPressable(el)) {
          (el as HTMLElement).dataset.pressed = def.toString();
          this.handlePressState(el);
        } else if (
          ["listbox", "menubox", "combobox", "tab", "switch"].some(
            r => r === (el as HTMLElement).role
          )
        ) {
          (el as HTMLElement).querySelectorAll("*").forEach(c => {
            if (!(c instanceof HTMLElement) || c instanceof HTMLOptionElement)
              return;
            /* eslint-disable */
            c.dataset.selected === "true"
              ? (c.ariaSelected = "true")
              : (c.ariaSelected = "false");
            /* eslint-enable */
          });
          this.handleSelect(el);
        }
      }
    }
  }
  static handleSelect(el: HTMLSelectElement): void {
    if (
      !["listbox", "menubox", "combobox", "tab", "switch"].some(
        r => r === el.role
      )
    )
      return;
    const handleMouseUp = (ev: Event): void => {
        if (!(ev.currentTarget instanceof Element)) return;
        const t = ev.currentTarget;
        setTimeout(() => {
          t?.querySelectorAll("*").forEach(c => {
            /* eslint-disable */
            if (!(c instanceof HTMLElement) || c instanceof HTMLOptionElement)
              return;
            c.dataset.selected === "true"
              ? (c.ariaSelected = "true")
              : (c.ariaSelected = "false");
            /* eslint-enable */
          });
        }, 200);
      },
      handleClick = (ev: Event): void => {
        /* eslint-disable */
        if (!(ev.currentTarget instanceof Element)) return;
        ev.currentTarget.ariaExpanded === "false"
          ? (ev.currentTarget.ariaExpanded = "true")
          : (ev.currentTarget.ariaExpanded = "false");
        /* eslint-enable */
      };
    el.addEventListener("mouseup", handleMouseUp);
    el.role === "combobox" && el.addEventListener("click", handleClick);
  }
  static handleCheckState(el: Element): void {
    el.addEventListener("mouseup", ev => {
      /* eslint-disable */
      if (
        ev.currentTarget instanceof HTMLElement &&
        DOMValidator.isCustomCheckable(ev.currentTarget) &&
        ev.currentTarget.dataset.checked
      )
        ev.currentTarget.dataset.checked === "true"
          ? ev.currentTarget.setAttribute("aria-checked", "true")
          : ev.currentTarget.setAttribute("aria-checked", "false");
      /* eslint-enable */
    });
  }
  static handlePressState(el: HTMLElement): void {
    const checkClick = (ev: Event): boolean =>
      ev instanceof MouseEvent &&
      ev.currentTarget &&
      DOMValidator.isCustomPressable(ev.currentTarget) &&
      ev.button === 0
        ? true
        : false;
    el.addEventListener("mousedown", ev => {
      const t = ev.currentTarget;
      if (checkClick(ev)) {
        (ev.currentTarget as HTMLElement).setAttribute("aria-pressed", "true");
        /* eslint-disable */
        if (
          t instanceof HTMLElement &&
          (t.ariaExpanded || t.classList.contains("expands"))
        ) {
          t.ariaExpanded === "true"
            ? t.setAttribute("aria-expanded", "false")
            : t.setAttribute("aria-expanded", "false");
          /* eslint-enable */
        }
      }
    });
    el.addEventListener(
      "mouseup",
      ev =>
        /* eslint-disable */
        checkClick(ev) &&
        (ev.currentTarget as HTMLElement).setAttribute("aria-pressed", "false")
      /* eslint-enable */
    );
  }
  static handleStaticAttrs(el: HTMLElement): void {
    if (!DOMValidator.isCustomEntry(el)) return;
    const id = el.id,
      updateAria = (): void => {
        const el = document.getElementById(id);
        if (!(el && DOMValidator.isCustomEntry(el))) return;
        el.dataset.required === "true"
          ? el.setAttribute("aria-required", "true")
          : el.setAttribute("aria-required", "false");
        el.dataset.disabled === "true"
          ? el.setAttribute("aria-disabled", "true")
          : el.setAttribute("aria-disabled", "false");
      };
    updateAria();
    setInterval(updateAria, 2000);
  }
}
