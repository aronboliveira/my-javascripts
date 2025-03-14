import { ErrorBoundary } from "react-error-boundary";
import { ExcludeDlgProps } from "../../src/lib/global/declarations/interfacesCons";
import { handleDelete } from "../../src/lib/global/data-service";
import { isClickOutside } from "../../src/lib/global/gStyleScript";
import { nlDlg, nlFm } from "../../src/lib/global/declarations/types";
import { syncAriaStates } from "../../src/lib/global/handlers/gHandlers";
import { useEffect, useRef } from "react";
import ErrorFallbackDlg from "../error/ErrorFallbackDlg";
import { assignFormAttrs } from "../../src/lib/global/gModel";
export default function ExcludeDlg({
  route,
  setDisplayExcludeDlg,
  shouldDisplayExcludeDlg = true,
}: ExcludeDlgProps): JSX.Element {
  const excludeDlgRef = useRef<nlDlg>(null),
    formRef = useRef<nlFm>(null),
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
    const handleKeyDown = (press: KeyboardEvent): void => {
      press.key === "Escape" && toggleClose();
    };
    addEventListener("keydown", handleKeyDown);
    return (): void => removeEventListener("keydown", handleKeyDown);
  }, [excludeDlgRef, setDisplayExcludeDlg]);
  useEffect(() => {
    assignFormAttrs(formRef.current);
  });
  return (
    <>
      {shouldDisplayExcludeDlg && (
        <dialog
          role='alertdialog'
          id='excludeAlertDlg'
          ref={excludeDlgRef}
          className='modal-content modalContent__fit'
          onClick={click => {
            if (isClickOutside(click, excludeDlgRef.current!).some(point => point === true)) {
              excludeDlgRef.current!.close();
              handleClick();
            }
          }}>
          <ErrorBoundary
            FallbackComponent={() => (
              <ErrorFallbackDlg renderError={new Error(`Erro carregando a janela modal!`)} onClick={handleClick} />
            )}>
            <form
              role='alert'
              name={`form_removal_${route}`}
              className='flexNoWC flexJC rGap2v'
              onSubmit={() => handleDelete(route, true)}>
              <div role='group' className='flexJC flexAlItCt flexNoWC wsBs noInvert'>
                <h3>Confirmar remoção?</h3>
                <small role='textbox'>Esse processo é parcialmente ou totalmente irreversível!</small>
              </div>
              <button type='submit' className='btn btn-warning bolded' onClick={handleClick}>
                Confirmar
              </button>
            </form>
          </ErrorBoundary>
        </dialog>
      )}
    </>
  );
}
