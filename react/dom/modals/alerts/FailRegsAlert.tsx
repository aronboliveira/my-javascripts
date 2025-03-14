import { ErrorBoundary } from "react-error-boundary";
import { FailedRegstProps } from "../../src/lib/global/declarations/interfacesCons";
import { nlDlg } from "../../src/lib/global/declarations/types";
import { syncAriaStates } from "../../src/lib/global/handlers/gHandlers";
import { useEffect, useRef } from "react";
import ErrorFallbackDlg from "../error/ErrorFallbackDlg";
import { isClickOutside } from "../../src/lib/global/gStyleScript";
export default function FailRegstAlert({
  setDisplayFailRegstDlg,
  shouldDisplayFailRegstDlg = false,
  secondOp = "Arraste",
}: FailedRegstProps): JSX.Element {
  const FailRegstDlgRef = useRef<nlDlg>(null);
  const toggleClose = (): void => {
    setDisplayFailRegstDlg(!shouldDisplayFailRegstDlg);
    if (!shouldDisplayFailRegstDlg && FailRegstDlgRef.current instanceof HTMLDialogElement)
      FailRegstDlgRef.current.close();
  };
  useEffect(() => {
    if (shouldDisplayFailRegstDlg && FailRegstDlgRef.current instanceof HTMLDialogElement)
      FailRegstDlgRef.current.showModal();
    syncAriaStates([...FailRegstDlgRef.current!.querySelectorAll("*"), FailRegstDlgRef.current!]);
    const handleKeyDown = (press: KeyboardEvent): void => {
      if (press.key === "Escape") toggleClose();
    };
    addEventListener("keydown", handleKeyDown);
    return (): void => removeEventListener("keydown", handleKeyDown);
  }, [FailRegstDlgRef, toggleClose]);
  return (
    <>
      {shouldDisplayFailRegstDlg && (
        <dialog
          role='alertdialog'
          ref={FailRegstDlgRef}
          className='modal-content modalContent__fit wid80'
          id='alert-dlg'
          onClick={ev => {
            if (isClickOutside(ev, ev.currentTarget).some(coord => coord === true)) {
              ev.currentTarget.close();
              setDisplayFailRegstDlg(!shouldDisplayFailRegstDlg);
            }
          }}>
          <ErrorBoundary
            FallbackComponent={() => (
              <ErrorFallbackDlg renderError={new Error(`Erro carregando a janela modal!`)} onClick={toggleClose} />
            )}>
            <section role='alert' className='flexNoWC flexJtC flexAlItCt rGap2v'>
              <div role='group' className='flexJtC flexAlItCt flexNoWC wsBs noInvert'>
                <h3 className='wsBs'>
                  Falha na procura de um encaixe correspondente na agenda! {`${secondOp} `} ou insira manualmente.
                </h3>
              </div>
              <button className='btn btn-danger bolded' onClick={toggleClose}>
                Fechar
              </button>
            </section>
          </ErrorBoundary>
        </dialog>
      )}
    </>
  );
}
