import { nlBtn, nlDlg } from "../../src/lib/global/declarations/types";
import { isClickOutside } from "../../src/lib/global/gStyleScript";
import { elementNotFound, extLine } from "../../src/lib/global/handlers/errorHandler";
import { syncAriaStates } from "../../src/lib/global/handlers/gHandlers";
import { ExcludeConsDlgProps } from "../../src/lib/global/declarations/interfacesCons";
import { addEraseEvent } from "../../src/lib/locals/panelPage/handlers/consHandlerCmn";
import { useContext, useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackDlg from "../error/ErrorFallbackDlg";
import { PanelCtx } from "../panelForms/defs/client/SelectLoader";
export default function ExcludeConsDlg({
  setDisplayExcludeDlg,
  shouldDisplayExcludeDlg = true,
  btn,
}: ExcludeConsDlgProps): JSX.Element {
  const userClass = useContext(PanelCtx).userClass,
    excludeDlgRef = useRef<nlDlg>(null),
    confirmRef = useRef<nlBtn>(null),
    handleClick = (): void => {
      setDisplayExcludeDlg(!shouldDisplayExcludeDlg);
      if (!shouldDisplayExcludeDlg && excludeDlgRef.current instanceof HTMLDialogElement) excludeDlgRef.current.close();
    };
  useEffect(() => {
    const toggleClose = (): void => {
      setDisplayExcludeDlg(!shouldDisplayExcludeDlg);
      if (!shouldDisplayExcludeDlg && excludeDlgRef.current instanceof HTMLDialogElement) excludeDlgRef.current.close();
    };
    if (shouldDisplayExcludeDlg && excludeDlgRef.current instanceof HTMLDialogElement)
      excludeDlgRef.current.showModal();
    syncAriaStates([...excludeDlgRef.current!.querySelectorAll("*"), excludeDlgRef.current!]);
    excludeDlgRef.current!.addEventListener(
      "click",
      click => {
        if (isClickOutside(click, excludeDlgRef.current!).some(point => point === true)) {
          excludeDlgRef.current!.close();
          toggleClose();
        }
      },
      true,
    );
    const handleKeyDown = (press: KeyboardEvent): void => {
      if (press.key === "Escape") toggleClose();
    };
    addEventListener("keydown", handleKeyDown);
    return (): void => removeEventListener("keydown", handleKeyDown);
  }, [excludeDlgRef, setDisplayExcludeDlg]);
  useEffect(() => {
    try {
      if (!(confirmRef.current instanceof HTMLButtonElement))
        throw elementNotFound(
          confirmRef.current,
          `Button for confirming exclusion related to ${btn?.id ?? "UNIDENTIFIED"}`,
          extLine(new Error()),
        );
      (userClass === "coordenador" || userClass === "supervisor") && addEraseEvent(btn!, userClass);
    } catch (err) {
      return;
    }
  }, [confirmRef, btn, userClass]);
  return (
    <>
      {shouldDisplayExcludeDlg && (
        <dialog
          role='alertdialog'
          ref={excludeDlgRef}
          className='modal-content modalContent__fit'
          id='exclude-cons-dlg'
          onClick={ev => {
            if (isClickOutside(ev, ev.currentTarget).some(coord => coord === true)) {
              ev.currentTarget.close();
              setDisplayExcludeDlg(!shouldDisplayExcludeDlg);
            }
          }}>
          <ErrorBoundary
            FallbackComponent={() => (
              <ErrorFallbackDlg renderError={new Error(`Erro carregando a janela modal!`)} onClick={handleClick} />
            )}>
            <section role='alert' className='flexNoWC flexJC rGap2v'>
              <div role='group' className='flexJC flexAlItCt flexNoWC wsBs noInvert'>
                <h3>Confirmar remoção?</h3>
                <small role='textbox'>Esse processo é parcialmente ou totalmente irreversível!</small>
              </div>
              <button className='btn btn-warning bolded' onClick={handleClick} ref={confirmRef}>
                Confirmar
              </button>
            </section>
          </ErrorBoundary>
        </dialog>
      )}
    </>
  );
}
