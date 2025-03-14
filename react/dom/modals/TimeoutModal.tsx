import { ErrorBoundary } from "react-error-boundary";
import GenericErrorComponent from "../bloc/errors/Error";
import { DlgProps } from "@/lib/definitions/client/interfaces/components";
import useDialog from "@/lib/client/hooks/useDialog";
import s from "@/styles/modules/dialog.module.scss";
export default function TimeoutModal({ dispatch, state = true }: DlgProps) {
  const id = "recoverAlert",
    { mainRef } = useDialog({ dispatch, state, id, param: "timeout" });
  return (
    <>
      {state && (
        <dialog
          role='alertdialog'
          ref={mainRef}
          className={`${s.modalContent} ${s.modalContent__fit}`}
          style={{ width: "80%" }}
          id={id}
        >
          <ErrorBoundary
            FallbackComponent={() => (
              <GenericErrorComponent message='Erro renderizando janela modal' />
            )}
          >
            <section
              role='alert'
              className='flexNoWC flexAlItCt rGap2v'
              style={{ color: "black" }}
            >
              <div role='group' className={`flexNoWC flexAlItCt wsBs`}>
                <p className={`${s.modalHeader}`}>
                  <b>Tempo para preenchimento esgotado ⏳</b>
                </p>
                <p>
                  O tempo para preencher o formulário foi esgotado. Recarregue a
                  página para reiniciar.
                </p>
              </div>
              <div className={`${s.modalFooter}`}>
                <button
                  className='btn btn-info bold'
                  onClick={() => (location.href = location.origin)}
                >
                  Recarregar
                </button>
              </div>
            </section>
          </ErrorBoundary>
        </dialog>
      )}
    </>
  );
}
