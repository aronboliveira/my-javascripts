import { parseNotNaN } from "./gModel";
import { targEl, entryEl } from "./declarations/types";
export function dinamicGridAdjust(gridDivs: Array<targEl>): void {
  if (
    gridDivs?.length > 0 &&
    gridDivs.every((div) => div instanceof HTMLElement)
  ) {
    gridDivs.forEach((gridDiv) => {
      if (
        gridDiv instanceof HTMLElement &&
        !gridDiv.classList.contains("noEqualize")
      ) {
        switch (getComputedStyle(gridDiv).display) {
          case "grid":
            const nColumns = (
              gridDiv.style.gridTemplateColumns ||
              getComputedStyle(gridDiv).gridTemplateColumns
            )
              .trim()
              .split(/\s+/g).length;
            if (!isFinite(nColumns) && nColumns > 0)
              gridDiv.style.width = (25 * (nColumns + 1)).toFixed(1) + "vw";
            break;
          case "flex":
            switch (gridDiv.style.flexDirection) {
              case "row":
                gridDiv.style.width = "60%";
                break;
              case "row-reverse":
                gridDiv.style.width = "60%";
                break;
              case "column":
                gridDiv.style.width = "90%";
                break;
              case "column-reverse":
                gridDiv.style.width = "90%";
                break;
              default:
                gridDiv.style.width = "70%";
            }
            break;
          default:
            gridDiv.style.width = "70%";
        }
      }
    });
  }
}
export function equalizeFlexSibilings(
  flexEls: Array<targEl> | NodeListOf<Element>,
  contexts: Array<Array<string>> = [["width", "px"]]
): void {
  if (flexEls.length > 0) {
    flexEls.forEach((el) => {
      if (
        el instanceof HTMLElement &&
        getComputedStyle(el).display === "flex" &&
        el.classList.toString().match(/flexTwin/g) &&
        el.previousElementSibling instanceof HTMLElement
      ) {
        const elChildren = Array.from(el.children);
        Array.from(el.previousElementSibling.children)
          .filter(
            (child) =>
              child instanceof HTMLInputElement &&
              (child.type === "checkbox" || child.type === "radio")
          )
          .forEach((previousChild, i) => {
            if (elChildren[i] instanceof HTMLElement) {
              contexts.forEach((context) => {
                (elChildren[i] as HTMLElement).style[context[0] as any] = el
                  .previousElementSibling!.getBoundingClientRect()
                  .width.toString();
                (elChildren[i] as HTMLElement).style[
                  `min${(context[0] as string)
                    .slice(0, 1)
                    .toUpperCase()}${context[0].slice(1)}` as any
                ] = getComputedStyle(
                  el.previousElementSibling!
                ).width.toString();
                const previousChildRect = previousChild.getBoundingClientRect();
                if (
                  el.classList.contains(`flexTwin-${context[0]}`) &&
                  context[0] in previousChildRect
                ) {
                  (elChildren[i] as any).style.width = `${(
                    previousChildRect as any
                  )[context[0]].toFixed(4)}${context[1]}`;
                  (elChildren[i] as any).style.minWidth = `${(
                    previousChildRect as any
                  )[context[0]].toFixed(4)}${context[1]}`;
                }
              });
            }
          });
      }
    });
  }
}
export function equalizeTabCells(tab: HTMLTableElement | null): void {
  if (tab instanceof HTMLTableElement) {
    const parentEl =
      tab.closest("section") || tab.closest("dialog") || tab.closest("form");
    if (parentEl instanceof HTMLElement) {
      const relatedTabs = parentEl.querySelectorAll("table");
      const largestTabWid = Math.max(
        ...(Array.from(relatedTabs) ?? []).map((cel) => {
          let relTab = parseFloat(getComputedStyle(cel).width);
          if (
            Number.isNaN(relTab) ||
            Math.abs(relTab) === Infinity ||
            relTab < 0
          )
            relTab = 0;
          return relTab;
        })
      )?.toString();
      for (const relTab of relatedTabs) {
        relTab.style.minWidth = largestTabWid;
        relTab.style.width = largestTabWid;
      }
      const tabCells = [
        ...parentEl.querySelectorAll("td"),
        ...parentEl.querySelectorAll("th"),
      ];
      if (
        tabCells.length > 0 &&
        tabCells.every((cel) => cel instanceof HTMLElement)
      ) {
        const largestCellWid = Math.max(
          ...tabCells.map((cel) => {
            let widCell = parseFloat(getComputedStyle(cel).width);
            const tabCells = [
              ...parentEl.querySelectorAll("td"),
              ...parentEl.querySelectorAll("th"),
              ...parentEl.querySelectorAll("tr"),
              ...parentEl.querySelectorAll("tbody"),
              ...parentEl.querySelectorAll("thead"),
              ...parentEl.querySelectorAll("tfoot"),
              ...parentEl.querySelectorAll("caption"),
            ];
            if (
              tabCells.length > 0 &&
              tabCells.every((cel) => cel instanceof HTMLElement)
            ) {
              const largestCellWid = Math.max(
                ...tabCells.map((cel) => {
                  let widCell = parseFloat(getComputedStyle(cel).width);
                  if (
                    Number.isNaN(widCell) ||
                    Math.abs(widCell) === Infinity ||
                    widCell < 0
                  )
                    widCell = 0;
                  return widCell;
                })
              );
              for (const cel of tabCells) {
                Object.assign(cel.style, {
                  minWidth: "15ch",
                  width: `${
                    parseFloat(largestCellWid.toFixed(1)) /
                    parseFloat(
                      window.getComputedStyle(document.querySelector("html")!)
                        .fontSize
                    )
                  }rem`,
                  height: "fit-content",
                  verticalAlign: "text-top",
                });
              }
            }
            if (
              Number.isNaN(widCell) ||
              Math.abs(widCell) === Infinity ||
              widCell < 0
            )
              widCell = 0;
            return widCell;
          })
        );
        for (const cel of tabCells) {
          Object.assign(cel.style, {
            minWidth: "15ch",
            width: largestCellWid.toString(),
            height: "max-content",
            verticalAlign: "text-top",
          });
        }
      }
    }
  }
}
export function isClickOutside(
  event: MouseEvent | React.MouseEvent,
  dlgInBtn: Element
): boolean[] {
  try {
    if (!document.querySelector(`#${dlgInBtn.id}` || "dialog"))
      throw new Error(`Modal for outside click not in screen anymore.`);
    const rect = dlgInBtn.getBoundingClientRect();
    const { clientX, clientY } = event;
    return [
      clientX < rect.left,
      clientX > rect.right,
      clientY < rect.top,
      clientY > rect.bottom,
    ];
  } catch (e) {
    return [false, false, false, false];
  }
}
export function fadeElement(
  el: targEl,
  opacity: string = "1",
  timer: string = "0.5",
  timeout: number = 500
): void {
  if (el instanceof HTMLElement) {
    el.style.opacity = opacity;
    setTimeout(() => {
      el.style.transition = `opacity ${timer}s ease-in`;
    }, timeout);
  }
}
export function highlightChange(
  el: targEl,
  color: string = "red",
  context: string = "both",
  double: boolean = false
): void {
  if (el instanceof HTMLElement && typeof color === "string") {
    const iniColor = "rgb(222, 226, 230)";
    const iniFontColor = "rgb(33, 37, 41)";
    const pulseBColor = (el: HTMLElement): void => {
      setTimeout(() => {
        el.style.borderColor = color;
        setTimeout(() => {
          el.style.transition = "border-color 0.5s ease-in";
          setTimeout(() => {
            el.style.borderColor = iniColor;
            setTimeout(() => {
              el.style.transition = "border-color 0.5s ease-in";
            }, 500);
          }, 250);
        }, 500);
      }, 250);
    };
    const pulseFColor = (el: HTMLElement): void => {
      setTimeout(() => {
        el.style.color = color;
        setTimeout(() => {
          el.style.transition = "color 0.5s ease-in";
          setTimeout(() => {
            el.style.color = iniFontColor;
            setTimeout(() => {
              el.style.transition = "color 0.5s ease-in";
            }, 500);
          }, 250);
        }, 500);
      }, 250);
    };
    if (context === "both" || context === "border") {
      pulseBColor(el);
      double && setTimeout(() => pulseBColor(el), 1600);
    }
    if (context === "both" || context === "font") {
      pulseFColor(el);
      double && setTimeout(() => pulseFColor(el), 1600);
    }
  }
}
export function switchBtnBS(
  bsBtns: Array<targEl>,
  bsClasses: Array<string> = ["btn-warning"],
  bsClassesToRemove: Array<string> = ["btn-success"]
): void {
  if (
    Array.isArray(bsBtns) &&
    bsBtns.every((btn) => btn instanceof HTMLElement)
  ) {
    bsBtns.forEach((bsBtn) => {
      if (bsBtn instanceof HTMLButtonElement) {
        fadeElement(bsBtn, "0.5", "3", 3000);
        if (
          bsClasses.some(
            (bsClass) => /warn/gi.test(bsClass) || /danger/gi.test(bsClass)
          )
        ) {
          highlightChange(bsBtn, "yellow");
          if (!bsBtn.querySelector(".bi-exclamation")) {
            const rootSize = parseFloat(
              getComputedStyle(document.querySelector("html")!).fontSize
            );
            const svg = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svg.setAttribute("width", "1rem");
            svg.style.setProperty("height", "1.25rem", "important");
            svg.setAttribute("fill", "currentColor");
            svg.setAttribute("class", "bi bi-exclamation");
            svg.setAttribute("viewBox", "0 0 16 16");
            svg.style.setProperty(
              "padding-bottom",
              `${(rootSize * 0.03) / rootSize}rem`,
              "!important"
            );
            const path = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            path.setAttribute(
              "d",
              "M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0z"
            );
            svg.appendChild(path);
            bsBtn.appendChild(svg);
            bsBtn.style.paddingLeft = `${
              parseFloat(getComputedStyle(bsBtn).paddingLeft) / rootSize +
              parseFloat(getComputedStyle(svg).width) / rootSize
            }rem`;
          }
        }
        if (!bsBtn.classList.contains("btn")) bsBtn.classList.add("btn");
        for (const _ of bsClasses) {
          bsBtn.classList.add(...bsClasses);
          bsBtn.classList.remove(...bsClassesToRemove);
        }
      }
    });
  }
}
export function clearDefInvalidMsg(
  form: HTMLFormElement | null,
  inps: (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null)[]
): void {
  if (Array.isArray(inps) && inps.every((inp) => inp instanceof HTMLElement)) {
    const inpsValidity: boolean[] = [];
    const submitBtns = Array.from(
      document.querySelectorAll('button[type="submit"]')
    );
    if (submitBtns.every((btn) => btn instanceof HTMLElement)) {
      submitBtns.forEach((subBtn) => {
        subBtn.addEventListener("click", () => {
          for (const inp of inps) {
            if (
              inp instanceof HTMLInputElement ||
              inp instanceof HTMLSelectElement ||
              inp instanceof HTMLTextAreaElement
            )
              inpsValidity.push(inp.checkValidity());
          }
        });
      });
    }
    inps.forEach((inp) => {
      if (
        inp instanceof HTMLInputElement ||
        inp instanceof HTMLSelectElement ||
        inp instanceof HTMLTextAreaElement
      ) {
        inp.addEventListener("invalid", (ev) => {
          ev.preventDefault();
        });
      }
    });
    if (form instanceof HTMLFormElement) {
      form.addEventListener("submit", (ev) => {
        if (inpsValidity.some((validity) => validity === false))
          ev.preventDefault();
      });
    }
  }
}
export function addListenerForValidities(
  inps: Array<targEl>,
  pattern?: RegExp
): boolean {
  if (
    Array.isArray(inps) &&
    inps.length > 0 &&
    inps.every((inp) => inp instanceof HTMLElement)
  ) {
    inps.forEach((inp) => {
      if (
        inp instanceof HTMLInputElement ||
        inp instanceof HTMLTextAreaElement
      ) {
        inp.addEventListener("input", () => {
          let inpValidity = true;
          if (inp.value.length > 10) inp.value = inp.value.slice(0, 11);
          if (pattern && !pattern.test(inp.value)) {
            inpValidity = false;
            inp.onsubmit = (): boolean => false;
          }
          if (inpValidity === false || !inp.checkValidity()) {
            if (inp.parentElement) {
              const alertSpan = inp.parentElement.querySelector(".spanAlert");
              if (alertSpan instanceof HTMLElement) {
                Object.assign(alertSpan.style, {
                  display: "flex",
                  flexAlign: "center",
                  justifyContent: "space-evenly",
                  height: getComputedStyle(inp).fontSize,
                  minHeight: getComputedStyle(inp).fontSize,
                  maxHeight: getComputedStyle(inp).fontSize,
                  maxWidth: "5ch",
                  marginBottom: getComputedStyle(inp).marginBottom,
                  marginTop: getComputedStyle(inp).marginTop,
                });
                Object.assign(inp.parentElement.style, {
                  display: "flex",
                  flexAlign: "center",
                  justifyContent: "space-evenly",
                });
                alertSpan.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation" viewBox="0 0 16 16">
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0z"/>
                </svg>
                `;
                fadeElement(alertSpan.querySelector("svg"), "0");
              }
            }
          } else {
            inpValidity = true;
            inp.onsubmit = (): boolean => true;
            inp.style.color = "initial";
            if (inp.parentElement) {
              const alertSpan = inp.parentElement.querySelector(".spanAlert");
              if (alertSpan && alertSpan.querySelector("svg")) {
                fadeElement(alertSpan.children[0], "0");
                setTimeout(() => {
                  alertSpan.innerHTML = ``;
                }, 2000);
              }
            }
          }
          return inpValidity;
        });
      }
    });
  }
  return false;
}
export function clearPhDates(dateInps: Array<targEl>): void {
  if (
    Array.isArray(dateInps) &&
    dateInps.every((inp) => inp instanceof HTMLElement)
  ) {
    dateInps.forEach((inp) => {
      if (inp instanceof HTMLInputElement && inp.type === "date") {
        inp.style.color = "transparent";
        if (inp.parentElement!.querySelector(".datBtn")) {
          inp
            .parentElement!.querySelector(".datBtn")
            ?.addEventListener("click", () => {
              inp.value.length === 0
                ? (inp.style.color = "transparent")
                : (inp.style.color = "black");
            });
        }
        inp.addEventListener("input", () => {
          inp.value.length === 0
            ? (inp.style.color = "transparent")
            : (inp.style.color = "black");
        });
      }
    });
  }
}
export function resetPhs(
  inps: Array<entryEl>,
  phs: { [key: string]: string }
): void {
  if (Array.isArray(inps) && inps.every((inp) => inp instanceof HTMLElement)) {
    for (const inp of inps) {
      const ph = phs[inp.id] ?? "";
      if (
        inp instanceof HTMLInputElement ||
        inp instanceof HTMLTextAreaElement
      ) {
        inp.placeholder = ph;
        ["click", "input"].forEach((ev) => {
          inp.addEventListener(ev, () => {
            inp.placeholder = "";
            if (inp.value === "")
              setTimeout(() => {
                inp.placeholder = ph;
              }, 3000);
          });
        });
      }
    }
  }
}
export function equalizeWidWithPhs(els: Array<targEl>): void {
  if (
    Array.isArray(els) &&
    els.length > 0 &&
    els.every((el) => el instanceof HTMLElement)
  ) {
    const chReferenceCanva = document.getElementById("chreference");
    if (
      document.getElementById("chreference") &&
      chReferenceCanva instanceof HTMLCanvasElement
    ) {
      const chWid =
        chReferenceCanva
          .getContext("2d")
          ?.measureText(chReferenceCanva.textContent ?? "0").width ?? 16;
      els.forEach((el) => {
        if (
          ((el instanceof HTMLInputElement &&
            (el.type === "text" ||
              el.type === "number" ||
              el.type === "search")) ||
            el instanceof HTMLTextAreaElement) &&
          el.placeholder.length > 4
        ) {
          el.style.minWidth = `${el.placeholder.length + 8}ch`;
        } else if (el instanceof HTMLSelectElement) {
          const options = Array.from(el.querySelectorAll("option"));
          if (options.length > 0) {
            if (options.some((option) => option.selected === true)) {
              options
                .filter((options) => options.selected === true)
                .forEach((option) => {
                  el.style.minWidth = `${
                    ((option.textContent?.length || 0) +
                      10 +
                      parseFloat(getComputedStyle(el).paddingLeft) +
                      parseFloat(getComputedStyle(el).paddingRight)) /
                      chWid ||
                    (option.value.length +
                      10 +
                      parseFloat(getComputedStyle(el).paddingLeft) +
                      parseFloat(getComputedStyle(el).paddingRight)) /
                      chWid
                  }ch`;
                });
            } else {
              el.style.minWidth = `${
                ((options[0].textContent?.length ?? 0) +
                  parseFloat(getComputedStyle(el).paddingLeft) +
                  parseFloat(getComputedStyle(el).paddingRight)) /
                  chWid ||
                (options[0].value.length +
                  10 +
                  parseFloat(getComputedStyle(el).paddingLeft) +
                  parseFloat(getComputedStyle(el).paddingRight)) /
                  chWid
              }ch`;
            }
          }
        } else if (
          el instanceof HTMLInputElement &&
          (el.type === "date" || el.type === "hour")
        ) {
          el.style.minWidth = `${
            10 +
            parseFloat(getComputedStyle(el).paddingLeft) +
            parseFloat(getComputedStyle(el).paddingRight)
          }ch`;
        }
      });
    }
  }
}
export function strikeNulls(els: Array<targEl>): void {
  if (
    Array.isArray(els) &&
    els.length > 0 &&
    els.every((el) => el instanceof HTMLElement)
  ) {
    els.forEach((el) => {
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement
      ) {
        if (
          /nul[ol]/gi.test(el.value) ||
          /[ui]ndefin[ei]d/gi.test(el.value) ||
          /NaN/g.test(el.value)
        )
          el.style.textDecoration = "line-through";
      } else if (el instanceof HTMLElement) {
        if (
          el.textContent &&
          (/nul[ol]/gi.test(el.textContent) ||
            /[ui]ndefin[ei]d/gi.test(el.textContent) ||
            /NaN/g.test(el.textContent))
        )
          el.style.textDecoration = "line-through";
      }
    });
  }
}
export function normalizeSizeSb(
  els: Array<targEl>,
  includeChilds: [boolean, number] = [true, 1],
  includeHeight: boolean = false,
  elsToCurrent?: Array<targEl>
): void {
  if (
    Array.isArray(els) &&
    els.length > 0 &&
    els.every((el) => el instanceof HTMLElement)
  ) {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    els.forEach((el) => {
      if (el instanceof HTMLElement) {
        const normalizeScb = (
          element: HTMLElement,
          shouldNormCurrent: boolean = false
        ): void => {
          const iniWid = parseFloat(getComputedStyle(element).width);
          const iniHt = parseFloat(getComputedStyle(element).height);
          const scrollDiv = document.createElement("div") as HTMLDivElement;
          scrollDiv.className = "scrollbarMeasure";
          document.body.appendChild(scrollDiv);
          const scbWidAppend = scrollDiv.offsetWidth - scrollDiv.clientWidth;
          const scbHtAppend = scrollDiv.offsetWidth - scrollDiv.clientHeight;
          document.body.removeChild(scrollDiv);
          const scbWidWindow =
            window.innerWidth - document.body.clientWidth + "px";
          const scbHtWindow =
            window.innerHeight - document.body.clientHeight + "px";
          const validScbWid = Math.max(parseNotNaN(scbWidWindow), scbWidAppend);
          const validScbHt = Math.max(parseNotNaN(scbHtWindow), scbHtAppend);
          element.style.minWidth = `${(iniWid + validScbWid) / rem}rem`;
          includeHeight &&
            (element.style.minHeight = `${(iniHt + validScbHt) / rem}rem`);
          if (shouldNormCurrent && elsToCurrent && elsToCurrent.length > 0) {
            for (let c = 0; c < elsToCurrent.length; c++) {
              if (elsToCurrent[c] instanceof HTMLElement) {
                (elsToCurrent[c] as HTMLElement).style.width = `${
                  (iniWid + validScbWid) / rem
                }rem`;
                includeHeight &&
                  ((elsToCurrent[c] as HTMLElement).style.height = `${
                    (iniHt + validScbHt) / rem
                  }rem`);
              }
            }
          }
        };
        normalizeScb(el, true);
        let safeAcc = 0;
        if (includeChilds && el.firstElementChild instanceof HTMLElement) {
          el = el.firstElementChild;
          do {
            normalizeScb(el as HTMLElement, false);
            if (safeAcc >= 100) break;
            if (
              safeAcc < includeChilds[1] &&
              Array.from(el.children).some(
                (child) =>
                  getComputedStyle(child).overflow === "auto" &&
                  child.classList.contains("formPadded")
              )
            ) {
              Array.from(el.children)
                .filter(
                  (children) =>
                    children.classList.contains("formPadded") &&
                    children instanceof HTMLElement
                )
                .forEach((formPadded) => {
                  (formPadded as HTMLElement).style.overflow = "unset";
                });
            }
            if (el.firstElementChild instanceof HTMLElement)
              el = el.firstElementChild;
            ++safeAcc;
          } while (
            safeAcc <= includeChilds[1] &&
            el instanceof HTMLElement &&
            el.hasChildNodes() &&
            Array.from(el.children).some((el) => el instanceof HTMLElement)
          );
        }
      }
    });
  }
}
export function expandContent(el: targEl): void {
  if (el instanceof HTMLElement) {
    el.style.opacity = "0";
    if (el.parentElement) el.parentElement.style.opacity = "0";
    const outputs = el.querySelectorAll("output");
    if (outputs.length > 0) {
      for (const output of outputs) {
        output.style.overflow = "hidden";
        output.style.width = "0";
      }
    }
    setTimeout(() => {
      if (!el.parentElement) return;
      if (el.parentElement.querySelector(".profileIcon") instanceof HTMLElement)
        (
          el.parentElement.querySelector(".profileIcon") as HTMLElement
        ).style.opacity = "0";
      setTimeout(() => {
        let safeAcc = 0;
        Array.from(el.children).forEach((child) => {
          if (child instanceof HTMLElement) child.style.opacity = "0";
        });
        el.style.width = "0";
        let opcAcc = 0,
          widthAcc = 0;
        const interval = setInterval(() => {
          if (!el.parentElement) return;
          const maxWidth =
            (document.getElementById("nameLogin")?.innerText.length || 12) *
            10.6;
          if (!maxWidth || maxWidth < 0 || !Number.isFinite(maxWidth)) return;
          if (
            parseInt(getComputedStyle(el).opacity) < 1 ||
            parseInt(getComputedStyle(el.parentElement).opacity) < 1 ||
            (el.parentElement.querySelector(".profileIcon") instanceof
              HTMLElement &&
              parseInt(
                getComputedStyle(
                  el.parentElement.querySelector(".profileIcon") as HTMLElement
                ).opacity
              ) < 1)
          ) {
            opcAcc += 0.003;
            if (parseInt(getComputedStyle(el).opacity) < 1)
              el.style.opacity = opcAcc.toString();
            if (parseInt(getComputedStyle(el.parentElement).opacity) < 1)
              el.parentElement.style.opacity = opcAcc.toString();
            if (
              el.parentElement.querySelector(".profileIcon") instanceof
                HTMLElement &&
              parseInt(
                (el.parentElement!.querySelector(".profileIcon") as HTMLElement)
                  .style.opacity
              ) < 1
            )
              (
                el.parentElement!.querySelector(".profileIcon") as HTMLElement
              ).style.opacity = ((opcAcc * 2) / 3).toString();
            Array.from(el.children).forEach((child) => {
              if (child instanceof HTMLElement)
                child.style.opacity = opcAcc.toString();
            });
            if (
              parseFloat(getComputedStyle(el).width.replace("px", "").trim()) <
              maxWidth
            ) {
              widthAcc += 1;
              el.style.width = `${widthAcc}px`;
            }
            if (
              parseFloat(getComputedStyle(el).width.replace("px", "").trim()) >=
              maxWidth
            )
              el.style.width = `${maxWidth}px`;
            safeAcc++;
            for (const output of outputs) {
              if (
                parseFloat(
                  getComputedStyle(output).width.replace("px", "").trim()
                ) < 120
              )
                output.style.width = `${widthAcc}px`;
              if (
                parseFloat(
                  getComputedStyle(output).width.replace("px", "").trim()
                ) >= 120
              )
                output.style.width = "100%";
            }
          }
        }, 5);
        setTimeout(() => {
          let maxWidth =
            (document.getElementById("nameLogin")?.innerText.length || 12) *
            10.6;
          if (!maxWidth || maxWidth < 0 || !Number.isFinite(maxWidth))
            maxWidth = 120;
          el.style.width = `${parseNotNaN(`${maxWidth}px`)}`;
          el.style.maxWidth = `100%`;
          clearInterval(interval);
        }, 6000);
      }, 100);
    }, 100);
  }
}
