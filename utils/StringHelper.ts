import { PseudoNum } from "../foundations";
export default class StringHelper {
  public static LOWERCASE_ACCENTED = "a-záàâäãéèêëíìîïóòôöõúùûüçñ";
  public static UPPERCASE_ACCENTED = "A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜÇÑ";
  public static capitalizedLatin = (g: boolean = false): RegExp =>
    new RegExp(`[${StringHelper.UPPERCASE_ACCENTED}]`, g ? "g" : "");
  public static capturedLatinized = (g: boolean = false): RegExp =>
    new RegExp(
      `([${StringHelper.LOWERCASE_ACCENTED}])([${StringHelper.UPPERCASE_ACCENTED}])`,
      g ? "g" : ""
    );
  public static combinedLatinDigits = (g: boolean = false): RegExp =>
    new RegExp(
      `[${StringHelper.LOWERCASE_ACCENTED}${StringHelper.UPPERCASE_ACCENTED}0-9]`,
      g ? "g" : ""
    );
  public static latinizedPersianAndScription = (g: boolean = false): RegExp =>
    new RegExp(
      `[${StringHelper.LOWERCASE_ACCENTED}${StringHelper.UPPERCASE_ACCENTED}_\u200C\u200D]`,
      g ? "g" : ""
    );
  public static emojis = (g: boolean = false) =>
    new RegExp(
      "[\uD83D\uDE00-\uD83D\uDE4F" + // Emoticons (Smileys)
        "\uD83C\uDF00-\uD83D\uDDFF" + // Misc Symbols & Pictographs
        "\uD83D\uDE80-\uD83D\uDEFF" + // Transport & Map Symbols
        "\uD83E\uDD00-\uD83E\uDDFF" + // Supplemental Symbols & Pictographs
        "\uD83E\uDE70-\uD83E\uDEFF" + // Additional Emoji Extensions
        "\u2600-\u26FF" + // Miscellaneous Symbols
        "\u2700-\u27BF" + // Dingbats
        "\uD83C\uDDE6-\uD83C\uDDFF" + // Regional Indicator Symbols (Flags)
        "\uD83C\uDF00-\uD83C\uDFFF" + // Enclosed Ideographic Supplement
        "\u2640\u2642" + // Gender Symbols
        "\uD83C\uDFFB-\uD83C\uDFFF" + // Skin Tone Modifiers
        "]",
      g ? "g" : ""
    );
  public static invalidAttrChars = (): RegExp =>
    /[\s"'<>\/=~!@#$%^&*()+=|{}[\];"\\,<>?]/g;
  public static escapableRegexChars = (): RegExp => /[.*+?^${}()|[\]\\]/g;
  public static diacriticalChars = (): RegExp => /[\u0300-\u036f]/g;
  public static capitalize(v: string): string {
    if (!v?.length) return "";
    return v.length === 1
      ? v.toUpperCase()
      : `${v.charAt(0).toUpperCase()}${v.slice(1)}`;
  }
  public static uncapitalize(v: string): string {
    return `${v.charAt(0).toLowerCase()}${v.slice(1)}`;
  }
  public static pascalToSnake(v: string): string {
    if (!v?.length) return "";
    v = StringHelper.spaceToUnderscore(v);
    if (!this.isUpperCase(v.charAt(0)))
      return !this.isUpperCase(v) ? v : this.camelToSnake(v);
    return `${v.charAt(0).toUpperCase()}${v
      .slice(1)
      .replace(StringHelper.capitalizedLatin(true), "$1_$2")}`;
  }
  public static camelToSnake(v: string): string {
    if (
      !v ||
      (typeof v === "string" && !StringHelper.capitalizedLatin().test(v))
    )
      return v;
    v = StringHelper.spaceToUnderscore(v);
    return v.replace(StringHelper.capturedLatinized(true), `$1_$2`);
  }
  public static camelToKebab(str: string): string {
    const iniStr = str;
    try {
      return str
        .split(/(?=[A-Z])/g)
        .join("-")
        .toLowerCase();
    } catch (e) {
      return iniStr;
    }
  }
  public static snakeToCamel(v: string): string {
    if (!v?.length || !/_/g.test(v)) return v;
    return `${v.slice(0, 2)}${v
      .slice(2)
      .replace(
        new RegExp(`(?:_{2,})([${StringHelper.LOWERCASE_ACCENTED}])`, "g"),
        `_$1`
      )
      .replace(new RegExp(`_[${StringHelper.LOWERCASE_ACCENTED}]`, "g"), s =>
        s.charAt(1).toUpperCase()
      )}`;
  }
  public static snakeToKebab(v: string): string {
    if (!v?.length || !/_/.test(v)) return v;
    return v.replace(
      new RegExp(
        `_([${StringHelper.LOWERCASE_ACCENTED}${StringHelper.UPPERCASE_ACCENTED}0-9])`,
        "g"
      ),
      "-$1"
    );
  }
  public static kebabToCamel(str: string): string {
    const iniStr = str;
    try {
      return str
        .split("-")
        .map((fragment, i) =>
          i === 0 ? fragment : StringHelper.capitalize(fragment)
        )
        .join("");
    } catch (e) {
      return iniStr;
    }
  }
  public static kebabToSnake(v: string): string {
    if (!v?.length || !/_/.test(v)) return v;
    return v.replace(
      new RegExp(
        `-([${StringHelper.LOWERCASE_ACCENTED}${StringHelper.UPPERCASE_ACCENTED}0-9])`,
        "g"
      ),
      "_$1"
    );
  }
  public static isUpperCase(c: string): boolean {
    if (!c?.length) return false;
    if (c.length > 1) c = c.slice(0, 1);
    return c >= "A" && c <= "Z";
  }
  public static spaceToUnderscore(v: string, double: boolean = true): string {
    const spaceRegex = /\s/g;
    if (!spaceRegex.test(v)) return v;
    return v.replace(spaceRegex, double ? "__" : "_");
  }
  public static removeDiacritical(v: string): string {
    return v.normalize("NFD").replace(StringHelper.diacriticalChars(), "");
  }
  public static removeEmojis(v: string): string {
    return v.replace(
      /[\u1F600-\u1F64F]|[\u1F300-\u1F5FF]|[\u1F680-\u1F6FF]|[\u1F900-\u1F9FF]|[\u1FA70-\u1FAFF]|[\u2600-\u26FF]|[\u2700-\u27BF]|[\u1F1E6-\u1F1FF]|[\u1F100-\u1F1FF]|[\u1FA00-\u1FA6F]|\u2640|\u2642|[\u1F3FB-\u1F3FF]/g,
      ""
    );
  }
  public static slugify(v: string, lower: boolean = true): string {
    return lower
      ? this.removeEmojis(this.removeDiacritical(v))
          .replace(
            new RegExp(`[^${StringHelper.combinedLatinDigits()}]+`, "g"),
            "-"
          )
          .replace(/^-+|-+$/g, "")
      : this.removeEmojis(this.removeDiacritical(v))
          .replace(
            new RegExp(`[^${StringHelper.combinedLatinDigits()}]+`, "g"),
            "-"
          )
          .replace(/^-+|-+$/g, "");
  }
  public static isSaneAttrName(v: string): boolean {
    return (
      /^[a-zA-Z_:]/.test(v) &&
      !/^[0-9]/.test(v) &&
      !StringHelper.invalidAttrChars().test(v)
    );
  }
  public static sanitizePropertyName(v: string): string {
    return (
      v
        .replace(/-/g, "_")
        .replace(/\s+/g, "__")
        /* eslint-disable */
        .replace(/[^\p{L}\p{N}\p{Pc}\p{Mn}\u200C\u200D_]/gu, "")
        .replace(
          new RegExp(
            `^[^${StringHelper.LOWERCASE_ACCENTED}${StringHelper.UPPERCASE_ACCENTED}_\u200C\u200D]`
          ),
          s => `_${s}`
        )
    );
    /* eslint-enable */
  }
  public static scapeToConstructRegExp(
    v: string,
    flags: string | undefined
  ): RegExp {
    return new RegExp(
      v.replace(StringHelper.escapableRegexChars(), "\\$&"),
      flags
    );
  }
  public static unfriendlyName(v: string, pascal: boolean = false): string {
    return pascal
      ? StringHelper.capitalize(StringHelper.sanitizePropertyName(v))
      : StringHelper.uncapitalize(StringHelper.sanitizePropertyName(v));
  }
  public static padToISO(
    v: number | string,
    to: number = 2,
    using: PseudoNum = "0"
  ): string {
    return v.toString().padStart(to, using);
  }
}
