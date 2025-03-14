export function textTransformPascal(text: string): string {
  try {
    if (!(typeof text === "string")) return text;
    text = `${text.slice(0, 1).toUpperCase()}${text.slice(1).toLowerCase()}`;
    return text;
  } catch (e) {
    return text.toString();
  }
}
export function dateISOtoBRL(isoDate: string): string {
  try {
    if (typeof isoDate !== "string")
      throw new Error(`Invalid typeof passed to dateISOtoBRL`);
    if (/\//g.test(isoDate) || /\\/g.test(isoDate) || /present/gi.test(isoDate))
      return isoDate;
    isoDate = isoDate.replaceAll(/[^0-9\-]/g, "");
    if (isoDate.length < 5 || !/\-/g.test(isoDate))
      throw new Error(`Invalid date passed to dateISOtoBRL`);
    let d, m, y;
    const dateFragments = isoDate.split("-");
    if (dateFragments.length === 1) {
      [y] = dateFragments;
      (m = "00"), (d = "00");
    } else if (dateFragments.length === 2) {
      [y, m] = dateFragments;
      d = "00";
    } else [y, m, d] = dateFragments;
    return `${d}/${m}/${y}`;
  } catch (e) {
    return "00/00/0000";
  }
}
export function camelToKebab(str: string): string {
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
export function camelToRegular(str: string, capitalize = true): string {
  const iniStr = str;
  if (typeof capitalize !== "boolean") capitalize = true;
  try {
    return capitalize
      ? `${str.charAt(0).toUpperCase()}${str
          .slice(1)
          .replace(/([a-z])([A-Z])/g, "$1 $2")}`
      : `${str.charAt(0)}${str.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2")}`;
  } catch (e) {
    return iniStr;
  }
}
export function kebabToCamel(str: string): string {
  const iniStr = str;
  try {
    return str
      .split("-")
      .map((fragment, i) =>
        i === 0 ? fragment : textTransformPascal(fragment)
      )
      .join("");
  } catch (e) {
    return iniStr;
  }
}
export function regularToSnake(str: string): string {
  return str
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}
export function convertToHex(
  arrColors: Array<[string, Map<string, string>]>
): [Array<boolean>, Array<[string, Map<string, string>]>] {
  const hexValidations: Array<boolean> = [];
  const rgbaToHex = (numValues: number[], alpha: number = 1): string => {
    return `#${(
      (1 << 24) +
      (numValues[0] << 16) +
      (numValues[1] << 8) +
      numValues[2]
    )
      .toString(16)
      .toUpperCase()}${Math.round(alpha * 255)
      .toString(16)
      .toUpperCase()
      .padStart(2, "0")}`;
  };
  const hslaToRgba = (
    h: number,
    s: number,
    l: number,
    a: number = 1
  ): number[] => {
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
  };
  // let acc = 0;
  for (let j = 0; j < arrColors.length; j++) {
    //array geral
    const elValidations: boolean[] = [];
    for (let e = 0; e < arrColors[j].length; e++) {
      //array de elementos individuais
      const propsValidations: boolean[] = [];
      for (let [key, value] of arrColors[j][1].entries()) {
        if (
          !/^\s?#/.test(value) &&
          !/^\d/.test(value) &&
          !/inset/g.test(value)
        ) {
          if (/none/g.test(value)) value = "rgba(0, 0, 0, 0)";
          if (/\s?rgba\(/.test(value)) {
            const numValues = value
              .match(/\d+/g)!
              .map((stNum) => parseInt(stNum.trim()));
            arrColors[j][1].set(key, rgbaToHex(numValues, numValues[3]));
            propsValidations.push(true);
            elValidations.push(true);
            hexValidations.push(true);
          } else if (/\s?rgb\(/.test(value)) {
            const numValues = value
              .match(/\d+/g)!
              .map((stNum) => parseInt(stNum.trim()));
            arrColors[j][1].set(key, rgbaToHex(numValues));
            propsValidations.push(true);
            elValidations.push(true);
            hexValidations.push(true);
          } else if (/\s?hsla\(/.test(value)) {
            const hslaNumValues = value
              .match(/\d+/g)!
              .map((stNum) => parseInt(stNum.trim()));
            const rgbaNumValues = hslaToRgba(
              hslaNumValues[0],
              hslaNumValues[1] / 100,
              hslaNumValues[2] / 100,
              hslaNumValues[3]
            );
            arrColors[j][1].set(
              key,
              rgbaToHex(rgbaNumValues, rgbaNumValues[3])
            );
            propsValidations.push(true);
            elValidations.push(true);
            hexValidations.push(true);
          } else if (/\s?hsl\(/.test(value)) {
            const hslNumValues = value
              .match(/\d+/g)!
              .map((stNum) => parseInt(stNum.trim()));
            const rgbaNumValues = hslaToRgba(
              hslNumValues[0],
              hslNumValues[1] / 100,
              hslNumValues[2] / 100
            );
            arrColors[j][1].set(key, rgbaToHex(rgbaNumValues));
            propsValidations.push(true);
            elValidations.push(true);
            hexValidations.push(true);
          } else {
            propsValidations.push(false);
            elValidations.push(false);
            hexValidations.push(false);
          }
        }
      }
      if (propsValidations.some((propValidity) => propValidity === false)) {
        elValidations.push(false);
        hexValidations.push(false);
      }
    }
    if (elValidations.some((elValidity) => elValidity === false))
      hexValidations.push(false);
  }
  return [hexValidations, arrColors];
}
//function for facilitating conversion of types when passing properties to DOM elements
export function updateSimpleProperty(el: targEl): primitiveType {
  if (el instanceof HTMLInputElement) {
    if (el.type === "radio" || el.type === "checkbox")
      return (el as HTMLInputElement).checked.toString();
    else if (
      el.type === "number" ||
      el.type === "text" ||
      el.type === "tel" ||
      el.type === "password" ||
      el.type === "url"
    ) {
      const normalizedValue = parseFloat(
        el.value?.replaceAll(/[^0-9+\-.,]/g, "").replace(/,/g, ".")
      );
      return Number.isFinite(normalizedValue) ? normalizedValue : 0;
    } else return el.value || "0";
  } else if (
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement
  )
    return el.value;
  return "-1";
}
