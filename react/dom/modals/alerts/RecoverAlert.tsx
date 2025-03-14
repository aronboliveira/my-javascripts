import { ErrorBoundary } from "react-error-boundary";
import { nlDlg } from "../../src/lib/global/declarations/types";
import { syncAriaStates } from "../../src/lib/global/handlers/gHandlers";
import { useEffect, useRef } from "react";
import ErrorFallbackDlg from "../error/ErrorFallbackDlg";
import { DlgProps } from "../../src/lib/global/declarations/interfaces";
import { isClickOutside } from "../../src/lib/global/gStyleScript";
export default function RecoverAlert({ dispatch, state = true }: DlgProps): JSX.Element {
  const FailRegstDlgRef = useRef<nlDlg>(null);
  const toggleClose = (): void => {
    dispatch(!state);
    if (!state && FailRegstDlgRef.current instanceof HTMLDialogElement) FailRegstDlgRef.current.close();
  };
  useEffect(() => {
    if (state && FailRegstDlgRef.current instanceof HTMLDialogElement) FailRegstDlgRef.current.showModal();
    syncAriaStates([...FailRegstDlgRef.current!.querySelectorAll("*"), FailRegstDlgRef.current!]);
    const handleKeyDown = (press: KeyboardEvent): void => {
      if (press.key === "Escape") toggleClose();
    };
    addEventListener("keydown", handleKeyDown);
    return (): void => removeEventListener("keydown", handleKeyDown);
  }, [FailRegstDlgRef, toggleClose]);
  return (
    <>
      {state && (
        <dialog
          role='alertdialog'
          ref={FailRegstDlgRef}
          className='modal-content modalContent__fit wid80'
          id='recover-alert'
          onClick={ev => {
            if (isClickOutside(ev, ev.currentTarget).some(coord => coord === true)) {
              ev.currentTarget.close();
              dispatch(!state);
            }
          }}>
          <ErrorBoundary
            FallbackComponent={() => (
              <ErrorFallbackDlg renderError={new Error(`Erro carregando a janela modal!`)} onClick={toggleClose} />
            )}>
            <section role='alert' className='flexNoWC flexJtC flexAlItCt rGap2v'>
              <div role='group' className='flexJtC flexAlItCt flexNoWC wsBs noInvert'>
                <p>
                  <b>Solicitação enviada!</b>
                </p>
                <p>Verifique a caixa de entrada do seu e-mail para os próximos passos.</p>
              </div>
              <button className='btn btn-secondary bolded' onClick={toggleClose}>
                Fechar
              </button>
            </section>
          </ErrorBoundary>
        </dialog>
      )}
    </>
  );
}
