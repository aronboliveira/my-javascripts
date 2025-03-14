import { ErrorBoundary } from "react-error-boundary";
import { UserPropsDlgProps } from "../../src/lib/global/declarations/interfacesCons";
import { isClickOutside } from "../../src/lib/global/gStyleScript";
import { useEffect, useRef, useState } from "react";
import { validateForm, syncAriaStates } from "../../src/lib/global/handlers/gHandlers";
import GenericErrorComponent from "../error/GenericErrorComponent";
import { nlBtn, nlDlg, nlInp, nlSel } from "../../src/lib/global/declarations/types";
import { addEmailExtension, autoCapitalizeInputs, formatTel } from "../../src/lib/global/gModel";
export default function UserPropsDlg({ setPropDlg, shouldDisplayPropDlg = true }: UserPropsDlgProps): JSX.Element {
  const userPropsDlgRef = useRef<nlDlg>(null),
    userPropsBtnRef = useRef<nlBtn>(null),
    newUserValueRef = useRef<nlInp | HTMLSelectElement>(null),
    userPropsSelRef = useRef<nlSel>(null),
    [, setPropValue] = useState<string>("userName"),
    changeUserProp = (value: string): void => {
      if (!newUserValueRef.current)
        newUserValueRef.current = document.getElementById("userPropsNewValue") as HTMLSelectElement | HTMLInputElement;
      if (
        userPropsSelRef.current instanceof HTMLSelectElement &&
        (newUserValueRef.current instanceof HTMLInputElement || newUserValueRef.current instanceof HTMLSelectElement)
      ) {
        setPropValue(value);
        newUserValueRef.current.value = "";
        const replaceInp = (
          type: string = "text",
          placeholder: boolean = true,
          minText: boolean = true,
        ): HTMLInputElement => {
          const newInp = document.createElement("input") as HTMLInputElement;
          newInp.classList.add(...["form-control"]);
          Object.assign(newInp, {
            id: "userPropsNewValue",
            type: type,
          });
          if (placeholder) newInp.placeholder = "Insira aqui o novo valor";
          if (minText) {
            newInp.classList.add("minText");
            newInp.minLength = 2;
          }
          newUserValueRef.current?.parentElement?.replaceChild(newInp, newUserValueRef.current!);
          newUserValueRef.current = newInp;
          return newInp;
        };
        const replaceSel = (): HTMLSelectElement => {
          const newSel = document.createElement("select");
          newSel.classList.add(...["form-select"]);
          newSel.id = "userPropsNewValue";
          newSel.style.maxWidth = getComputedStyle(newUserValueRef.current!).width;
          newUserValueRef.current?.parentElement?.replaceChild(newSel, newUserValueRef.current!);
          newUserValueRef.current = newSel;
          return newSel;
        };
        switch (userPropsSelRef.current.value) {
          case "userName":
            const newNameInp = replaceInp();
            newNameInp.autocomplete = "given-name";
            newNameInp.autocapitalize = "true";
            newNameInp.addEventListener("input", () => autoCapitalizeInputs(newNameInp));
            break;
          case "userClass":
            const newClassSel = replaceSel(),
              opCoord = document.createElement("option");
            opCoord.value = "coord";
            opCoord.textContent = "Coordenador";
            const opProfExt = document.createElement("option");
            opProfExt.value = "profExt";
            opProfExt.textContent = "Membro Externo";
            const opProfInt = document.createElement("option");
            opProfInt.value = "profInt";
            opProfInt.textContent = "Membro Interno";
            const opStud = document.createElement("option");
            opStud.value = "stud";
            opStud.textContent = "Extensionista / Estudante";
            for (const o of [opCoord, opProfExt, opProfInt, opStud]) newClassSel.append(o);
            break;
          case "userArea":
            const newAreaSel = replaceSel(),
              opEd = document.createElement("option");
            opEd.value = "edFis";
            opEd.textContent = "Educação Física";
            const opNut = document.createElement("option");
            opNut.value = "nutr";
            opNut.textContent = "Nutrição";
            const opOd = document.createElement("option");
            opOd.value = "odonto";
            opOd.textContent = "Odontologia";
            for (const o of [opEd, opNut, opOd]) newAreaSel.append(o);
            break;
          case "userEmail":
            const newEmailInp = replaceInp("email");
            newEmailInp.autocomplete = "email";
            for (const e of ["input", "click"]) newEmailInp.addEventListener(e, () => addEmailExtension(newEmailInp));
            break;
          case "userTel":
            const newTelInp = replaceInp("tel");
            newTelInp.autocomplete = "tel";
            newTelInp.addEventListener("input", () => formatTel(newTelInp));
            break;
          default:
            replaceInp();
        }
      }
    };
  useEffect(() => {
    if (userPropsDlgRef.current instanceof HTMLDialogElement) {
      userPropsDlgRef.current.showModal();
      syncAriaStates([...userPropsDlgRef.current.querySelectorAll("*"), userPropsDlgRef.current]);
      const nameInp = document.getElementById("userPropsNewValue");
      nameInp?.addEventListener("input", () => autoCapitalizeInputs(nameInp));
    }
  }, [userPropsDlgRef]);
  useEffect(() => {}, [newUserValueRef, userPropsDlgRef]);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <GenericErrorComponent message='Erro carregando modal de alteração de dados de usuário!' />
      )}>
      {shouldDisplayPropDlg && (
        <dialog
          ref={userPropsDlgRef}
          className='modalContent__fit flexAlItCt flexNoWC'
          id='alterUsePropDlg'
          onClick={ev => {
            if (isClickOutside(ev, ev.currentTarget).some(coord => coord === true)) {
              setPropDlg(!shouldDisplayPropDlg);
              ev.currentTarget.closest("dialog")?.close();
            }
          }}>
          <fieldset className='flexNoW cGap2v widFull mg__3b'>
            <h3 className='bolded'>Formulário de Alteração</h3>
            <button
              className='btn btn-close'
              onClick={() => {
                setPropDlg(!shouldDisplayPropDlg);
                userPropsDlgRef.current instanceof HTMLDialogElement && userPropsDlgRef.current?.close();
              }}></button>
          </fieldset>
          <fieldset className='flexNoWC widFull mg__2bv'>
            <label className='bolded' htmlFor='userPropsOps'>
              Opções de Alteração:
            </label>
            <select
              id='userPropsOps'
              className='form-select'
              onChange={() => changeUserProp(newUserValueRef.current!.value)}
              ref={userPropsSelRef}>
              <option value='userName'>Nome</option>
              <option value='userClass'>Classe</option>
              <option value='userArea'>Área</option>
              <option value='userEmail'>E-mail</option>
              <option value='userTel'>Telefone</option>
            </select>
          </fieldset>
          <fieldset className='flexNoWC widFull mg__2bv'>
            <label className='bolded' htmlFor='userPropsNewValue'>
              Novo valor:
            </label>
            <input
              type='text'
              id='userPropsNewValue'
              className='form-control minText'
              placeholder='Insira aqui o novo valor'
              autoComplete='given-name'
              autoCapitalize='true'
              minLength={2}
              // @ts-ignore
              ref={newUserValueRef}></input>
          </fieldset>
          <fieldset className='flexNoWC widFull mg__2bv'>
            <label className='bolded' htmlFor='userPropJust'>
              Razão:
            </label>
            <input
              type='text'
              id='userPropJust'
              className='form-control minText'
              minLength={2}
              placeholder='Insira aqui a justificativa'></input>
          </fieldset>
          <button
            type='button'
            id='submitNewPropBtn'
            className='btn btn-info widHalf bolded mg__1t'
            ref={userPropsBtnRef}
            onClick={ev => {
              validateForm(ev, ev.currentTarget.closest("dialog")!).then(
                validation => validation[0] && setPropDlg(!shouldDisplayPropDlg),
              );
            }}>
            Enviar
          </button>
        </dialog>
      )}
    </ErrorBoundary>
  );
}
