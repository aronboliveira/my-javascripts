import { nlInp } from "../../../src/lib/global/declarations/types";
import {
  cleanStorageName,
  handleCondtReq,
  handleEventReq,
} from "../../../src/lib/global/handlers/gHandlers";
import { MutableRefObject, useEffect } from "react";
export default function Name({
  lastNameRef,
}: {
  lastNameRef?: MutableRefObject<nlInp>;
}): JSX.Element {
  useEffect(() => {
    addEventListener("beforeunload", cleanStorageName);
    (): void => {
      cleanStorageName();
      removeEventListener("beforeunload", cleanStorageName);
    };
  }, []);
  return (
    <div
      className="fsAnamGDiv alItSt900Q flexQ900NoWC flexAlItE flexNoW flexSimple wsNoW cGap0 ws900N"
      id="fsAnamGDiv1"
      role="group"
    >
      <span
        role="group"
        className={`fsAnamGSpan flexAlItCt col`}
        id="fsAnamGSpan1"
      >
        <label htmlFor="firstNameId" className="labelIdentif">
          Primeiro Nome (Simples ou Composto):
          <input
            type="text"
            name="first_name"
            id="firstNameId"
            className="form-control autocorrect inpIdentif noInvert minText maxText patternText"
            autoComplete="given-name"
            data-title="primeiro_nome"
            data-reqlength="3"
            data-maxlength="99"
            data-pattern="[^0-9]"
            data-flags="gi"
            minLength={3}
            maxLength={99}
            required
            onInput={(ev) => {
              handleEventReq(ev.currentTarget);
              if (window) localStorage.setItem("name", ev.currentTarget.value);
            }}
          />
        </label>
        <br role="presentation" />
      </span>
      <span
        role="group"
        className="fsAnamGSpan flexAlItCt col"
        id="fsAnamGSpan2"
      >
        <label htmlFor="additionalNameId" className="labelIdentif">
          Sobrenome(s) do Meio, se presente(s):
          <input
            type="text"
            name="additional_name"
            id="additionalNameId"
            className="form-control autocorrect inpIdentif noInvert"
            data-title="nome_do_meio"
            autoComplete="additional-name"
            onInput={(ev) => {
              handleCondtReq(ev.currentTarget, {
                min: 3,
                max: 99,
                pattern: ["[^0-9]", "gi"],
              });
              if (window)
                localStorage.setItem("secondName", ev.currentTarget.value);
            }}
          />
        </label>
        <br role="presentation" />
      </span>
      <span
        role="group"
        className="fsAnamGSpan flexAlItCt col"
        id="fsAnamGSpan3"
      >
        <label htmlFor="familyNameId" className="labelIdentif">
          Último Sobrenome:
          <input
            ref={lastNameRef}
            type="text"
            name="family_name"
            id="familyNameId"
            className="form-control autocorrect inpIdentif noInvert minText maxText patternText"
            autoComplete="family-name"
            required
            data-title="ultimo_nome"
            data-reqlength="3"
            data-maxlength="99"
            data-pattern="[^0-9]"
            data-flags="gi"
            minLength={3}
            maxLength={99}
            onInput={(ev) => {
              handleEventReq(ev.currentTarget);
              if (window)
                localStorage.setItem("lastName", ev.currentTarget.value);
            }}
          />
        </label>
        <br role="presentation" />
      </span>
    </div>
  );
}
export function correctCursorNextWords(
  isCursorAutoMoved: boolean = false,
  isUndoUppercase: boolean = false,
  match: string | null = "",
  textElement: Element
): [string, boolean] | void {
  let text = (textElement as entryEl)?.value || textElement.textContent || "";
  let isFixAfterDCursorExec = false;

  if (isFixAfterDCursorExec) return;
  const selectionPosition = window.getSelection()?.getRangeAt(0).startOffset;
  text = wrongStartCorrection(text, match) ?? "";
  textElement.addEventListener("keyup", (fixmove) => {
    const keyboardEvent = fixmove as KeyboardEvent;
    if (selectionPosition === 0 || selectionPosition === text?.length || 0) {
      if (
        keyboardEvent.key === " " ||
        keyboardEvent.key === "Backspace" ||
        (keyboardEvent.key >= "ArrowLeft" &&
          keyboardEvent.key <= "ArrowDown") ||
        (keyboardEvent.key >= "a" && keyboardEvent.key <= "z") ||
        (keyboardEvent.key >= "A" && keyboardEvent.key <= "Z") ||
        isUndoUppercase
      ) {
        if (!isFixAfterDCursorExec)
          isCursorAutoMoved = moveCursorToTheEnd(
            isCursorAutoMoved,
            textElement
          );

        keyboardEvent.preventDefault();
        isFixAfterDCursorExec = true;
      }
    }
  });
  return [text, isCursorAutoMoved];
}
export function wrongStartCorrection(
  text: string | null = "",
  wrongStartMatch: string | null = ""
): string | null {
  let fixedText = text;
  if (wrongStartMatch && text) {
    const wrongStartLength = wrongStartMatch
      .toString()
      .replaceAll(",", "").length;
    fixedText =
      text.slice(wrongStartLength - 1) + text.slice(0, wrongStartLength - 1);
  }
  return fixedText;
}
export function moveCursorToTheEnd(
  isCursorAutoMoved: boolean = false,
  textElement: Element
): boolean {
  if (window.getSelection && !isCursorAutoMoved) {
    const range = document.createRange();
    range.selectNodeContents(textElement);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    isCursorAutoMoved = true;
  } else isCursorAutoMoved = false;

  return isCursorAutoMoved;
}
export function fixCursorPosition(
  textElement: Element,
  range: Range,
  selection: Selection | null,
  shouldSetEnd: boolean = false
): void {
  range.setStart(textElement, 0);
  if (shouldSetEnd === true) range.setEnd(textElement, 1);
  range.collapse(true);
  selection?.removeAllRanges();
  selection?.addRange(range);
}
export function fixFirstLetter(
  fstLet: string = "",
  regex: RegExp,
  textElement: Element,
  range: Range,
  selection: Selection | null,
  shouldSetEnd: boolean = false
): string {
  let contText =
    (textElement as entryEl).value || textElement.textContent || "";
  const firstLetterMatch = fstLet?.match(regex);
  if (firstLetterMatch) {
    contText = fstLet?.toUpperCase() + contText.substring(1).toLowerCase();
    if (range.endOffset >= 1)
      fixCursorPosition(textElement, range, selection, shouldSetEnd);
  }
  return contText;
}
export function fixWrongStarts(
  text: targStr = "",
  match: targStr = "",
  length: number = 0
): string {
  let fixedStr = text ?? "";
  if (text && match) {
    const arrText = Array.from(text);
    arrText.splice(text.indexOf(match), length, "");
    fixedStr = arrText.toString().replaceAll(",", "");
  }
  return fixedStr;
}
export function fixNextWordsIniNotD(
  remadeText: string = "",
  letMatch: string = ""
): string {
  if (remadeText) {
    const gLetMatchI = remadeText.lastIndexOf(letMatch) + 1;
    const capChar = remadeText.charAt(gLetMatchI)?.toUpperCase();
    const arrText = Array.from(remadeText);
    arrText[gLetMatchI] = capChar;
    remadeText = arrText.toString().replaceAll(",", "");
    if (remadeText.match(/^\s[\w]+/g))
      remadeText = remadeText.slice(1, remadeText.length) + " ";
  } else remadeText = "";

  return remadeText;
}
export function fixNextWordsAfterD(
  remadeText: string = "",
  letMatch: string = ""
): string {
  const globalLetterMatchIndexD = remadeText
    ? remadeText.lastIndexOf(letMatch) + 1
    : undefined;
  if (globalLetterMatchIndexD) {
    const actualCharD = remadeText?.charAt(globalLetterMatchIndexD);
    const capitalizedCharD = actualCharD?.toUpperCase();
    if (remadeText && capitalizedCharD) {
      const citeTextArrayD = Array.from(remadeText);
      citeTextArrayD[globalLetterMatchIndexD] = capitalizedCharD;
      remadeText = citeTextArrayD.toString().replaceAll(",", "");
    }
  }
  return remadeText;
}
export function fixUnproperUppercases(
  text: string = "",
  match: string = "",
  context: string | number = 0
): string {
  const spaceMatches = text.match(/\s/g);
  const upperCasesRepetitionsIndex = text.indexOf(match);
  const textBeforeRepetitions = text.substring(0, upperCasesRepetitionsIndex);
  let addAcumulator = 0,
    loweredRepetitions = "";

  loweredRepetitions = match.toLowerCase().slice(1);
  if (spaceMatches) {
    if (
      context === "NoD" ||
      context === "YesDCont" ||
      context === 0 ||
      context === 2 ||
      !context
    ) {
      if (context === "YesDCont" || context === 2) {
        const lowercasesMatches = text.match(/[a-záàâäãéèêëíìîïóòôöõúùûü]/g);
        if (lowercasesMatches) addAcumulator += lowercasesMatches.length;
      }
      addAcumulator += spaceMatches.length;
    } else if (context === "YesDVal" || context === 1) addAcumulator = 1;
  }
  const textAfterRepetitions = text.slice(
    upperCasesRepetitionsIndex + 1 + loweredRepetitions.length - addAcumulator,
    text.length + 1
  );
  const textArray = Array.from(text);
  textArray.splice(
    upperCasesRepetitionsIndex + 1,
    loweredRepetitions.length,
    loweredRepetitions
  );
  if (context === "NoD" || context === 0 || !context)
    text =
      textBeforeRepetitions +
      match.slice(0, 1) +
      loweredRepetitions +
      textAfterRepetitions;
  else if (context === "YesDVal") {
    const upperlowercombD = text.match(/D[a-záàâäãéèêëíìîïóòôöõúùûü][sS]?[\s]/);
    if (upperlowercombD?.length === 4)
      loweredRepetitions += upperlowercombD.toString().replace(/S/, "s");
    text = textBeforeRepetitions + loweredRepetitions + textAfterRepetitions;
  } else if (context === "YesDCont") {
    text = text.match(
      /D[aeiouáàâäãéèêëíìîïóòôöõúùûü][s]\s[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]{3,}/
    )
      ? textBeforeRepetitions + loweredRepetitions + "S" + textAfterRepetitions
      : textBeforeRepetitions + loweredRepetitions + textAfterRepetitions;
  }
  return text;
}
export function fixForcedUpperCase(
  textElement: Element,
  wordMatch: string[] = [""],
  wMatchIteration: RegExpMatchArray | string = ""
): string {
  let text = (textElement as textEl).value || textElement.textContent || "";
  const strDlowercase = wMatchIteration.toString();
  const DUppercased = strDlowercase.charAt(1).toUpperCase();
  if (DUppercased) {
    const strDAfterMinusInd =
      (text?.length ?? 0) -
      (strDlowercase.substring(0, 1) + DUppercased + strDlowercase.substring(2))
        .length;
    const startSlicedCite = text?.slice(0, strDAfterMinusInd);
    if (wordMatch.length >= 1 && startSlicedCite)
      text = startSlicedCite + text?.slice(strDAfterMinusInd);
  }
  return text;
}
export function autoCapitalizeInputs(
  textEl: targEl,
  isAutocorrectOn: boolean = true
): string {
  if (
    (textEl instanceof HTMLInputElement && textEl.type === "text") ||
    textEl instanceof HTMLTextAreaElement
  ) {
    let text = textEl?.value ?? null;
    if (isAutocorrectOn && text) {
      //inicialização de expressões regex com seus objetos e matches associados
      const newWordMatches = text.match(
        /\s[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]?[a-zA-ZáàâäãéèêëíìîïóòôöõúùûüÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]+\s?[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]?[a-zA-ZáàâäãéèêëíìîïóòôöõúùûüÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]*/g
      );
      const letterMatchesIniNotD = text.match(/\s[^d]/g);
      const letterMatchesIniD = text.match(/\sd/g);
      let letterNotMatchesAfterD =
        text.match(
          /\sd[aeioáàâäãéèêëíìîïóòôöõúùûüAEIOÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][sS]?\s/g
        ) ?? [];
      const letterMatchesAfterDOp1 = text.match(
        /\sd[^aeioáàâäãéèêëíìîïóòôöõúùûüAEIOÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]/g
      );
      const letterMatchesAfterDOp2 = text.match(
        /\sd[aeioáàâäãéèêëíìîïóòôöõúùûüAEIOÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][^sS\s]/g
      );
      const letterMatchesAfterDOp3 = text.match(
        /\sd[aeioáàâäãéèêëíìîïóòôöõúùûüAEIOÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][sS][a-zA-ZáàâäãéèêëíìîïóòôöõúùûüÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]/g
      );
      const lowercasesRegexObj = new RegExp(/[a-záàâäãéèêëíìîïóòôöõúùûü]/g);
      const uppercasesRegexObj = new RegExp(/[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]/);
      const multipleUppercasesMatches = text.match(
        /[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]{2,}/g
      );
      const multipleUppercasesMatches2 = text.match(
        /D[a-záàâäãéèêëíìîïóòôöõúùûü][S]\s/g
      );
      const wrongUppercasesMatchesOp1 = text.match(
        /[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][a-záàâäãéèêëíìîïóòôöõúùûü]+[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]\b/g
      );
      const wrongUppercasesMatchesOp2 = text.match(
        /[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][a-záàâäãéèêëíìîïóòôöõúùûü]+[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][a-záàâäãéèêëíìîïóòôöõúùûü]+\b/g
      );
      const wrongUppercasesMatchesOp3 = text.match(
        /[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][a-záàâäãéèêëíìîïóòôöõúùûü]+[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]+[a-záàâäãéèêëíìîïóòôöõúùûü]{2,3}\b/g
      );
      const wrongUppercasesMatchesOp4 = text.match(
        /[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][a-záàâäãéèêëíìîïóòôöõúùûü][A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][a-záàâäãéèêëíìîïóòôöõúùûü]+[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][a-záàâäãéèêëíìîïóòôöõúùûü]+\b/g
      );
      const wrongUppercasesMatchesOp5 = text.match(
        /[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][a-záàâäãéèêëíìîïóòôöõúùûü]{1,2}[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][a-záàâäãéèêëíìîïóòôöõúùûü]+[a-záàâäãéèêëíìîïóòôöõúùûüA-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]+\b/g
      );
      const wrongUppercasesMatchesOp6 = text.match(
        /[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][a-záàâäãéèêëíìîïóòôöõúùûü]+[a-záàâäãéèêëíìîïóòôöõúùûü]+[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]+[a-záàâäãéèêëíìîïóòôöõúùûü][a-záàâäãéèêëíìîïóòôöõúùûü]+\b/g
      );
      const wrongUppercasesMatchesOp7 = text.match(
        /D[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][sS]/g
      );
      const wrongUppercasesMatchesOp8 = text.match(
        /D[AEIOÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][^sS]/g
      );
      const wrongUppercasesMatchesOp9 = text.match(
        /D[aeioáàâäãéèêëíìîïóòôöõúùûüAEIOÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ][sS]\s/g
      );
      const wrongStartMatch =
        text
          .match(/^[a-záàâäãéèêëíìîïóòôöõúùûü]+[A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]/)
          ?.toString() ?? null;
      const wrongCharsRegexOp1 =
        /[\s]*[\d\n,;.+\-=~\\/|"!@#$%&*¬°ªº§¹²³£¢(){}[\]]+[\s]*[\d\n,;.+\-=~\\/|"!@#$%&*¬°ªº§¹²³£¢(){}[\]]*/g;
      const wrongCharsMatchesOp1 = text.match(wrongCharsRegexOp1);
      const wrongCharsRegexOp2 =
        /$[\d\n,;.+\-=~\\/|"!@#$%&*¬°ªº§¹²³£¢(){}[\]]+/g;
      const wrongCharsMatchesOp2 = text.match(wrongCharsRegexOp2);
      const wrongCharsRegexOp3 =
        /(?<=\sdD)[\d\n,;.+\-=~\\/|"!@#$%&*¬°ªº§¹²³£¢(){}[\]]+/g;
      const wrongCharsMatchesOp3 = text.match(wrongCharsRegexOp3);

      //inicialização de outras variáveis
      const selection = window.getSelection();
      const range = document.createRange();
      let remadeText = text;
      let isUndoUppercase = false;
      let isCursorAutoMoved = false;

      if (text.length === 1 && !newWordMatches)
        textEl.value = fixFirstLetter(
          text[0],
          /\b\w/,
          textEl,
          range,
          selection,
          false
        );
      else if (
        text.length > 1 &&
        !textEl.classList.contains("autocorrectFirst")
      ) {
        if (
          textEl.classList.contains("inpAst") ||
          textEl.classList.contains("inpIdentif") ||
          textEl.classList.contains("autocorrectAll")
        ) {
          //IIFE para encapsular correção de inícios incorretos de entrada
          ((): void => {
            if (
              wrongCharsMatchesOp1 ||
              wrongCharsMatchesOp2 ||
              wrongCharsMatchesOp3
            ) {
              const wrongCharsMatches = [
                ...(wrongCharsMatchesOp1 || []),
                ...(wrongCharsMatchesOp2 || []),
                ...(wrongCharsMatchesOp3 || []),
              ];

              for (let iW = 0; iW < wrongCharsMatches.length; iW++) {
                wrongCharsMatches.forEach((wrongCharMatch) => {
                  textEl.value = fixWrongStarts(
                    text,
                    wrongCharMatch,
                    wrongCharsMatches[iW].length
                  );
                  [textEl.value, isCursorAutoMoved] = correctCursorNextWords(
                    isCursorAutoMoved,
                    isUndoUppercase,
                    wrongStartMatch,
                    textEl
                  );
                });
              }
            }
          })();

          if (wrongStartMatch)
            textEl.value =
              wrongStartCorrection(textEl.value, wrongStartMatch) ?? "";
          if (newWordMatches) {
            newWordMatches.forEach((): void => {
              //IIFE para capitalizar palavras após a primeira
              ((): void => {
                if (letterMatchesIniNotD && !letterMatchesIniD) {
                  letterMatchesIniNotD.forEach((letterMatch) => {
                    remadeText = fixNextWordsIniNotD(remadeText, letterMatch);
                  });
                  textEl.value = remadeText;
                  [textEl.value, isCursorAutoMoved] = correctCursorNextWords(
                    isCursorAutoMoved,
                    isUndoUppercase,
                    wrongStartMatch,
                    textEl
                  );
                  textEl.value =
                    wrongStartCorrection(textEl.value, wrongStartMatch) ?? "";
                } else if (
                  (letterMatchesIniNotD && letterMatchesIniD) ||
                  (!letterMatchesIniNotD && letterMatchesIniD)
                ) {
                  //IIFE para correção focada em conjunção com D
                  ((): void => {
                    let letterMatchesAfterD: string[] = [];
                    if (
                      !letterNotMatchesAfterD &&
                      (letterMatchesAfterDOp1 ||
                        letterMatchesAfterDOp2 ||
                        letterMatchesAfterDOp3)
                    ) {
                      letterMatchesAfterD = [
                        ...(letterMatchesAfterDOp1 || []),
                        ...(letterMatchesAfterDOp2 || []),
                        ...(letterMatchesAfterDOp3 || []),
                      ];
                    } else if (
                      letterNotMatchesAfterD &&
                      letterMatchesIniNotD &&
                      !(
                        letterMatchesAfterDOp1 ||
                        letterMatchesAfterDOp2 ||
                        letterMatchesAfterDOp3
                      )
                    ) {
                      letterMatchesAfterD = [...(letterMatchesIniNotD || [])];
                    } else if (
                      letterNotMatchesAfterD &&
                      (letterMatchesAfterDOp1 ||
                        letterMatchesAfterDOp2 ||
                        letterMatchesAfterDOp3 ||
                        letterMatchesIniNotD)
                    ) {
                      letterMatchesAfterD = [
                        ...(letterMatchesAfterDOp1 || []),
                        ...(letterMatchesAfterDOp2 || []),
                        ...(letterMatchesAfterDOp3 || []),
                      ];
                    }
                    //IIFE para capitalização focada em iniciais D
                    ((): void => {
                      letterMatchesAfterD?.forEach((letterMatchD) => {
                        remadeText = fixNextWordsAfterD(
                          remadeText,
                          letterMatchD
                        );
                      });
                      textEl.value = remadeText;
                      for (
                        let iD = 0;
                        iD < Array.from(letterMatchesAfterD ?? []).length;
                        iD++
                      ) {
                        const filteredArrayD = letterMatchesAfterD?.filter(
                          (iD) => lowercasesRegexObj.test(iD)
                        );
                        if (filteredArrayD) {
                          const mappedArrayD = filteredArrayD.map((iD) =>
                            iD.toUpperCase()
                          );
                          let remadeStringD = "";
                          if (iD === 0) {
                            filteredArrayD.splice(iD, 1, mappedArrayD[0]);
                            remadeStringD = filteredArrayD
                              .toString()
                              .replaceAll(",", "");
                            [textEl.value, isCursorAutoMoved] =
                              correctCursorNextWords(
                                isCursorAutoMoved,
                                isUndoUppercase,
                                wrongStartMatch,
                                textEl
                              );
                          } else if (iD === 1) {
                            filteredArrayD.splice(iD, 1, mappedArrayD[1]);
                            remadeStringD = filteredArrayD
                              .toString()
                              .replaceAll(",", "")
                              .slice(2);
                            [textEl.value, isCursorAutoMoved] =
                              correctCursorNextWords(
                                isCursorAutoMoved,
                                isUndoUppercase,
                                wrongStartMatch,
                                textEl
                              );
                            if (textEl.value)
                              textEl.value = textEl.value.replace(
                                new RegExp(filteredArrayD[iD], "g"),
                                remadeStringD
                              );
                          } else if (iD > 2) {
                            filteredArrayD.pop();
                            filteredArrayD.push(mappedArrayD[iD]);
                            [textEl.value, isCursorAutoMoved] =
                              correctCursorNextWords(
                                isCursorAutoMoved,
                                isUndoUppercase,
                                wrongStartMatch,
                                textEl
                              );
                          }
                        }
                      }
                    })();
                  })();
                }
              })();
            });
          }
          //statement para correção de múltiplos upper cases
          if (multipleUppercasesMatches || multipleUppercasesMatches2) {
            //IIFE para encapsular correção de múltiplos upper cases
            ((): void => {
              const unproperUppercases = [
                ...(multipleUppercasesMatches || []),
                ...(wrongUppercasesMatchesOp1 || []),
                ...(wrongUppercasesMatchesOp2 || []),
                ...(wrongUppercasesMatchesOp3 || []),
                ...(wrongUppercasesMatchesOp4 || []),
                ...(wrongUppercasesMatchesOp5 || []),
                ...(wrongUppercasesMatchesOp6 || []),
              ];
              const unproperDUppercases = [
                ...(wrongUppercasesMatchesOp7 || []),
                ...(wrongUppercasesMatchesOp8 || []),
                ...(wrongUppercasesMatchesOp9 || []),
              ];
              unproperUppercases.forEach((multipleUppercasesMatch) => {
                if (text && multipleUppercasesMatch) {
                  text = fixUnproperUppercases(
                    text,
                    multipleUppercasesMatch,
                    "NoD"
                  );
                  //correção de bugs com combinações posteriores de upper/lower
                  // const upperlowercomb = text.match(
                  //   /[a-záàâäãéèêëíìîïóòôöõúùûü][A-ZÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜ]/g
                  // );
                  // const upperlowercombD = text.match(
                  //   /D[a-záàâäãéèêëíìîïóòôöõúùûü][\s]/
                  // );
                  // if (upperlowercomb || upperlowercombD) {
                  //   repeatedLetter = repeatedLetter.toLowerCase();
                  // }

                  //fix para delay em processamento do S em conjunções
                  const upperlowercombDS = text.match(
                    /D[a-záàâäãéèêëíìîïóòôöõúùûü][S][\s]/
                  );
                  if (upperlowercombDS) upperlowercombDS.splice(3, 1, "s");

                  textEl.value = text;
                  isUndoUppercase = true;
                  [textEl.value, isCursorAutoMoved] = correctCursorNextWords(
                    isCursorAutoMoved,
                    isUndoUppercase,
                    wrongStartMatch,
                    textEl
                  );
                  if (range.endOffset >= 1)
                    fixCursorPosition(textEl, range, selection, true);
                }
              });
              unproperDUppercases.forEach((multipleUppercasesMatch) => {
                if (text && multipleUppercasesMatch) {
                  textEl.value = fixUnproperUppercases(
                    text,
                    multipleUppercasesMatch,
                    "YesDVal"
                  );
                  isUndoUppercase = true;
                  [textEl.value, isCursorAutoMoved] = correctCursorNextWords(
                    isCursorAutoMoved,
                    isUndoUppercase,
                    wrongStartMatch,
                    textEl
                  );
                  if (range.endOffset >= 1)
                    fixCursorPosition(textEl, range, selection, true);
                }
              });
            })();
          }
          //statement para controle de combinação após entrada com inicial D
          if (
            letterMatchesIniD &&
            letterNotMatchesAfterD &&
            !(
              letterMatchesAfterDOp1 ||
              letterMatchesAfterDOp2 ||
              letterMatchesAfterDOp3
            )
          )
            letterNotMatchesAfterD = [];
          //statement para fluxo validando match de iniciais
          if (letterMatchesIniD || letterMatchesIniNotD) {
            //IIFE para forçar upper case
            ((): void => {
              const DMatch = [
                ...(letterMatchesAfterDOp1 || []),
                ...(letterMatchesAfterDOp2 || []),
                ...(letterMatchesAfterDOp3 || []),
              ];

              const wordMatch = [
                ...(DMatch || []),
                ...(letterMatchesIniNotD || []),
              ];

              for (let iM = 0; iM < wordMatch.length; iM++) {
                if (uppercasesRegexObj.test(wordMatch[iM])) continue;
                textEl.value = fixForcedUpperCase(
                  textEl,
                  wordMatch,
                  wordMatch[iM]
                );
                if (DMatch.flat(1).length > 0) {
                  [textEl.value, isCursorAutoMoved] = correctCursorNextWords(
                    isCursorAutoMoved,
                    isUndoUppercase,
                    wrongStartMatch,
                    textEl
                  );
                }
              }
            })();
          }
          //IIFE para fazer correções adicionais no final da edição automática
          ((): void => {
            if (wrongCharsMatchesOp1)
              textEl.value =
                textEl.value?.replaceAll(wrongCharsRegexOp1, "") ?? null;
            if (wrongCharsMatchesOp2)
              textEl.value =
                textEl.value?.replaceAll(wrongCharsRegexOp2, "") ?? null;
            if (wrongCharsMatchesOp3)
              textEl.value =
                textEl.value?.replaceAll(wrongCharsRegexOp3, "") ?? null;
            if (text.match(/\s[\s]+/g))
              textEl.value = textEl.value?.replaceAll(/\s[\s]+/g, " ") ?? null;
            if (text.match(/^[a-záàâäãéèêëíìîïóòôöõúùûü]/))
              textEl.value = text.slice(0, 1).toUpperCase() + text.slice(1);
          })();
        }
      }
    }
    return textEl.value;
  }
  return "";
}
export function capitalizeFirstLetter(text: string): string {
  try {
    if (!(typeof text === "string")) return text;
    text = `${text.slice(0, 1).toUpperCase()}${text.slice(1)}`;
    return text;
  } catch (e) {
    return text;
  }
}
