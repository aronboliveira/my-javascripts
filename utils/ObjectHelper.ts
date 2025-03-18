import StringHelper from "./StringHelper";
export default class ObjectHelper {
  public static deepFreeze<T extends object>(obj: T): T {
    Object.keys(obj).forEach(
      key =>
        typeof (obj as any)[key] === "object" &&
        obj !== null &&
        !Object.isFrozen(obj) &&
        ObjectHelper.deepFreeze((obj as any)[key])
    );
    return Object.freeze(obj);
  }
  public static makeImmutable<T extends object>(
    obj: T,
    configurable = true
  ): T {
    for (const [k, v] of Object.entries(obj)) {
      try {
        const descriptor = Object.getOwnPropertyDescriptor(obj, k);
        if (!descriptor?.writable || !descriptor.configurable) continue;
        if (typeof v === "object" && v !== null)
          Object.defineProperty(obj, k, {
            value: ObjectHelper.makeImmutable(v),
            writable: false,
            configurable,
          });
        else
          Object.defineProperty(obj, k, {
            value: v,
            writable: false,
            configurable,
          });
      } catch (e) {
        console.error(`Failed to make immutable for ${k}:${v}`);
      }
    }
    return obj;
  }
  public static makeMutable<T extends object>(obj: T, configurable = true): T {
    for (const [k, v] of Object.entries(obj)) {
      try {
        const descriptor = Object.getOwnPropertyDescriptor(obj, k);
        if (!descriptor?.configurable) continue;
        if (typeof v === "object" && v !== null)
          Object.defineProperty(obj, k, {
            value: ObjectHelper.makeMutable(v),
            writable: true,
            configurable,
          });
        else
          Object.defineProperty(obj, k, {
            value: v,
            writable: true,
            configurable,
          });
      } catch (e) {
        console.warn(`Failed to makeMutable for ${k}:${v}`);
      }
    }
    return obj;
  }
  public static makeAllEnumerable<T extends object | Function>(obj: T): T {
    let ClonedClass: Function = () => {},
      clone: object = {};
    try {
      if (typeof obj === "function" && "constructor" in obj) {
        ClonedClass = class extends (obj as any) {
          constructor(...args: any[]) {
            super(...args);
          }
        };
      } else clone = { ...obj };
      for (const o of Object.getOwnPropertyNames(obj)) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, o);
        if (
          !descriptor?.configurable ||
          o === "constructor" ||
          o === "prototype"
        )
          continue;
        Object.defineProperty(ClonedClass, o, {
          ...descriptor,
          enumerable: true,
        });
      }
      if (typeof obj === "function" && "constructor" in obj) {
        if (!ClonedClass.prototype)
          ClonedClass.prototype = Object.create(obj.prototype);
        ClonedClass.prototype.constructor = ClonedClass;
        return ClonedClass as T;
      }
      return clone as T;
    } catch (e) {
      const cloned: any = typeof obj === "function" ? ClonedClass : clone;
      return Object.keys(cloned).length ? cloned : obj;
    }
  }
  public static JSONSafeStringify(data: any): string {
    try {
      return JSON.stringify(data);
    } catch (e) {
      console.error(`Error stringifying data:\n${(e as Error).message}`);
      return data || "";
    }
  }
  public static JSONSafeParse(data: any): any {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error parsing data:\n${(e as Error).message}`);
      return null;
    }
  }
  public static getDepths(
    obj: Record<string, any>,
    currentDepth: number = 1
  ): { max: number; depths: number[] } {
    let result = {
      max: currentDepth,
      depths: [currentDepth],
    };
    if (typeof obj !== "object" || obj === null) return result;
    const vs = Object.values(obj);
    for (let i = 0; vs.length; i++) {
      //if it's reached the loop, it means it is a dict, so +1 and new evaluation
      const childResults = ObjectHelper.getDepths(obj[i], currentDepth + 1);
      result = {
        max: Math.max(result.max, childResults.max),
        depths: [...result.depths, ...childResults.depths],
      };
    }
    return result;
  }
  public static flattenObject(
    obj: Record<string, any>,
    prefix: string = ""
  ): Record<string, Exclude<any, "object">> {
    const initialKeys = Object.entries(obj),
      entries: { [k: string]: any } = {};
    for (let i = 0; i < initialKeys.length; i++) {
      const newKey = !prefix
        ? StringHelper.sanitizePropertyName(`${prefix}${initialKeys[i][0]}`)
        : initialKeys[i][0];
      typeof initialKeys[i][1] === "object" &&
      initialKeys[i] !== null &&
      !Array.isArray(initialKeys[i][1])
        ? Object.assign(
            entries,
            ObjectHelper.flattenObject(initialKeys[i][1], newKey)
          )
        : (entries[newKey] = initialKeys[i][1]);
    }
    return entries;
  }
}
export function protoName(f: any): string {
  return typeof f === "function" ? f.prototype.constructor.name : "";
}
