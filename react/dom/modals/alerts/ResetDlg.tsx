import { ErrorBoundary } from "react-error-boundary";
import { ResetDlgProps } from "../../src/lib/global/declarations/interfacesCons";
import { nlDlg } from "../../src/lib/global/declarations/types";
import { syncAriaStates } from "../../src/lib/global/handlers/gHandlers";
import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import ErrorFallbackDlg from "../error/ErrorFallbackDlg";
import MainFormPanel from "../mainPanel/MainFormPanel";
import { isClickOutside } from "../../src/lib/global/gStyleScript";
export default function ResetDlg({
  root,
  setDisplayResetDlg,
  shouldDisplayResetDlg = true,
}: ResetDlgProps): JSX.Element {
  const ResetDlgRef = useRef<nlDlg>(null),
    resetForm = (): void => {
      document.querySelector("form")!.reset();
      //@ts-ignore
      if (root) ReactDOM.render(<MainFormPanel />, root);
    },
    handleClose = (): void => {
      setDisplayResetDlg(!shouldDisplayResetDlg);
      if (!shouldDisplayResetDlg && ResetDlgRef.current instanceof HTMLDialogElement) ResetDlgRef.current.close();
    };
  useEffect(() => {
    const toggleClose = (): void => {
      setDisplayResetDlg(!shouldDisplayResetDlg);
      if (!shouldDisplayResetDlg && ResetDlgRef.current instanceof HTMLDialogElement) ResetDlgRef.current.close();
    };
    if (shouldDisplayResetDlg && ResetDlgRef.current instanceof HTMLDialogElement) ResetDlgRef.current.showModal();
    syncAriaStates([...ResetDlgRef.current!.querySelectorAll("*"), ResetDlgRef.current!]);
    const handleKeyDown = (press: KeyboardEvent): void => {
      if (press.key === "Escape") toggleClose();
    };
    addEventListener("keydown", handleKeyDown);
    return (): void => removeEventListener("keydown", handleKeyDown);
  }, [ResetDlgRef, setDisplayResetDlg]);
  return (
    <>
      {shouldDisplayResetDlg && (
        <dialog
          role='alertdialog'
          ref={ResetDlgRef}
          className='modal-content modalContent__fit'
          id='reset-dlg'
          onClick={ev => {
            if (isClickOutside(ev, ev.currentTarget).some(coord => coord === true)) {
              ev.currentTarget.close();
              setDisplayResetDlg(!shouldDisplayResetDlg);
            }
          }}>
          <ErrorBoundary
            FallbackComponent={() => (
              <ErrorFallbackDlg renderError={new Error(`Erro carregando a janela modal!`)} onClick={handleClose} />
            )}>
            <section role='alert' className='flexNoW'>
              <button className='btn btn-close forceInvert' onClick={handleClose}></button>
            </section>
            <section role='alert' className='flexNoWC flexJtC flexAlItCt rGap2v'>
              <div role='group' className='flexJtC flexAlItCt flexNoWC wsBs noInvert'>
                <h3 className='bolded'>Confirmar reset?</h3>
                <small role='textbox' className='bolded txaCt'>
                  Esse processo é totalmente irreversível!
                </small>
              </div>
              <button
                className='btn btn-warning bolded'
                onClick={() => {
                  handleClose();
                  resetForm();
                }}>
                Confirmar
              </button>
            </section>
          </ErrorBoundary>
        </dialog>
      )}
    </>
  );
}
