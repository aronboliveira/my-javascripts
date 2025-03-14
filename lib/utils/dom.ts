export function modelScripts(): void {
  try {
    document.querySelectorAll("meta").forEach((meta) => {
      try {
        if (!(meta instanceof HTMLMetaElement)) return;
        if (meta.id === "") {
          if (meta.name && meta.name !== "") {
            meta.id = meta.name.replace(/[\/\-\?\=\+\s\.\<\>\&\^\:~,]/g, "__");
            return;
          }
          if ((meta as any).property && (meta as any).property !== "") {
            meta.id = (meta as any).property.replace(
              /[\/\-\?\=\+\s\.\<\>\&\^\:~,]/g,
              "__"
            );
            return;
          }
          if (meta.httpEquiv && meta.httpEquiv !== "") {
            meta.id = meta.httpEquiv.replace(
              /[\/\-\?\=\+\s\.\<\>\&\^\:~,]/g,
              "__"
            );
            return;
          }
          if (meta.content && meta.content !== "") {
            meta.id = meta.content.replace(
              /[\/\-\?\=\+\s\.\<\>\&\^\:~,]/g,
              "__"
            );
          }
        }
      } catch (e) {
        return;
      }
    });
    Array.from(document.scripts).forEach((script) => {
      try {
        if (!(script instanceof HTMLScriptElement)) return;
        if (script.type === "" && script.src !== "")
          script.type = "text/javascript";
        if (script.id === "" && script.src !== "") {
          const url = new URL(script.src);
          script.id = url.pathname.replace(/[\/\-\?\=\+\s\.\<\>\&\^~,]/g, "__");
        }
        if (script.crossOrigin === "") script.crossOrigin = "anonymous";
      } catch (e) {
        return;
      }
    });
    document.querySelectorAll("style").forEach((style, i) => {
      try {
        if (!(style instanceof HTMLStyleElement)) return;
        if (style.type !== "") style.type = "";
        if (style.media === "all") style.media = "";
        if (style.id === "") {
          style.id = document.getElementById("__next")
            ? `next_generated_style_${i}`
            : `automatically_generated_style_${i}`;
          style.dataset.group = "automatic_name";
        }
      } catch (e) {
        return;
      }
    });
    document.querySelectorAll("link").forEach((link) => {
      try {
        if (!(link instanceof HTMLLinkElement)) return;
        if (link.id === "" && link.href !== "") {
          const url = new URL(link.href);
          link.id = url.pathname.replace(/[\/\-\?\=\+\s\.\<\>\&\^~,]/g, "__");
        }
        if (link.rel === "") link.rel = "alternate";
        if (link.crossOrigin === "") link.crossOrigin = "anonymous";
      } catch (e) {
        return;
      }
    });
    document.querySelectorAll("a").forEach((a) => {
      try {
        if (!(a instanceof HTMLAnchorElement)) return;
        if (
          a.href !== "" &&
          !(
            new RegExp(location.hostname, "g").test(a.href) ||
            /https/.test(a.href)
          )
        ) {
          if (!/noopener/g.test(a.rel)) a.rel += " noopener";
          if (!/noreferrer/g.test(a.rel)) a.rel += " noreferrer";
        }
      } catch (e) {
        return;
      }
    });
  } catch (e) {
    return;
  }
}
export function assignFormAttrs(fr: nlFm): void {
  if (!(fr instanceof HTMLFormElement))
    throw new Error(`Failed to validate Form Reference`);
  (() => {
    try {
      const metaCs =
        document.querySelector('meta[charset*="utf-"]') ??
        document.querySelector('meta[charset*="UTF-"]');
      if (!(metaCs instanceof HTMLMetaElement))
        throw new Error(`Failed to fetch HTMLMetaElement for Charset`);
      const cs = /utf\-16/gi.test(metaCs.outerHTML) ? "utf-16" : "utf-8";
      fr.acceptCharset = cs;
    } catch (e) {
      return;
    }
  })();
  try {
    let len = 0;
    [
      ...fr.querySelectorAll("button"),
      ...fr.querySelectorAll("fieldset"),
      ...fr.querySelectorAll("input"),
      ...fr.querySelectorAll("object"),
      ...fr.querySelectorAll("output"),
      ...fr.querySelectorAll("select"),
      ...fr.querySelectorAll("textarea"),
    ].forEach((el) => {
      (() => {
        try {
          if (!(el instanceof HTMLElement) || el.id === "") return;
          len += 1;
          if (!el || !fr) return;
          el.dataset.form = `#${fr.id}`;
          if (el instanceof HTMLInputElement) {
            if (el.formAction === "") el.formAction = fr.action;
            if (el.formMethod === "") el.formMethod = fr.method;
            if (el.formEnctype === "") el.formEnctype = fr.enctype;
            if (!el.formNoValidate) el.formNoValidate = fr.noValidate;
          } else if (
            el instanceof HTMLSelectElement ||
            el instanceof HTMLTextAreaElement
          ) {
            el.dataset.formAction = fr.action;
            el.dataset.formMethod = fr.method;
            el.dataset.formEnctype = fr.enctype;
            el.dataset.formNoValidate = fr.noValidate.toString();
          }
          if (fr.id !== "") el.dataset.form = fr.id;
          if (
            (el instanceof HTMLFieldSetElement ||
              el instanceof HTMLObjectElement ||
              el instanceof HTMLButtonElement) &&
            el.id !== "" &&
            el.name === ""
          )
            el.name = el.id.replace(/([A-Z])/g, (m) =>
              m === el.id.charAt(0) ? m.toLowerCase() : `_${m.toLowerCase()}`
            );
        } catch (e) {
          return;
        }
      })();
      (() => {
        try {
          if (
            !(
              el instanceof HTMLInputElement ||
              el instanceof HTMLSelectElement ||
              el instanceof HTMLTextAreaElement
            )
          )
            return;
          try {
            if (el.labels) {
              el.labels.forEach((lab, i) => {
                try {
                  if (lab instanceof HTMLLabelElement && lab.htmlFor !== el.id)
                    lab.htmlFor = el.id;
                  const idf = el.id || el.name;
                  if (lab.id === "" && idf !== "" && el.labels)
                    lab.id =
                      el.labels.length === 1
                        ? `${idf}_lab`
                        : `${idf}_lab_${i + 1}`;
                  if (!el) throw new Error(`Lost reference to the input`);
                  if (i === 0) el.dataset.labels = `${lab.id}`;
                  else el.dataset.labels += `, ${lab.id}`;
                } catch (e) {
                  return;
                }
              });
              if (!(el instanceof HTMLSelectElement) && el.placeholder === "") {
                const clearArticles = (txt: string): string => {
                    if (/cidade/gi.test(txt))
                      txt = txt.replace(/o\scidade/g, "a cidade");
                    if (/nacionalidade/gi.test(txt))
                      txt = txt.replace(/o\snacionalidade/g, "a nacionalidade");
                    if (/naturalidade/gi.test(txt))
                      txt = txt.replace(/o\snaturalidade/g, "a naturalidade");
                    if (/[oa]\s\w*ções/gi.test(txt))
                      txt = txt.replace(/([oa])\s(\w*)ções/g, "$1s $2ções");
                    if (/os\sescovações/g.test(txt))
                      txt = txt.replace(/os\sescovações/g, "as escovações");
                    if (/\so\singere|\so\sfaz|\so\squant[ao]s?/g.test(txt))
                      txt = txt.replace(
                        /\so\singere|\so\sfaz|\so\squant[ao]s?/g,
                        ""
                      );
                    if (/o qual é/g.test(txt))
                      txt = txt.replace(/o qual é/g, "qual é");
                    if (/o evacua quantas/g.test(txt))
                      txt = txt.replace(
                        /o evacua quantas/g,
                        "quantas evacuações por"
                      );
                    if (/evacuações por vezes por dia/g.test(txt))
                      txt = txt.replace(
                        /evacuações por vezes por dia/g,
                        "evacuações por dia"
                      );
                    if (/micções por dia(?<!quantas)/g.test(txt))
                      txt = txt.replace(
                        /micções por dia(?<!quantas)/g,
                        "quantas micções por dia"
                      );
                    if (txt.endsWith(",")) txt = txt.slice(0, -1);
                    return txt.trim();
                  },
                  modelLabelHeader = (txt: string): string => {
                    if (txt.endsWith(":")) txt = txt.slice(0, -1);
                    if (/, se/g.test(txt.slice(1)))
                      txt = txt.slice(0, txt.indexOf(", se"));
                    txt = txt.toLowerCase();
                    const acrs = /cep|cpf|ddd|dre/gi;
                    if (acrs.test(txt))
                      txt = txt.replace(acrs, (m) => m.toUpperCase());
                    if (/\:.*/g.test(txt))
                      txt = txt.slice(0, txt.lastIndexOf(":"));
                    if (/\?.*/g.test(txt))
                      txt = txt.slice(0, txt.lastIndexOf("?"));
                    if (txt.includes("se estrangeiro, "))
                      txt = txt.replace(/se estrangeiro,\s/g, "");
                    if (txt.includes("informe o "))
                      txt = txt.replace(/informe\so\s/g, "");
                    if (/cidade/gi.test(txt))
                      txt = txt.replace(/o\scidade/g, "a cidade");
                    if (/nacionalidade/gi.test(txt))
                      txt = txt.replace(/o\snacionalidade/g, "a nacionalidade");
                    if (/naturalidade/gi.test(txt))
                      txt = txt.replace(/o\snaturalidade/g, "a naturalidade");
                    if (/[oa]\s\w*ções/gi.test(txt))
                      txt = txt.replace(/([oa])\s(\w*)ções/g, "$1s $2ções");
                    if (/os\sescovações/g.test(txt))
                      txt = txt.replace(/os\sescovações/g, "as escovações");
                    if (/no mínimo|no máximo/g.test(txt))
                      txt = txt.replace(/no mínimo|no máximo/g, "");
                    if (txt.endsWith(",")) txt = txt.slice(0, -1);
                    return txt.trim();
                  };
                if (el.labels[0] && el.labels[0].htmlFor === el.id) {
                  el.placeholder = `Preencha aqui o ${modelLabelHeader(
                    el.labels[0].innerText
                  )}`;
                  el.placeholder = clearArticles(el.placeholder);
                  if (
                    !(
                      el.labels[0].innerText.toLowerCase().includes("evacua") &&
                      el.labels[0].innerText.includes("por dia")
                    ) &&
                    !el.labels[0].innerText
                      .toLowerCase()
                      .includes(
                        el.placeholder
                          .toLowerCase()
                          .replace(/preencha aqui\s?[oa]?s?\s?/g, "")
                      )
                  )
                    el.placeholder = "";
                  if (el.id === "streetId") el.placeholder = "";
                }
              }
            }
          } catch (e) {
            return;
          }
        } catch (e) {
          return;
        }
      })();
    });
    fr.dataset.len = len.toString();
  } catch (e) {
    return;
  }
}
export function limitedError(msg: string, idf: string) {
  try {
    if (typeof msg !== "string" || typeof idf !== "string") return;
    if (!errorLabels[idf]) errorLabels[idf] = 0;
    errorLabels[idf] = +1;
    if (errorLabels[idf] <= ERROR_LIMIT) console.error(msg);
    if (errorLabels[idf] === ERROR_LIMIT + 1)
      setTimeout(() => {
        if (errorLabels?.[idf]) errorLabels[idf] = 0;
      }, 5000);
  } catch (e) {
    return;
  }
}
export function applyFieldConstraints(el: nlEl): void {
  try {
    if (
      !(
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.contentEditable)
      )
    )
      return;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      if (el.maxLength !== -1 && el.value.length > el.maxLength)
        el.value = el.value.slice(0, el.maxLength);
      if (el instanceof HTMLInputElement) {
        const parsedValue = parseNotNaN(el.value);
        if (el.type === "number") {
          if (
            el.min !== "" &&
            Number.isFinite(parseNotNaN(el.min)) &&
            parsedValue < Math.abs(parseNotNaN(el.min))
          ) {
            el.value = el.min;
            el.setSelectionRange(0, 0);
          }
          if (
            el.max !== "" &&
            el.max !== "0" &&
            el.max !== "-0" &&
            Number.isFinite(parseNotNaN(el.max)) &&
            parsedValue > Math.abs(parseNotNaN(el.max))
          )
            el.value = el.max;
        }
      }
    } else {
      if (
        el.dataset.max &&
        el.dataset.max !== "" &&
        el.dataset.max !== "0" &&
        el.dataset.max !== "-0" &&
        Number.isFinite(parseNotNaN(el.dataset.max)) &&
        el.innerText.length > Math.abs(parseNotNaN(el.dataset.max))
      )
        el.innerText = el.innerText.slice(
          0,
          Math.abs(parseNotNaN(el.dataset.max))
        );
      if (el.dataset.type && el.dataset.type === "number") {
        if (el.innerText && el.innerText.length > 0)
          el.innerText = el.innerText.replace(/[^0-9]/g, "");
        if (
          el.dataset.maxNum &&
          el.dataset.maxNum !== "" &&
          el.dataset.maxNum !== "0" &&
          el.dataset.maxNum !== "-0" &&
          Number.isFinite(parseNotNaN(el.dataset.maxNum)) &&
          el.innerText &&
          el.innerText.length > 0 &&
          parseNotNaN(el.innerText) > Math.abs(parseNotNaN(el.dataset.maxNum))
        )
          el.innerText = el.dataset.maxNum;
        if (
          el.dataset.minNum &&
          el.dataset.minNum !== "" &&
          el.dataset.minNum !== "0" &&
          el.dataset.minNum !== "-0" &&
          Number.isFinite(parseNotNaN(el.dataset.minNum)) &&
          el.innerText &&
          el.innerText.length > 0 &&
          parseNotNaN(el.innerText) < Math.abs(parseNotNaN(el.dataset.minNum))
        )
          el.innerText = el.dataset.minNum;
      }
    }
  } catch (e) {
    return;
  }
}
export function applyConstraintsTitle(fm: nlFm): void {
  try {
    if (!(fm instanceof HTMLElement))
      throw new Error(`Failed to validate Form instance`);
    [
      ...Array.from(fm.querySelectorAll("input")).filter(
        (i) =>
          i.type !== "button" &&
          i.type !== "color" &&
          i.type !== "hidden" &&
          i.type !== "image" &&
          i.type !== "range" &&
          i.type !== "reset" &&
          i.type !== "submit"
      ),
      ...fm.querySelectorAll("textarea"),
    ].forEach((inp) => {
      try {
        if (
          !(
            inp instanceof HTMLInputElement ||
            inp instanceof HTMLTextAreaElement
          )
        )
          return;
        let title = "";
        if (inp.required) title += "Obrigatório!\n";
        const checkTextConstraints = (): void => {
          const minLength =
            inp.dataset.reqlength && inp.dataset.reqlength !== ""
              ? inp.dataset.reqlength.replace(/[^0-9]/g, "")
              : inp.minLength;
          if (minLength !== "" && minLength !== "-1")
            title += `O campo deve conter no mínimo ${minLength} dígitos\n`;
          const maxLength =
            inp.dataset.maxlength && inp.dataset.maxlength !== ""
              ? inp.dataset.maxlength.replace(/[^0-9]/g, "")
              : inp.maxLength;
          if (maxLength !== "" && maxLength !== "-1")
            title += `O campo deve conter no máximo ${maxLength} dígitos\n`;
          if (inp.dataset.pattern && inp.dataset.pattern.includes("^[d,.]+$"))
            title += "O campo só pode conter números\n";
        };
        if (inp instanceof HTMLInputElement) {
          if (inp.type === "checkbox" || inp.type === "radio") {
            if (
              inp.type === "radio" &&
              inp.dataset.required &&
              inp.dataset.required === "true"
            )
              title += "Obrigatório!\n";
            return;
          } else {
            checkTextConstraints();
            if (inp.type === "email")
              title += "O campo deve contar @ e ao menos um .";
            if (inp.type === "number") {
              const minNum =
                inp.dataset.minnum && inp.dataset.minnum !== ""
                  ? inp.dataset.minnum.replace(/[^0-9]/g, "")
                  : inp.min;
              if (minNum !== "" && minNum !== "-1")
                title += `O campo deve equivaler a no mínimo ${minNum}\n`;
              const maxNum =
                inp.dataset.maxnum && inp.dataset.maxnum !== ""
                  ? inp.dataset.maxnum.replace(/[^0-9]/g, "")
                  : inp.max;
              if (maxNum !== "" && maxNum !== "-1")
                title += `O campo deve equivaler a no máximo ${maxNum}\n`;
            }
          }
        } else checkTextConstraints();
        if (title !== "") inp.title += `\n${title}`;
      } catch (e) {
        return;
      }
    });
  } catch (e) {
    return;
  }
}
export function compProp(
  el: nlEl,
  prop: keyof CSSStyleDeclaration,
  measure: CSSMeasure = "px"
): string {
  try {
    if (!(el instanceof Element)) return "";
    if (typeof prop !== "string") return "";
    if (typeof measure !== "string")
      return (getComputedStyle(el) as any)[prop]?.trim() ?? "";
    return (
      (getComputedStyle(el) as any)[prop]?.replace(measure, "").trim() ?? ""
    );
  } catch (e) {
    return el instanceof Element && typeof prop === "string"
      ? (getComputedStyle(el) as any)[prop]?.trim() ?? ""
      : "";
  }
}
export function compPropGet(
  el: nlEl,
  prop: keyof CSSStyleDeclaration,
  measure: CSSMeasure = "px"
): string {
  try {
    if (!(el instanceof Element)) return "";
    if (typeof prop !== "string") return "";
    if (typeof measure !== "string")
      return getComputedStyle(el).getPropertyValue(prop).trim() ?? "";
    return (
      getComputedStyle(el).getPropertyValue(prop).replace(measure, "").trim() ??
      ""
    );
  } catch (e) {
    return el instanceof Element && typeof prop === "string"
      ? getComputedStyle(el).getPropertyValue(prop).trim() ?? ""
      : "";
  }
}
export function checkContext(ctx: any, alias: string, caller: any): void {
  if (!ctx)
    console.warn(
      `Component ${caller.prototype.constructor.name} out of Context ${alias}`
    );
}
export function useCurrentDate(activation: Event, dateBtn: targEl): void {
  if (activation?.target === dateBtn && dateBtn instanceof HTMLButtonElement) {
    const currentDate = new Date();
    const targInputDate = searchPreviousSiblings(dateBtn, "inpDate");
    if (targInputDate instanceof HTMLInputElement && targInputDate.type === "date")
      targInputDate.value =
        currentDate.getFullYear() +
        "-" +
        (currentDate.getMonth() + 1).toString().padStart(2, "0").replaceAll("'", "") +
        "-" +
        currentDate.getDate().toString().padStart(2, "0").replaceAll("'", "");
  }
}
export function searchNextSiblings(currentElement: Element, searchedSiblingClass: string): Element {
  let loopAcc = 0;
  while (currentElement?.nextElementSibling) {
    currentElement = currentElement.nextElementSibling;
    if (currentElement?.classList?.contains(searchedSiblingClass) || loopAcc > 999) break;
    loopAcc++;
  }
  return currentElement;
}
export function searchPreviousSiblings(currentElement: Element, searchedSiblingClass: string): Element {
  let loopAcc = 0;
  while (currentElement?.previousElementSibling) {
    currentElement = currentElement.previousElementSibling;
    if (currentElement?.classList?.contains(searchedSiblingClass) || loopAcc > 999) break;
    loopAcc++;
  }
  return currentElement;
}
export function searchPreviousSiblingsById(currentElement: Element, searchedSiblingId: string): Element {
  let loopAcc = 0;
  while (currentElement?.previousElementSibling) {
    currentElement = currentElement.previousElementSibling;
    if (currentElement?.id === searchedSiblingId || loopAcc > 999) break;
    loopAcc++;
  }
  return currentElement;
}
export function searchParents(currentElement: Element, searchedParentClass: string): Element {
  let loopAcc = 0;
  while (currentElement?.parentElement) {
    currentElement = currentElement.parentElement;
    if (currentElement?.classList?.contains(searchedParentClass) || loopAcc > 999) break;
    loopAcc++;
  }
  return currentElement;
}