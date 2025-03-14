import type {
  primitiveType,
  entryEl,
  textEl,
  targStr,
  targLooseNum,
  targObj,
  errorHandleElType,
  errorHandleArrayType,
  errorHandleSpreadType,
  errorLineExp,
} from "../declarations/types";
export const extLine = (error: Error): string =>
  error.stack?.split("\n")[1]?.trim()?.slice(-3, -1) || "NULL";
export function elementNotFound(
  element: errorHandleElType,
  elementName: targStr,
  line: targStr | errorLineExp
): Error {
  element ??= "UNDEFINED";
  elementName ||= "UNNAMED";
  line ||= "UNDEFINED";
  let errorMsg = ``;
  if (
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLOptionElement
  ) {
    errorMsg = `
    ELEMENT NOT FOUND, LINE ${line ?? "UNDEFINED"}:
    Error validating instance of ${
      (element as HTMLElement)?.id || elementName || "NULL"
    }.
    Obtained instance: ${
      Object.prototype.toString.call(element)?.slice(8, -1) || "NULL"
    };
    Obtained value: ${(element as textEl)?.value ?? "NULL"}.`;
    console.error(errorMsg);
  } else {
    errorMsg = `
    ELEMENT NOT FOUND, LINE ${line ?? "UNDEFINED"}:
    Error validating instance of ${
      (element as HTMLElement)?.id || elementName || "UNDEFINED ID OR NAME"
    }.
    Obtained instance: ${
      Object.prototype.toString.call(element)?.slice(8, -1) || "NULL"
    }.`;
    console.error(errorMsg);
  }
  return Error(errorMsg);
}
export function inputNotFound(
  element: errorHandleElType,
  elementName: targStr,
  line: targStr | errorLineExp
): Error {
  element ??= "UNDEFINED";
  elementName ||= "UNNAMED";
  line ||= "UNDEFINED";
  const errorMsg = `INPUT NOT FOUND, LINE ${line ?? "UNDEFINED"}:
  Error validating ${
    (element as HTMLElement)?.id || elementName || "UNDEFINED ID OR NAME"
  }.
  Obtained Element: ${element ?? "NULL"};
  Obtained instance: ${
    Object.prototype.toString.call(element)?.slice(8, -1) || "NULL"
  };
  Obtained type (only for <input>): ${
    (element as HTMLInputElement)?.type || "NULL"
  };
  Obtained value: ${(element as textEl)?.value || "NULL"};
  Obtained .checked: ${(element as HTMLInputElement)?.checked || "NULL"}.`;
  console.error(errorMsg);
  return Error(errorMsg);
}
export function elementWithArrayError(
  context: targStr,
  array: errorHandleArrayType,
  arrayName: targStr,
  element: errorHandleElType,
  elementName: targStr,
  line: targStr | errorLineExp
): Error {
  context ||= "UNDEFINED";
  arrayName ||= "UNDEFINED NAME";
  array ??= "UNDEFINED";
  element ??= "UNDEFINED";
  elementName ||= "UNNAMED";
  line ||= "UNDEFINED";
  const errorMsg = `ELEMENT WITH ARRAY ERROR, LINE ${line ?? "UNDEFINED"}:
  Error validating ${context}.
  ${elementName ?? "UNNAMED"} obtained: ${array.toString() || null};
  Instance of ${arrayName ?? "UNNAMED ARRAY"} obtained: ${
    Object.prototype.toString.call(element)?.slice(8, -1) ?? "NULL"
  }.`;
  console.error(errorMsg);
  return Error(errorMsg);
}
export function elementWithObjectError(
  context: targStr,
  object: targObj = {},
  element: errorHandleElType,
  elementName: targStr,
  line: targStr | errorLineExp
): Error {
  context ||= "UNDEFINED";
  element ??= "UNDEFINED";
  elementName ||= "UNNAMED";
  line ||= "UNDEFINED";
  const errorMsg = `ELEMENT WITH OBJECT ERROR, LINE ${line ?? "UNDEFINED"}:
  Erro ${context ?? "UNDEFINED"}. Elemento: ${
    object?.toString() || null
  }; instância: ${object?.constructor?.name ?? "NULL"}
  ${elementName ?? "UNNAMED"}: Obtained instance: ${
    Object.prototype.toString.call(element)?.slice(8, -1) ?? "NULL"
  }`;
  console.error(errorMsg);
  return Error(errorMsg);
}
export function elementNotPopulated(
  array: errorHandleArrayType,
  arrayName: targStr,
  line: targStr | errorLineExp
): Error {
  array ??= "UNDEFINED";
  arrayName ||= "UNNAMED ARRAY";
  line ||= "UNDEFINED";
  let arrInstances: string[] = [];
  if (array instanceof HTMLCollection || array instanceof NodeList)
    array = Array.from(array).filter(
      (item) => item instanceof Element
    ) as Element[];
  if (
    array instanceof Array &&
    array.every((item) => item instanceof Element || typeof item === "object")
  ) {
    arrInstances = array.map(
      (el) => Object.prototype.toString.call(el).slice(8, -1) + " "
    );
  }
  const errorMsg = `ELEMENT POPULATION ERROR, LINE ${line ?? "UNDEFINED"}:
  Error validating ${arrayName || "NULL"}.
  Is Array: ${Array.isArray(array)};
  Instance: ${Object.prototype.toString.call(array)?.slice(8, -1) || "NULL"};
  Obtained length: ${array?.length || "0"};
  Stringification: ${array.toString() || "NULL"}
  Individual instances: ${arrInstances}`;
  console.error(errorMsg);
  return Error(errorMsg);
}
export function multipleElementsNotFound(
  line: targStr | errorLineExp,
  context: targStr,
  ...elements: errorHandleSpreadType
): Error {
  line ||= "UNDEFINED";
  context ||= "UNDEFINED";

  let errorMessage = `MULTIPLE ELEMENTS NOT FOUND, LINE ${line ?? "UNDEFINED"}:
  Error validating ${context || "Undefined Function Name"}.`;
  const mappedNullElements = elements.map((element) =>
    element === null || element === undefined ? "NULL" : element
  );

  mappedNullElements.forEach((element) => {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLOptionElement
    ) {
      if (
        element instanceof HTMLInputElement &&
        (element.type === "radio" || element.type === "checkbox")
      )
        errorMessage += `
        Instance of ${element.id || "NULL"} obtained: ${
          Object.prototype.toString.call(element)?.slice(8, -1) ?? "NULL"
        };\n
        .checked obtained: ${(element as HTMLInputElement)?.checked || "NULL"}`;
      else
        errorMessage += `
        Instance of ${element.id || "NULL"} obtained: ${
          Object.prototype.toString.call(element)?.slice(8, -1) ?? "NULL"
        };\n
        Obtained value: ${(element as textEl)?.value || "NULL"}`;
    } else
      errorMessage += `
      Instance of ${(element as entryEl).id || "NULL"} obtained: ${
        Object.prototype.toString.call(element)?.slice(8, -1) ?? "NULL"
      };\n`;
  });

  console.error(errorMessage);
  return Error(errorMessage);
}
export function elementsNotFoundFunction(
  line: targStr | errorLineExp,
  funcName: targStr,
  ...elements: errorHandleSpreadType
): Error {
  line ||= "UNDEFINED";
  funcName ||= "UNDEFINED FUNCTION NAME";

  let errorMessage = `ELEMENTS NOT FOUND FOR FUNCTION, LINE ${
    line ?? "UNDEFINED"
  }:
  Error validating Obtained instance for ${funcName || "NULL"}`;

  const mappedNullElements = elements.map((element) =>
    element === null || element === undefined ? "NULL" : element
  );

  mappedNullElements.forEach((element) => {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLOptionElement
    ) {
      if (
        element instanceof HTMLInputElement &&
        (element.type === "radio" || element.type === "checkbox")
      )
        errorMessage += `Instance of ${element.id || "NULL"} obtained: ${
          Object.prototype.toString.call(element)?.slice(8, -1) ?? "NULL"
        };\n
        .checked obtained: ${(element as HTMLInputElement)?.checked || "NULL"}`;
      else
        errorMessage += `Instance of ${element.id || "NULL"} obtained: ${
          Object.prototype.toString.call(element)?.slice(8, -1) ?? "NULL"
        };\n
        Obtained value: ${(element as textEl)?.value || "NULL"}`;
    } else
      errorMessage += `Instance of ${
        (element as HTMLElement)?.id || "NULL"
      } obtained: ${
        Object.prototype.toString.call(element)?.slice(8, -1) ?? "NULL"
      };\n`;
  });

  console.error(errorMessage);
  return Error(errorMessage);
}
export function maxNumberError(
  unvalidNumber: targLooseNum,
  title: targStr,
  line: targStr | errorLineExp
): Error {
  unvalidNumber ??= "UNDEFINED NUMBER";
  if (typeof unvalidNumber === "number")
    unvalidNumber = unvalidNumber.toString();
  title ||= "UNDEFINED TITLE";
  line ||= "UNDEFINED";
  const errorMessage = `MAX NUMBER ERROR, LINE ${line ?? "UNDEFINED"}:
  Number of ${title || "Undefined Title"} invalid.
  Max number obtained: ${parseInt(unvalidNumber, 10) || 0}`;
  console.error(errorMessage);
  return Error(errorMessage);
}
export function stringError(
  context: targStr,
  text: targStr,
  line: targStr | errorLineExp
): Error {
  context ||= "UNDEFINED CONTEXT";
  text ||= "UNDEFINED";
  line ||= "UNDEFINED";
  const errorMessage = `STRING ERROR, LINE ${line ?? "UNDEFINED"}:
  Error validating ${context}.
  Value obtained: ${text ?? "NULL"}`;
  console.error(errorMessage);
  return Error(errorMessage);
}
export function matchError(
  context: targStr,
  element: errorHandleElType,
  text: targStr,
  line: targStr | errorLineExp
): Error {
  context ||= "UNDEFINED CONTEXT";
  element ??= "UNDEFINED";
  text ||= "UNDEFINED";
  line ||= "UNDEFINED";
  const errorMessage = `MATCH ERROR, LINE ${line ?? "UNDEFINED"}:
  Error validating ${context || "UNDEFINED"}.
  Obtained Element: ${element || "UNDEFINED"};
  Title obtained: ${text || "Undefined Title"}.`;
  console.error(errorMessage);
  return Error(errorMessage);
}
export function typeError(
  context: targStr,
  element: primitiveType | Element,
  acceptedType: targStr,
  line: targStr | errorLineExp
): Error {
  context ||= "UNDEFINED CONTEXT";
  element ??= "UNDEFINED";
  acceptedType ||= "UNDEFINED";
  line ||= "UNDEFINED";
  const errorMessage = `TYPE ERROR, LINE ${line ?? "UNDEFINED"}:
  Primitive type obtained for ${context || "UNDEFINED"} incorrect.
  Type obtained: ${typeof element};
  Type accepted: ${acceptedType || "Undefined Accepted Type"}`;
  console.error(errorMessage);
  return Error(errorMessage);
}
export function objectError(
  context: targStr,
  object: targObj = {},
  objectName: targStr,
  maxPropertiesNumber: targLooseNum,
  line: targStr | errorLineExp
): Error {
  context ||= "UNDEFINED CONTEXT";
  objectName ||= "UNDEFINED";
  maxPropertiesNumber ||= "UNDEFINED";
  line ||= "UNDEFINED";
  const errorMessage = `OBJECT ERROR, LINE ${line ?? "UNDEFINED"}:
  Error validating ${objectName ?? "UNDEFINED OBJECT NAME"} for ${
    context || "UNDEFINED"
  }.
  Object obtained: ${object?.toString() || "Undefined Object"};
  Número obtained of properties: ${Object.keys.length ?? 0}; Número accepted: ${
    maxPropertiesNumber ?? 0
  }`;
  console.error(errorMessage);
  return Error(errorMessage);
}
export function codifyError(err: Error) {
  if (
    err instanceof EvalError ||
    err instanceof SyntaxError ||
    err instanceof URIError
  )
    return 400;
  else if (err instanceof RangeError) return 416;
  else if (err instanceof TypeError) return 422;
  else if (err instanceof AggregateError) return 207;
  else if (err.constructor.name === "InternalError") return 500;
  else return 404;
}
