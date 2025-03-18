import { CSSDisplay } from "../../helpers";
export default class StyleValidator {
  static readonly VALID_DISPLAYS: Readonly<CSSDisplay[]> = Object.freeze([
    "none",
    "block",
    "inline",
    "inline-block",
    "flex",
    "inline-flex",
    "grid",
    "inline-grid",
    "table",
    "inline-table",
    "table-row",
    "table-cell",
    "table-column",
    "table-caption",
    "table-row-group",
    "table-header-group",
    "table-footer-group",
    "list-item",
    "contents",
    "ruby",
    "ruby-base",
    "ruby-text",
    "ruby-base-container",
    "ruby-text-container",
    "initial",
    "inherit",
    "unset",
  ]);
  static evaluateDisplay(
    value: string,
    values: CSSDisplay[] = [...StyleValidator.VALID_DISPLAYS]
  ): boolean {
    return values.includes(value as CSSDisplay) ? true : false;
  }
  static scanPseudoSelectorTag(): HTMLElement | null {
    if (
      ![...document.querySelectorAll("style")].some(
        style => style.id === "pseudos"
      )
    ) {
      const e = document.createElement("style");
      e.id = "pseudos";
      document.body.append(e);
    }
    return document.getElementById("pseudos");
  }
}
