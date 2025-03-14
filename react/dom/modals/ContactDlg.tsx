import { ContactDlgProps } from "../../src/lib/global/declarations/interfacesCons";
import { isClickOutside } from "../../src/lib/global/gStyleScript";
import { nlBtn, nlDlg } from "../../src/lib/global/declarations/types";
import { useContext, useEffect, useRef } from "react";
import { validateForm, syncAriaStates } from "../../src/lib/global/handlers/gHandlers";
import { createPortal } from "react-dom";
import { RootCtxType } from "../../src/lib/global/declarations/interfaces";
import { RootCtx } from "../../src/App";
export default function ContactDlg({ setContact, shouldDisplayContact = true }: ContactDlgProps): JSX.Element {
  const contactDlgRef = useRef<nlDlg>(null),
    contacBtnRef = useRef<nlBtn>(null),
    divModalSec = useContext<RootCtxType>(RootCtx)?.divModalSec;
  useEffect(() => {
    if (contactDlgRef.current instanceof HTMLDialogElement) {
      contactDlgRef.current.showModal();
      syncAriaStates([...contactDlgRef.current.querySelectorAll("*"), contactDlgRef.current]);
    }
  }, [contactDlgRef]);
  return createPortal(
    <>
      {shouldDisplayContact && (
        <dialog
          ref={contactDlgRef}
          className='modalContent__fit flexAlItCt flexNoWC'
          id='contactDlg'
          onClick={ev => {
            if (isClickOutside(ev, ev.currentTarget).some(coord => coord === true)) {
              setContact(!shouldDisplayContact);
              ev.currentTarget.closest("dialog")?.close();
            }
          }}>
          <div className='flexNoW cGap2v widFull mg__3b'>
            <h3 className='bolded'>Formulário de Contato</h3>
            <button
              className='btn btn-close'
              onClick={() => {
                setContact(!shouldDisplayContact);
                contactDlgRef.current instanceof HTMLDialogElement && contactDlgRef.current?.close();
              }}></button>
          </div>
          <div className='flexNoWC widFull mg__2bv'>
            <label className='bolded' htmlFor='contactOps'>
              Razão de contato
            </label>
            <select id='contactOps' className='form-select'>
              <option value='problema'>Problemas na Aplicação</option>
              <option value='duvida'>Dúvidas sobre o Sistema</option>
              <option value='outro'>Outros</option>
            </select>
          </div>
          <div className='flexNoWC widFull mg__2bv'>
            <label className='bolded' htmlFor='contactObs'>
              Detalhes
            </label>
            <textarea id='contactObs' className='form-control minText' minLength={2}></textarea>
          </div>
          <button
            type='button'
            id='submitContactBtn'
            className='btn btn-info widHalf bolded mg__1t'
            ref={contacBtnRef}
            onClick={ev => {
              validateForm(ev, ev.currentTarget.closest("dialog")!).then(
                validation => validation[0] && setContact(!shouldDisplayContact),
              );
            }}>
            Enviar
          </button>
        </dialog>
      )}
    </>,
    divModalSec?.current ?? document.getElementById("divAddSec") ?? document.body,
  );
}
