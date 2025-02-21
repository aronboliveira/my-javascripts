import StringHelper from "./StringHelper";
export const limits: Readonly<{
  tiny: {
    MAX_UTF16_SIGNED_SURROGATE: number;
    MAX_UTF16_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_SIGNED_SURROGATE: () => number;
    MAX_UTF8_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF16_UNSIGNED_SURROGATE: () => number;
    MAX_UTF16_UNSIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_UNSIGNED_SURROGATE: () => number;
    MAX_UTF8_UNSIGNED_NOTSURROGATE: () => number;
  };
  small: {
    MAX_UTF16_SIGNED_SURROGATE: number;
    MAX_UTF16_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_SIGNED_SURROGATE: () => number;
    MAX_UTF8_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF16_UNSIGNED_SURROGATE: () => number;
    MAX_UTF16_UNSIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_UNSIGNED_SURROGATE: () => number;
    MAX_UTF8_UNSIGNED_NOTSURROGATE: () => number;
  };
  medium: {
    MAX_UTF16_SIGNED_SURROGATE: number;
    MAX_UTF16_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_SIGNED_SURROGATE: () => number;
    MAX_UTF8_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF16_UNSIGNED_SURROGATE: () => number;
    MAX_UTF16_UNSIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_UNSIGNED_SURROGATE: () => number;
    MAX_UTF8_UNSIGNED_NOTSURROGATE: () => number;
  };
  large: {
    MAX_UTF16_SIGNED_SURROGATE: number;
    MAX_UTF16_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_SIGNED_SURROGATE: () => number;
    MAX_UTF8_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF16_UNSIGNED_SURROGATE: () => number;
    MAX_UTF16_UNSIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_UNSIGNED_SURROGATE: () => number;
    MAX_UTF8_UNSIGNED_NOTSURROGATE: () => number;
  };
  huge: {
    MAX_UTF16_SIGNED_SURROGATE: number;
    MAX_UTF16_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_SIGNED_SURROGATE: () => number;
    MAX_UTF8_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF16_UNSIGNED_SURROGATE: () => number;
    MAX_UTF16_UNSIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_UNSIGNED_SURROGATE: () => number;
    MAX_UTF8_UNSIGNED_NOTSURROGATE: () => number;
  };
  services: {
    MAX_REQUEST_TIMER: number;
    MAX_SERVICE_TIMER: () => number;
  };
}> = ObjectHelper.deepFreeze({
  tiny: {
    MAX_UTF16_SIGNED_SURROGATE: 63,
    MAX_UTF16_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF16_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF16_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 8);
    },
  },
  small: {
    MAX_UTF16_SIGNED_SURROGATE: 16383,
    MAX_UTF16_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF16_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF16_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 8);
    },
  },
  medium: {
    MAX_UTF16_SIGNED_SURROGATE: 4194303,
    MAX_UTF16_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF16_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF16_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 8);
    },
  },
  large: {
    MAX_UTF16_SIGNED_SURROGATE: 1073741823,
    MAX_UTF16_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF16_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF16_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 8);
    },
  },
  huge: {
    MAX_UTF16_SIGNED_SURROGATE: 274877906943,
    MAX_UTF16_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF16_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF16_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 8);
    },
  },
  services: {
    MAX_REQUEST_TIMER: 60000,
    MAX_SERVICE_TIMER: function (): number {
      return this.MAX_REQUEST_TIMER * 5;
    },
  },
});
export const flags: {
  indexed: boolean;
  pt: boolean;
  isAutoCorrectOn: boolean;
  failedTimeoutAttempts: number;
  MAX_ALLOWED_SHORT_PROCESS_TIME: number;
  forbiddens: {
    forbiddenTags: RegExp;
    forbiddenPrefix: RegExp;
  };
} = {
  indexed: false,
  pt: true,
  isAutoCorrectOn: true,
  failedTimeoutAttempts: 0,
  MAX_ALLOWED_SHORT_PROCESS_TIME: 2000,
  forbiddens: Object.freeze({
    forbiddenTags:
      /<\/?(no)?script.*>|<\/?embed.*>|<\/?source.*>|<\/?object.*>|<\/?applet.*>|<\/?i?frame(set)?.*>|<\/?meta.*>|<\/?base.*>|<\/?link.*>|<\/?svg.*>|<\/?style.*>|<\/?form.*>|<\/?input.*\/?>|\/?textarea.*?>|\/?select.*?>|\/?option.*?>|\/?optgroup.*?>|<\/?button.*>|href="/g,
    forbiddenPrefix: /javascript:/gi,
  }),
};
export default class MathHandler {
  public static parseNotNaN(
    iniVal: string,
    def: number = 0,
    context: string = "float",
    fixed: number = 4
  ): number {
    let returnVal = 0;
    try {
      if (typeof iniVal !== "string")
        throw new TypeError(
          "Failed to validate argument: iniVal must be a string."
        );
      if (typeof context !== "string")
        throw new TypeError(
          "Failed to validate argument: context must be a string."
        );
      if (typeof def !== "number")
        throw new TypeError(
          "Failed to validate argument: def must be a number."
        );
      if (typeof fixed !== "number")
        throw new TypeError(
          "Failed to validate argument: fixed must be a number."
        );
      switch (context) {
        case "int":
          returnVal = parseInt(iniVal, 10) || def;
          if (
            !Number.isFinite(returnVal) ||
            Number.isNaN(returnVal) ||
            isNaN(returnVal)
          )
            returnVal = def;
          break;
        case "float":
          returnVal = parseFloat(parseFloat(iniVal).toFixed(fixed)) || def;
          if (!Number.isFinite(returnVal) || isNaN(returnVal)) returnVal = def;
          break;
        default:
          throw new SyntaxError(`Context of parsing invalid.`);
      }
      return returnVal || 0;
    } catch (e) {
      return returnVal || 0;
    }
  }
  public static generateRandomKey(
    previous: string = "",
    limit: number = limits.tiny.MAX_UTF8_SIGNED_NOTSURROGATE()
  ): string {
    let newKey = crypto.randomUUID(),
      acc = 0,
      start = performance.now();
    while (newKey === previous) {
      if (
        performance.now() - start > flags.MAX_ALLOWED_SHORT_PROCESS_TIME ||
        acc >= limit
      )
        break;
      newKey = crypto.randomUUID();
      acc += 1;
    }
    return newKey;
  }
  public static generateRandomId(
    element?: Element,
    previous: string = "",
    limit: number = limits.tiny.MAX_UTF8_SIGNED_NOTSURROGATE()
  ): string {
    let newKey = crypto.randomUUID(),
      acc = 0,
      start = performance.now();
    while (
      newKey === previous ||
      (element && document.querySelectorAll(`#${element.id}`).length > 1)
    ) {
      if (
        performance.now() - start > flags.MAX_ALLOWED_SHORT_PROCESS_TIME ||
        acc >= limit
      )
        break;
      previous = newKey;
      newKey = crypto.randomUUID();
      acc += 1;
    }
    if (element) {
      if (
        element instanceof HTMLElement &&
        element.dataset.idwarned !== "true"
      ) {
        element.before(
          document.createComment(`WARNING: Automatically identified`)
        );
        element.dataset.idwarned = "true";
      }
      element.id = `_${StringHelper.sanitizePropertyName(
        element.id
      )}__${newKey}`;
      return `_${StringHelper.sanitizePropertyName(element.id)}__${newKey}`;
    }
    return newKey;
  }
  public static isValidHex(v: string): boolean {
    return /^#[0-9A-Fa-f]+$/g.test(v);
  }
  public static hexToDecimal(v: string, scape: number = NaN): number {
    if (!this.isValidHex(v)) return scape;
    if (v.startsWith("#")) v = v.slice(1);
    return parseInt(v, 16);
  }
  public static toNatural(v: number): number {
    return Number.isFinite(v) && v > 0 ? Math.abs(Math.round(v)) : 1;
  }
  public static getByOffSet({
    ref,
    length,
    offSet,
  }: {
    ref: number;
    length: number;
    offSet: number;
  }): number {
    return (ref + length - offSet) % length;
  }
  public static findPrimes(limit: number): number[] {
    const sieve = new Array(limit + 1).fill(true),
      primes: number[] = [];
    sieve[0] = sieve[1] = false;
    for (let i = 2; i ** 2 <= limit; i++) {
      if (!sieve[i]) continue;
      for (let j = i ** 2; j <= limit; j += i) sieve[j] = false;
    }
    for (let i = 2; i <= limit; i++) sieve[i] && primes.push(i);
    return primes;
  }
  public static gcd(a: number, b: number): number {
    while (b !== 0) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }
  public static euclideanLcm(a: number, b: number): number {
    return Math.abs(a * b) / MathHandler.gcd(a, b);
  }
  public static defaultLcm(...ns: number[]): number {
    ns = ns.sort((a, b) => a - b);
    const transients = [...ns],
      factors: number[] = [1],
      availablePrimes = MathHandler.findPrimes(Math.max(...ns));
    let foundFactor = false;
    while (!transients.every(n => n === 1)) {
      for (let i = 0; i < ns.length; i++) {
        for (let j = 0; j < availablePrimes.length; j++)
          if (ns[i] % availablePrimes[j] === 0) {
            foundFactor = true;
            factors.push(availablePrimes[j]);
            for (let k = 0; k < transients.length; k++)
              if (transients[k] % availablePrimes[j] === 0)
                transients[k] /= availablePrimes[j];
            break;
          }
        if (foundFactor) break;
      }
    }
    let product = 0;
    for (let i = 0; i < factors.length; i++) product *= factors[i];
    return product;
  }
}
