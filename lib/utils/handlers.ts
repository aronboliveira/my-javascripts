export function cursorCheckTimer(): number {
  const selection = getSelection();
  if (selection && selection.focusNode !== null) {
    setTimeout(() => {
      return selection.getRangeAt(0)?.startOffset;
    }, 3000);
  }
  return 0;
}
//handler for radios with options
export function opRadioHandler(
  keydown: KeyboardEvent | React.KeyboardEvent,
  radioPairs: targEl[]
): void {
  if (radioPairs.every((radioPair) => radioPair instanceof HTMLInputElement)) {
    for (
      let i = 0;
      i < radioPairs.length;
      i += 2 //pulando de par em par
    ) {
      const radioYes = radioPairs[i];
      const radioNo = radioPairs[i + 1];
      if (!radioYes || !radioNo) break;
      if (
        radioYes instanceof HTMLInputElement &&
        (radioYes.type === "checkbox" || radioYes.type === "radio") &&
        radioNo instanceof HTMLInputElement &&
        (radioNo.type === "checkbox" || radioNo.type === "radio") &&
        !radioYes.checked &&
        !radioNo.checked
      ) {
        if (keydown.altKey && keydown.key === "y") {
          radioYes.focus();
          radioYes.checked = true;
          setTimeout(() => {
            radioYes.blur();
          }, 5000);
          return;
        } else if (keydown.altKey && keydown.key === "n") {
          radioNo.focus();
          radioNo.checked = true;
          setTimeout(() => {
            radioNo.blur();
          }, 5000);
          return;
        }
      }
    }
  }
}
//handler for contextualized problems, with divAdd
export function cpbInpHandler(ev: Event, radio: targEl): void {
  if (
    ev instanceof Event &&
    radio instanceof HTMLInputElement &&
    (radio.type === "checkbox" || radio.type === "radio") &&
    radio?.parentElement?.parentElement
  ) {
    let divAdd: targEl = radio.parentElement.nextElementSibling;
    if (
      !(
        divAdd?.classList.contains("divAdd") ||
        divAdd?.classList.contains("textAdd")
      )
    ) {
      divAdd = radio.parentElement.parentElement.nextElementSibling;
      if (
        !(
          divAdd?.classList.contains("divAdd") ||
          divAdd?.classList.contains("textAdd")
        )
      ) {
        divAdd = radio.parentElement.nextElementSibling?.nextElementSibling;
        if (
          !(
            divAdd?.classList.contains("divAdd") ||
            divAdd?.classList.contains("textAdd")
          )
        )
          divAdd =
            radio.parentElement.parentElement?.parentElement
              ?.nextElementSibling;
      }
    }
    //inclui ambos os tipos de eventos
    const idPattern =
      divAdd?.id
        .replace("text", "")
        .replace("Text", "")
        .replace("div", "")
        .replace("Div", "")
        .replace("Add", "")
        .replace("add", "")
        .replace("Id", "")
        .replace("id", "")
        .toLowerCase() || "";
    if (
      divAdd instanceof HTMLElement &&
      (radio.id?.toLowerCase().includes(idPattern) ||
        radio.id
          ?.toLocaleLowerCase()
          .includes(idPattern.slice(0, 1).toUpperCase() + idPattern.slice(1)))
    ) {
      if (radio.checked && radio.id.includes("Yes")) {
        fadeElement(divAdd, "0");
        setTimeout(() => {
          if (divAdd?.classList.toString().match(/grid/gi))
            (divAdd as HTMLElement).style.display = "grid";
          else if (divAdd?.classList.toString().match(/flex/gi))
            (divAdd as HTMLElement).style.display = "flex";
          else (divAdd as HTMLElement).style.display = "block";
          setTimeout(() => {
            fadeElement(divAdd, "1");
          }, 100);
          setTimeout(() => {
            if (
              divAdd instanceof HTMLElement &&
              getComputedStyle(divAdd).display !== "none"
            ) {
              [
                ...divAdd.querySelectorAll('input[type="radio"]'),
                ...divAdd.querySelectorAll('input[type="checkbox"]'),
              ].forEach((rad) => {
                try {
                  if (
                    !(
                      rad instanceof HTMLInputElement &&
                      (rad.type === "radio" || rad.type === "checkbox")
                    )
                  )
                    return;
                  rad.dataset.required = "true";
                } catch (e) {
                  return;
                }
              });
              [
                ...divAdd.querySelectorAll('input[type="text"]'),
                ...divAdd.querySelectorAll('input[type="number"]'),
                ...(divAdd?.querySelectorAll('input[type="email"]') ?? []),
                ...divAdd.querySelectorAll('input[type="tel"]'),
                ...(divAdd?.querySelectorAll('input[type="date"]') ?? []),
              ].forEach((inp) => {
                try {
                  if (!(inp instanceof HTMLInputElement)) return;
                  inp.required = true;
                } catch (e) {
                  return;
                }
              });
            }
          }, 300);
        }, 400);
      } else {
        fadeElement(divAdd, "0");
        setTimeout(() => {
          (divAdd as HTMLElement).style.display = "none";
        }, 400);
        setTimeout(() => {
          if (
            divAdd instanceof HTMLElement &&
            getComputedStyle(divAdd).display !== "none"
          ) {
            [
              ...divAdd.querySelectorAll('input[type="radio"]'),
              ...divAdd.querySelectorAll('input[type="checkbox"]'),
            ].forEach((rad) => {
              try {
                if (
                  !(
                    rad instanceof HTMLInputElement &&
                    (rad.type === "radio" || rad.type === "checkbox")
                  )
                )
                  return;
                delete rad.dataset.required;
              } catch (e) {
                return;
              }
            });
            [
              ...divAdd.querySelectorAll('input[type="text"]'),
              ...divAdd.querySelectorAll('input[type="number"]'),
              ...(divAdd?.querySelectorAll('input[type="email"]') ?? []),
              ...divAdd.querySelectorAll('input[type="tel"]'),
              ...(divAdd?.querySelectorAll('input[type="date"]') ?? []),
            ].forEach((inp) => {
              try {
                if (!(inp instanceof HTMLInputElement)) return;
                inp.required = false;
              } catch (e) {
                return;
              }
            });
          }
        }, 600);
      }
    }
  }
}
export function doubleClickHandler(inpEl: targEl): void {
  if (
    inpEl instanceof HTMLInputElement &&
    (inpEl.type === "checkbox" || inpEl.type === "radio")
  ) {
    inpEl.checked = inpEl.checked ? false : true;
    cpbInpHandler(new Event("change"), inpEl);
  }
}
export function useCurrentDate(activation: Event, dateBtn: targEl): void {
  if (activation?.target === dateBtn && dateBtn instanceof HTMLButtonElement) {
    const currentDate = new Date();
    const targInputDate = searchPreviousSiblings(dateBtn, "inpDate");
    if (
      targInputDate instanceof HTMLInputElement &&
      targInputDate.type === "date"
    )
      targInputDate.value =
        currentDate.getFullYear() +
        "-" +
        (currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")
          .replaceAll("'", "") +
        "-" +
        currentDate.getDate().toString().padStart(2, "0").replaceAll("'", "");
  }
}
export function changeToAstDigit(toFileInpBtn: targEl): void {
  try {
    if (!(toFileInpBtn instanceof HTMLButtonElement)) return;
    if (!(toFileInpBtn.textContent || toFileInpBtn.textContent === "")) return;
    const inpAst = toFileInpBtn.classList.contains("tratBtn")
      ? toFileInpBtn.previousElementSibling ??
        searchPreviousSiblings(toFileInpBtn, "inpAst") ??
        toFileInpBtn.parentElement?.querySelector(".inpAst")
      : toFileInpBtn.previousElementSibling ??
        toFileInpBtn.parentElement?.querySelector("#inpAstConfirmId") ??
        searchPreviousSiblings(toFileInpBtn, "inpAst") ??
        searchPreviousSiblings(toFileInpBtn, "imgAstDigit");
    if (
      !(
        inpAst instanceof HTMLCanvasElement ||
        inpAst instanceof HTMLInputElement ||
        inpAst instanceof HTMLImageElement
      )
    )
      return;
    if (!(inpAst.parentElement instanceof HTMLElement)) return;
    if (
      inpAst instanceof HTMLCanvasElement ||
      /Usar/gi.test(toFileInpBtn.innerText)
    ) {
      toFileInpBtn.innerText = "Retornar à Assinatura Escrita";
      const fileInp = document.createElement("input");
      fileInp.classList.add("inpAst", "mg__07t", "form-control");
      if (toFileInpBtn.classList.contains("tratBtn")) {
        fileInp.classList.add("inpTrat", "tratAst");
        fileInp.dataset.title =
          inpAst.dataset.title ||
          `Assinatura do Tratamento ${
            document.querySelectorAll(".tratAst").length + 1
          }`;
      } else {
        fileInp.dataset.title = "Assinatura do Paciente";
        defineLabId(document.querySelector(".labAst"), toFileInpBtn, fileInp);
        fileInp.id = "inpAstConfirmId";
        if (toFileInpBtn.previousElementSibling instanceof HTMLButtonElement)
          toFileInpBtn.previousElementSibling?.setAttribute("hidden", "");
      }
      fileInp.type = "file";
      fileInp.accept = "image/*";
      fileInp.required = true;
      inpAst.parentElement.replaceChild(fileInp, inpAst);
      fileInp.addEventListener("change", (change) => {
        try {
          let imgFile;
          if (!fileInp?.files || !fileInp.files[0]) return;
          imgFile = fileInp.files.item(0);
          if (
            !(
              change?.target instanceof HTMLInputElement &&
              fileInp?.files &&
              fileInp.parentElement &&
              fileInp.files?.length > 0 &&
              imgFile?.type?.startsWith("image")
            )
          )
            throw new Error(`Error on selecting the file and/or finding the parent Element for the file input.
            chose.target: ${change?.target ?? "UNDEFINED CHANGE"};
            fileInp: ${fileInp ?? "UNDEFINED INP"};
            files: ${fileInp?.files ?? "UNDEFINED FILES"};
            parentElement: ${fileInp?.parentElement ?? "UNDEFINED PARENT"}; 
            imgFile: ${imgFile ?? "UNDEFINED IMAGE"}; 
            imgFile.type: ${imgFile?.type ?? "UNDEFINED TYPE"}`);
          const reader = new FileReader();
          reader.onloadstart = (): void => {
            toast &&
              toast(
                () => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ marginBottom: "0.3rem" }}>
                      <b>
                        {navigatorVars.pt
                          ? "Iniciando leitura de imagem..."
                          : "Initiating loading of image..."}
                      </b>
                    </div>
                    <div style={{ marginBottom: "0.3rem" }}>
                      <Spinner />
                    </div>
                    <div
                      className="toastDiv"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <progress
                        id="fileLoadingBar"
                        max={100}
                        value={0}
                        style={{ transition: "value 1s ease" }}
                      ></progress>
                    </div>
                  </div>
                ),
                { duration: 1200 }
              );
          };
          reader.onprogress = (ev): void => {
            setTimeout(() => {
              if (!ev.lengthComputable) return;
              const bar = document.getElementById("fileLoadingBar");
              if (!(bar instanceof HTMLProgressElement)) return;
              if (ev.lengthComputable) {
                const percentLoaded = Math.round((ev.loaded / ev.total) * 100);
                bar.value = percentLoaded;
              }
            }, 500);
          };
          reader.onerror = (): void => {
            toast?.error(
              navigatorVars.pt
                ? `Houve algum erro carregando a imagem: ${
                    reader.error?.name ?? "Anônimo"
                  } - ${reader.error?.message ?? "sem descrição"}`
                : `There was some error loading the image: ${
                    reader.error?.name ?? "Anonymous"
                  } - ${reader.error?.message ?? "no description"}`
            );
          };
          reader.onload = (ev): void => {
            const imgAstDigt = document.createElement("img");
            fileInp.id = inpAst.id;
            fileInp.className = inpAst.className;
            Object.assign(imgAstDigt, {
              src: ev.target?.result ?? "Error",
              innerHTML: "",
              id: fileInp.id,
              className: fileInp.className,
              alt: "Assinatura Digital",
              decoding: "async",
              loading: "eager",
              crossorigin: "anonymous",
              style: {
                maxWidth: "300px",
                maxHeight: "200px",
                overflow: "auto",
              },
            });
            if (fileInp.classList.contains("inpTrat")) {
              imgAstDigt.style.height = "100%";
              imgAstDigt.style.maxHeight = "100%";
              imgAstDigt.style.width = "100%";
              imgAstDigt.style.maxHeight = "100%";
            } else {
              imgAstDigt.style.maxWidth = "30rem";
              imgAstDigt.style.maxHeight = "30rem";
            }
            imgAstDigt.style.overflow = "auto";
            fileInp.parentElement?.replaceChild(imgAstDigt, fileInp);
            !fileInp.classList.contains("inpTrat") &&
              defineLabId(
                document.querySelector(".labAst"),
                toFileInpBtn,
                imgAstDigt
              );
          };
          reader.onloadend = (): void => {
            toast?.success(
              navigatorVars.pt
                ? `Imagem carregada com sucesso!`
                : `Success loading image!`,
              {
                duration: 1000,
              }
            );
          };
          reader.readAsDataURL(imgFile);
        } catch (e) {
          return;
        }
      });
      [
        ...document.querySelectorAll(".inpAst"),
        ...document.querySelectorAll(".tratBtn"),
      ].forEach((fileInp) => {
        try {
          if (!(fileInp instanceof HTMLElement)) return;
          fileInp.style.width = `${Math.max(
            ...Array.from(document.querySelectorAll(".tratBtn")).map(
              (tratBtn) => {
                return tratBtn instanceof HTMLElement
                  ? parseNotNaN(
                      getComputedStyle(tratBtn).width.replace("px", "").trim()
                    )
                  : 0;
              }
            )
          )}px`;
        } catch (e) {
          return;
        }
      });
    } else if (
      !(inpAst instanceof HTMLCanvasElement) ||
      /Retornar/gi.test(toFileInpBtn.innerText)
    ) {
      toFileInpBtn.innerText = "Usar Assinatura Digital";
      if (toFileInpBtn.classList.contains("tratBtn")) {
        const textInp = document.createElement("input") as HTMLInputElement;
        textInp.id = inpAst.id;
        textInp.classList.add(
          "inpTrat",
          "inpAst",
          "mg__07t",
          "tratAst",
          "form-control"
        );
        textInp.dataset.title =
          inpAst.dataset.title ||
          `Assinatura do Tratamento ${
            document.querySelectorAll(".tratAst").length + 1
          }`;
        textInp.required = true;
        inpAst.parentElement.replaceChild(textInp, inpAst);
        document.querySelectorAll(".inpAst").forEach((fileInp) => {
          try {
            if (!(fileInp instanceof HTMLElement)) return;
            fileInp.style.width = `${Math.max(
              ...Array.from(document.querySelectorAll(".tratBtn")).map(
                (tratBtn) => {
                  return tratBtn instanceof HTMLElement
                    ? parseNotNaN(
                        getComputedStyle(tratBtn).width.replace("px", "").trim()
                      )
                    : 0;
                }
              )
            )}px`;
          } catch (e) {
            return;
          }
        });
        textInp.addEventListener("input", (ev) =>
          autoCapitalizeInputs(ev.currentTarget as HTMLInputElement)
        );
      } else {
        const fileInp = document.createElement("canvas");
        Object.assign(fileInp, {
          id: "inpAstConfirmId",
        });
        fileInp.dataset.title = "Assinatura do Paciente";
        defineLabId(
          document.querySelector(".labAst"),
          toFileInpBtn,
          fileInp as any
        );
        toFileInpBtn.previousElementSibling?.removeAttribute("hidden");
        inpAst.parentElement.replaceChild(fileInp, inpAst);
        addCanvasListeners();
      }
    }
  } catch (e) {
    return;
  }
}
export function defineLabId(
  labAst: targEl,
  toFileInpBtn: targEl,
  fileEl: HTMLInputElement | HTMLImageElement | HTMLCanvasElement
): void {
  if (
    toFileInpBtn instanceof HTMLButtonElement &&
    (fileEl instanceof HTMLInputElement ||
      fileEl instanceof HTMLImageElement ||
      fileEl instanceof HTMLCanvasElement)
  ) {
    if (
      !labAst &&
      (toFileInpBtn.parentElement?.tagName === "LABEL" ||
        toFileInpBtn.parentElement?.tagName === "SPAN")
    )
      labAst = toFileInpBtn.parentElement;
    labAst!.id = "spanAstPct";
  }
}
export function enableCPFBtn(cpfBtn: targEl, cpfLength: string = ""): boolean {
  if (cpfBtn instanceof HTMLButtonElement && typeof cpfLength === "string") {
    if (cpfLength.replaceAll(/[^0-9]/g, "").length < 11) {
      cpfBtn.disabled = true;
      cpfBtn.style.backgroundColor = "gray";
      cpfBtn.style.borderColor = "gray";
    } else {
      cpfBtn.disabled = false;
      cpfBtn.style.backgroundColor = "#0a58ca";
      cpfBtn.style.borderColor = "#0a58ca";
    }
    return cpfBtn.disabled;
  }
  return true;
}
export function syncAriaStates(
  els: Array<Element> | NodeListOf<Element>
): void {
  if (els instanceof NodeList) els = Array.from(els);
  els = els.filter((el) => el instanceof Element);
  if (
    Array.isArray(els) &&
    els.length > 0 &&
    Array.from(els).every((el) => el instanceof Element)
  ) {
    els.forEach((el) => {
      if (
        el instanceof HTMLHtmlElement ||
        el instanceof HTMLHeadElement ||
        el instanceof HTMLMetaElement ||
        el instanceof HTMLLinkElement ||
        el instanceof HTMLScriptElement ||
        el.tagName === "NOSCRIPT" ||
        el instanceof HTMLBaseElement ||
        el instanceof HTMLStyleElement ||
        (el.parentElement && el.parentElement instanceof HTMLHeadElement) ||
        el.classList.contains("watcher") ||
        el.classList.contains("spinner")
      )
        return;
      if (el instanceof HTMLElement) {
        el.hidden && !el.focus
          ? (el.ariaHidden = "true")
          : (el.ariaHidden = "false");
        el.addEventListener("click", () => {
          el.hidden && !el.focus
            ? (el.ariaHidden = "true")
            : (el.ariaHidden = "false");
        });
        if (el.classList.contains("poCaller")) {
          el.ariaHasPopup = "menu";
        }
        if (
          el instanceof HTMLSelectElement ||
          el instanceof HTMLInputElement ||
          el instanceof HTMLTextAreaElement
        ) {
          if (el instanceof HTMLSelectElement) {
            if (el.querySelectorAll("option").length > 0) {
              el.querySelectorAll("option").forEach((option) => {
                option.selected
                  ? (option.ariaSelected = "true")
                  : (option.ariaSelected = "false");
              });
              el.addEventListener("change", () => {
                el.querySelectorAll("option").forEach((option) => {
                  option.selected
                    ? (option.ariaSelected = "true")
                    : (option.ariaSelected = "false");
                });
              });
            }
            el.addEventListener("click", () => {
              if (el.ariaExpanded === "false") el.ariaExpanded = "true";
              if (el.ariaExpanded === "true") el.ariaExpanded = "false";
            });
          }
          if (
            el instanceof HTMLInputElement ||
            el instanceof HTMLTextAreaElement
          ) {
            if (el.placeholder && el.placeholder !== "")
              el.ariaPlaceholder = el.placeholder;
            if (el.type !== "radio") {
              el.required
                ? (el.ariaRequired = "true")
                : (el.ariaRequired = "false");
              !el.checkValidity()
                ? (el.ariaInvalid = "true")
                : (el.ariaInvalid = "false");
              el.closest("form")?.addEventListener("submit", () => {
                !el.checkValidity()
                  ? (el.ariaInvalid = "true")
                  : (el.ariaInvalid = "false");
              });
            }
            if (
              el instanceof HTMLTextAreaElement ||
              (el instanceof HTMLInputElement &&
                (el.type === "text" ||
                  el.type === "tel" ||
                  el.type === "email" ||
                  el.type === "number" ||
                  el.type === "date" ||
                  el.type === "time" ||
                  el.type === "password" ||
                  el.type === "search" ||
                  el.type === "month" ||
                  el.type === "week"))
            ) {
              if (
                el instanceof HTMLInputElement &&
                el.list &&
                el.list.id !== ""
              )
                el.ariaAutoComplete = "list";
              if (
                el instanceof HTMLInputElement &&
                (el.type === "number" ||
                  el.type === "date" ||
                  el.type === "time")
              ) {
                el.ariaValueMax = (el as HTMLInputElement).max;
                el.ariaValueMin = (el as HTMLInputElement).min;
              }
              if (el instanceof HTMLInputElement && el.type === "range") {
                el.addEventListener("change", () => {
                  el.ariaValueNow = el.value;
                  el.ariaValueText = el.value;
                });
              }
            } else if (
              el instanceof HTMLInputElement &&
              (el.type === "radio" || el.type === "checkbox")
            ) {
              el.checked
                ? (el.ariaChecked = "true")
                : (el.ariaChecked = "false");
              el.disabled
                ? (el.ariaDisabled = "true")
                : (el.ariaDisabled = "false");
              el.addEventListener("change", () => {
                el.checked
                  ? (el.ariaChecked = "true")
                  : (el.ariaChecked = "false");
                el.disabled
                  ? (el.ariaDisabled = "true")
                  : (el.ariaDisabled = "false");
              });
            } else if (
              el instanceof HTMLInputElement &&
              (el.type === "button" ||
                el.type === "submit" ||
                el.type === "reset")
            ) {
              el.addEventListener("mousedown", (click) => {
                if (click.button === 0) el.ariaPressed = "true";
              });
              el.addEventListener("mouseup", (release) => {
                if (release.button === 0) el.ariaPressed = "false";
              });
            }
          }
        }
        if (el instanceof HTMLLabelElement) {
          if (el.hasChildNodes() && el.firstChild instanceof Text) {
            el.ariaLabel = el.firstChild.nodeValue;
          }
        }
        if (el instanceof HTMLButtonElement) {
          el.addEventListener("mousedown", (click) => {
            if (click.button === 0) el.ariaPressed = "true";
          });
          el.addEventListener("mouseup", (release) => {
            if (release.button === 0) el.ariaPressed = "false";
          });
          if (el.textContent?.match(/consultar/gi)) {
            el.ariaHasPopup = "dialog";
          }
        }
        if (el instanceof HTMLDialogElement) el.ariaModal = "true";
      }
    });
  }
}
let showTipsDlg = false;
export function toggleTips(): void {
  const odTipsDlg = document.getElementById("tipsDlg");
  if (odTipsDlg instanceof HTMLDialogElement) {
    odTipsDlg.addEventListener("click", (ev) => {
      if (isClickOutside(ev, odTipsDlg).some((click) => click === true)) {
        showTipsDlg = false;
        odTipsDlg.close();
      }
    });
    const odTipsBtn = document.getElementById("tipsBtn");
    if (odTipsBtn instanceof HTMLButtonElement)
      odTipsBtn.addEventListener("click", () => {
        showTipsDlg = !showTipsDlg;
        showTipsDlg ? odTipsDlg.showModal() : odTipsDlg.close();
      });
    const odTipsClose = document.getElementById("tipsClose");
    if (odTipsClose instanceof HTMLButtonElement)
      odTipsClose.addEventListener("click", () => {
        showTipsDlg = !showTipsDlg;
        showTipsDlg ? odTipsDlg.showModal() : odTipsDlg.close();
      });
  }
}
let showConformDlg = false;
export function toggleConformDlg(): void {
  const conformDlg = document.getElementById("conformDlg");
  const btnConform = document.getElementById("btnConform");
  if (
    conformDlg instanceof HTMLDialogElement &&
    btnConform instanceof HTMLButtonElement
  ) {
    conformDlg.close();
    btnConform.addEventListener("click", () => {
      showConformDlg = !showConformDlg;
      showConformDlg ? conformDlg.showModal() : conformDlg.close();
    });
    conformDlg.addEventListener("click", (click) => {
      if (showConformDlg) {
        const coords = isClickOutside(click, conformDlg);
        if (coords.some((coord) => coord === true)) {
          showConformDlg = false;
          conformDlg.close();
        }
      }
    });
    addEventListener("keydown", (press) => {
      if (press.key === "Escape") {
        showConformDlg = false;
        conformDlg.close();
      }
    });
  }
}
export function indicateValidities(el: HTMLInputElement, valid: boolean): void {
  try {
    if (!(el instanceof HTMLInputElement))
      throw new Error(`Invalid input instance`);
    if (
      (el.type !== "text" &&
        el.type !== "url" &&
        el.type !== "tel" &&
        el.type !== "search" &&
        el.type !== "password" &&
        el.type !== "email" &&
        el.type !== "number" &&
        el.type !== "date" &&
        el.type !== "month") ||
      (el.id === "" && el.name === "") ||
      !el.parentElement ||
      el.parentElement.style.position === "absolute"
    )
      return;
    const bgImg = getComputedStyle(el).backgroundImage;
    const iconized =
      el.type === "url" ||
      el.type === "search" ||
      el.type === "tel" ||
      el.type === "email" ||
      el.type === "number" ||
      el.type === "date" ||
      el.type === "month" ||
      bgImg.includes("image/svg+xml")
        ? true
        : false;
    if (document.body.dataset.indicating !== "true") {
      const removeIcons = (): void =>
        document
          .querySelectorAll(".validationIcon")
          .forEach((icon) => icon.remove());
      for (const ev of ["resize", "scroll"]) addEventListener(ev, removeIcons);
      document.body.dataset.indicating = "true";
    }
    const idf = el.id || el.name,
      previous = validities.get(idf),
      prevIcon = el.parentElement.querySelector(".validationIcon");
    if (prevIcon) prevIcon.remove();
    if (!previous)
      validities.set(idf, {
        valid,
      });
    const curr = validities.get(idf);
    if (!curr) return;
    const icon = document.createElement("span"),
      rect = el.getBoundingClientRect(),
      transform = `translateY(${
        parseNotNaN(compProp(el, "height")) * 0.125
      }px)`;
    let iconW =
      ((): number => {
        try {
          const m = bgImg.match(/viewBox='\.*'/g);
          if (!m) return 0;
          const measures = m[0].split(" ");
          if (measures.length < 4) return 0;
          return parseNotNaN(m[3].trim());
        } catch (e) {
          return 0;
        }
      })() || 16;
    Object.assign(icon.style, {
      position: "absolute",
      top: `${scrollY * 0.99 + rect.top * 0.985}px`,
      left: `${
        scrollX +
        rect.right * 0.935 -
        parseNotNaN(compProp(el, "borderLeftWidth")) -
        parseNotNaN(compProp(el, "paddingLeft")) -
        (iconized ? iconW : 0)
      }px`,
      transition: "opacity 0.3s ease-in-out, transform 0.5s ease-in-out",
      transform,
      margin: "0",
      padding: "0",
    });
    icon.classList.add("validationIcon");
    if (valid) {
      icon.style.transform = `scale(1.2) rotateZ(0.03turn) translateY ${transform}`;
      setTimeout(() => {
        if (icon instanceof HTMLElement && icon.isConnected)
          icon.style.transform = `scale(1.2) rotateZ(0) ${transform}`;
      }, 200);
      setTimeout(() => {
        if (icon instanceof HTMLElement && icon.isConnected)
          icon.style.transform = `scale(1) rotateZ(0) ${transform}`;
      }, 1000);
    }
    valid
      ? (icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#54b457ad" class="bi bi-check" viewBox="0 0 16 16">
        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
      </svg>`)
      : (icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#e5b800" class="bi bi-exclamation" viewBox="0 0 16 16">
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0z"/>
      </svg>`);
    el.after(icon);
    const inputRect = el.getBoundingClientRect();
    icon.style.top = `${
      inputRect.top +
      inputRect.height * 0.5 -
      icon.getBoundingClientRect().height * 0.5 +
      scrollY -
      parseNotNaN(compProp(el, "paddingBottom")) -
      parseNotNaN(compProp(el, "borderBottomWidth"))
    }px`;
    icon.style.left = `${
      inputRect.left -
      inputRect.width * 0.9 +
      icon.getBoundingClientRect().width * 0.9 -
      scrollX +
      parseNotNaN(compProp(el, "paddingLeft")) +
      parseNotNaN(compProp(el, "borderLeftWidth"))
    }`;
    if (timers.get(idf)) clearTimeout(idf);
    timers.set(
      idf,
      setTimeout(() => {
        const icon = el?.parentElement?.querySelector(".validationIcon");
        if (icon && icon.isConnected) icon.remove();
      }, 10000)
    );
  } catch (e) {
    return;
  }
}
export function handleCondtReq(
  el: targEl,
  options: {
    pattern?: [string, string] | RegExp;
    min?: number;
    max?: number;
    minNum?: number;
    maxNum?: number;
  }
): void {
  try {
    if (
      !(
        (el instanceof HTMLInputElement &&
          (el.type === "text" ||
            el.type === "number" ||
            el.type === "email" ||
            el.type === "password" ||
            el.type === "tel" ||
            el.type === "date")) ||
        el instanceof HTMLTextAreaElement
      )
    )
      return;
    if (!el.willValidate || el.value.length < 2) return;
    if (
      !(
        options.pattern ||
        options.min ||
        options.max ||
        options.maxNum ||
        options.minNum
      )
    )
      return;
    if (
      options.pattern &&
      !(
        (options.pattern as any) instanceof RegExp ||
        ((options.pattern as any) instanceof Array &&
          (options.pattern as Array<any>).every(
            (idx) => typeof idx === "string"
          ))
      )
    )
      throw new Error(`Invalid instance given to options.pattern`);
    if (options.min && typeof options.min !== "number")
      throw new Error(`Wrong type given to options.min`);
    if (options.max && typeof options.max !== "number")
      throw new Error(`Wrong type given to options.max`);
    if (el.value.length > 0) {
      if (options.min) {
        el.dataset["reqlength"] = `${options.min}`;
        el.minLength = options.min;
        if (!el.classList.contains("minText")) el.classList.add("minText");
      }
      if (options.max) {
        el.dataset["maxlength"] = `${options.max}`;
        el.maxLength = options.max;
        if (!el.classList.contains("maxText")) el.classList.add("maxText");
      }
      if (el instanceof HTMLInputElement) {
        if (options.minNum) {
          el.dataset["minnum"] = `${options.minNum}`;
          el.min = `${options.minNum}`;
          if (!el.classList.contains("minNum")) el.classList.add("minNum");
        }
        if (options.maxNum) {
          el.dataset["maxnum"] = `${options.maxNum}`;
          el.max = `${options.maxNum}`;
          if (!el.classList.contains("maxNum")) el.classList.add("maxNum");
        }
      }
      if (options.pattern) {
        if (Array.isArray(options.pattern)) {
          el.dataset["pattern"] = `${options.pattern[0]}`;
          el.dataset["flags"] = `${options.pattern[1]}`;
        } else {
          el.dataset["pattern"] = `${(options.pattern as RegExp).source}`;
          el.dataset["flags"] = `${(options.pattern as RegExp).flags || ""}`;
        }
        if (!el.classList.contains("patternText"))
          el.classList.add("patternText");
      }
      handleEventReq(el);
    } else {
      delete el.dataset["reqlength"];
      delete el.dataset["maxlength"];
      delete el.dataset["pattern"];
      delete el.dataset["flags"];
      delete el.dataset["minnum"];
      delete el.dataset["maxnum"];
      if (el instanceof HTMLInputElement) {
        el.min = "";
        el.max = "";
      }
      el.maxLength = 9999;
      el.minLength = 0;
    }
  } catch (e) {
    return;
  }
}
export const iniFontColors: { [k: string]: string } = {};
export function handleEventReq(
  entry: textEl | Event,
  alertColor: string = "#ed615abd"
): void {
  let isValid = true;
  if (entry instanceof Event) {
    if (
      !(
        entry.currentTarget instanceof HTMLInputElement ||
        entry.currentTarget instanceof HTMLTextAreaElement
      )
    )
      return;
    entry = entry.currentTarget;
  }
  if (
    !(entry instanceof HTMLInputElement || entry instanceof HTMLTextAreaElement)
  )
    return;
  if (
    entry instanceof HTMLInputElement &&
    !(
      entry.type === "text" ||
      entry.type === "number" ||
      entry.type === "password" ||
      entry.type === "tel" ||
      entry.type === "email" ||
      entry.type === "date"
    )
  )
    return;
  if (!entry.willValidate) return;
  if (!iniFontColors[entry.id || entry.name])
    iniFontColors[entry.id || entry.name] = getComputedStyle(entry).color;
  if ((iniFontColors[entry.id || entry.name] = alertColor))
    iniFontColors[entry.id || entry.name] = "rgb(33, 37, 41)";
  [
    ...document.querySelectorAll('input[type="number"]'),
    ...document.querySelectorAll('input[type="date"]'),
    ...document.querySelectorAll('input[type="time"]'),
  ].forEach((numInp) => {
    if (
      numInp instanceof HTMLInputElement &&
      (numInp.type === "number" ||
        numInp.type === "date" ||
        numInp.type === "time")
    ) {
      if (numInp.step === "") numInp.step = "any";
      numInp.step !== "any" &&
        !/[^0-9]/g.test(numInp.step) &&
        numInp.step.replaceAll(/[^0-9]/g, "");
    }
  });
  if (!entry.checkValidity()) isValid = false;
  if (entry.type === "date") {
    if (entry.classList.contains("minCurrDate")) {
      const currDate = new Date()
        .toISOString()
        .split("T")[0]
        .replaceAll("-", "")
        .trim();
      if (currDate.length < 8) return;
      const currNumDate = Math.abs(parseNotNaN(currDate));
      if (
        !Number.isFinite(currNumDate) ||
        currNumDate.toString().slice(0, currNumDate.toString().indexOf("."))
          .length < 8
      )
        return;
      const entryNumDateValue = parseNotNaN(entry.value.replaceAll("-", ""));
      if (
        !Number.isFinite(entryNumDateValue) ||
        entryNumDateValue
          .toString()
          .slice(0, entryNumDateValue.toString().indexOf(".")).length < 8
      )
        return;
      if (entryNumDateValue < currNumDate) isValid = false;
    }
    if (entry.classList.contains("maxCurrDate")) {
      const currDate = new Date()
        .toISOString()
        .split("T")[0]
        .replaceAll("-", "")
        .trim();
      if (currDate.length < 8) return;
      const currNumDate = Math.abs(parseNotNaN(currDate));
      if (
        !Number.isFinite(currNumDate) ||
        currNumDate.toString().slice(0, currNumDate.toString().indexOf("."))
          .length < 8
      )
        return;
      const entryNumDateValue = parseNotNaN(entry.value.replaceAll("-", ""));
      if (
        !Number.isFinite(entryNumDateValue) ||
        entryNumDateValue
          .toString()
          .slice(0, entryNumDateValue.toString().indexOf(".")).length < 8
      )
        return;
      if (entryNumDateValue > currNumDate) isValid = false;
    }
  } else {
    if (
      (entry.classList.contains("minText") &&
        entry.value.length < parseNotNaN(entry.dataset.reqlength || "3")) ||
      (entry.classList.contains("maxText") &&
        entry.value.length > parseNotNaN(entry.dataset.maxlength || "3")) ||
      (entry.classList.contains("minNum") &&
        parseNotNaN(entry.value) < parseNotNaN(entry.dataset.minnum || "3")) ||
      (entry.classList.contains("maxNum") &&
        parseNotNaN(entry.value) > parseNotNaN(entry.dataset.maxnum || "3")) ||
      (entry.classList.contains("patternText") &&
        entry.dataset.pattern &&
        !new RegExp(entry.dataset.pattern, entry.dataset.flags || "").test(
          entry.value
        ))
    )
      isValid = false;
  }
  if (!isValid && entry.value.length > 2) {
    entry.style.color = alertColor;
    setTimeout(() => {
      if (entry instanceof Event) {
        if (
          !(
            entry.currentTarget instanceof HTMLInputElement ||
            entry.currentTarget instanceof HTMLTextAreaElement
          )
        )
          return;
        entry = entry.currentTarget;
      }
      entry.style.color = "rgb(33, 37, 41)";
    }, 10000);
  } else entry.style.color = "rgb(33, 37, 41)";
  entry instanceof HTMLInputElement && indicateValidities(entry, isValid);
}
export function cleanStorageName(): void {
  if (!window) return;
  ["name", "secondName", "lastName"].forEach((n) => {
    try {
      localStorage.setItem(n, "");
    } catch (e) {
      return;
    }
  });
}
export function registerPersistInputs({
  f,
  selects = true,
  textareas = true,
  inputTypes = ["text", "number", "date"],
  queriesToExclude,
}: {
  f: nlFm;
  selects: boolean;
  textareas: boolean;
  inputTypes?: string[];
  queriesToExclude?: string[];
}): void {
  try {
    if (!(f instanceof HTMLElement))
      throw new Error(`Failed to validate Form Reference in the DOM`);
    f.dataset.start = "true";
    if (!Array.isArray(inputTypes))
      throw new Error(`Error validating type of inputTypes argument`);
    inputTypes = inputTypes.filter((t) => typeof t === "string");
    if (typeof selects !== "boolean") selects = false;
    if (typeof textareas !== "boolean") textareas = false;
    if (selects)
      f.querySelectorAll("select").forEach(
        (s) =>
          !s.classList.contains("ssPersist") && s.classList.add("ssPersist")
      );
    if (textareas)
      f.querySelectorAll("textarea").forEach(
        (ta) =>
          !ta.classList.contains("ssPersist") && ta.classList.add("ssPersist")
      );
    inputTypes.forEach((t) =>
      f
        .querySelectorAll(`input[type=${t}]`)
        .forEach(
          (inp) =>
            !inp.classList.contains("ssPersist") &&
            inp.classList.add("ssPersist")
        )
    );
    if (queriesToExclude) {
      queriesToExclude.forEach((q) => {
        const queried = f.querySelector(q);
        if (!queried) return;
        queried.classList.contains("ssPersist") &&
          queried.classList.remove("ssPersist");
      });
    }
  } catch (e) {
    return;
  }
}
const loops: { [k: string]: boolean } = {};
export function registerRoot(
  root: vRoot,
  selector: string,
  selectorRef?: MutableRefObject<nlHtEl>,
  renderFollows: boolean = true
): vRoot {
  try {
    const rootEl =
      typeof selectorRef === "object" && "current" in selectorRef
        ? selectorRef.current ??
          document.querySelector(selector) ??
          document.getElementById(selector)
        : document.querySelector(selector) ?? document.getElementById(selector);
    if (!(rootEl instanceof HTMLElement))
      throw elementNotFound(
        rootEl,
        `Finding element with ${selector} for rooting`,
        extLine(new Error())
      );
    if (!root && rootEl) {
      if (rootEl.dataset.rooted === "true") {
        if (!rootEl.hasChildNodes()) {
          console.log(`Root Element ${selector} has no children `);
          rootEl.dataset.rooted = "false";
          root = createRoot(rootEl);
        } else {
          console.log(`Root Element ${selector} has children`);
          if (renderFollows) {
            root = createRoot(rootEl);
            loops[selector] = false;
            const lto = setTimeout(() => (loops[selector] = true), 3000);
            while (rootEl?.firstChild) {
              if (loops[selector]) return root;
              rootEl?.removeChild(rootEl.firstChild);
            }
            clearTimeout(lto);
            loops[selector] = false;
          }
        }
      } else root = createRoot(rootEl);
    } else if (root && !(root as any)["_internalRoot"]) {
      console.log(`Root ${selector} invalid`);
      root = undefined;
      rootEl.dataset.rooted = "false";
      root = createRoot(rootEl);
    }
    rootEl.dataset.rooted = "true";
  } catch (e) {
    console.error(`Error executing registerRoot:\n${(e as Error).message}`);
    return root;
  }
  return root;
}
