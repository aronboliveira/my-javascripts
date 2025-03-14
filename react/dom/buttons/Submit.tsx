"use client";
import DOMHandler from "@/lib/client/handlers/DOMHandler";
import SubmissionHandler from "@/lib/client/handlers/SubmissionHandler";
import useFormButton from "@/lib/client/hooks/useFormButton";
import { classes, flags } from "@/lib/client/vars";
import { FormRelated } from "@/lib/definitions/client/interfaces/components";
import { useRouter } from "next/navigation";
import { RefObject, useCallback, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { disableableElement, nlFm } from "@/lib/definitions/client/helpers";
import promptToast from "../bloc/toasts/PromptToast";
import DOMValidator from "@/lib/client/validators/DOMValidator";
import Spinner from "../bloc/transicional/Spinner";
export default function Submit({ form }: FormRelated) {
  const id = "btnSubmit",
    r = useFormButton({ form, idf: id }),
    [isTransitioning, setTransition] = useState<boolean>(false),
    router = useRouter(),
    cpt = "isWaitingCaptcha",
    check = async (): Promise<boolean> => {
      const msg = await promptToast(
        "Escreva CONFIRMAR para finalizar",
        "Escreva aqui"
      );
      return /confirm/gi.test(msg);
    },
    loopChanged = (changed: string[]): void => {
      for (const idf of changed) {
        const e = DOMHandler.queryByUniqueName(idf);
        if (!e) continue;
        if (DOMValidator.isDefaultDisableable(e)) e.disabled = false;
        else e.dataset.disabled = "false";
      }
      /* eslint-disable */
      sessionStorage.getItem(cpt) && sessionStorage.removeItem(cpt);
      /* eslint-enable */
    },
    handleClick = useCallback(
      (el: disableableElement): void => {
        const tId = toast.success(
          flags.pt
            ? "Submissão validada. Esperando resposta..."
            : "Successfuly validated. Waiting for response..."
        );
        setTimeout(() => toast.dismiss(tId), 750);
        if (!el || !el.isConnected)
          el = document.getElementById(id) as HTMLButtonElement;
        if (!el) return;
        const form = el.form ?? el.closest("form");
        if (!form) return;
        SubmissionHandler.construct(form)
          /* eslint-disable */
          .submit("sendRequirements")
          /* eslint-enable */
          .then(({ ok, cause }) => {
            !ok
              ? (() => {
                  const isHttp = sessionStorage.getItem("isHttp");
                  if (!isHttp) {
                    toast.dismiss();
                    toast.error(
                      flags.pt ? `Erro: ${cause}` : `Error: ${cause}`
                    );
                  } else sessionStorage.removeItem("isHttp");
                })()
              : (() => {
                  toast.success(
                    flags.pt
                      ? "O formulário foi validado e submetido. Por favor, aguarde..."
                      : "The form was validated and submitted. Please wait..."
                  );
                  setTimeout(() => {
                    router.push("/success", {
                      scroll: true,
                    });
                    setTransition(false);
                  }, 2000);
                  setTransition(true);
                  setTimeout(router.back, 5000);
                })();
          });
      },
      [form]
    ),
    handleRes = useCallback(
      (res: boolean, el: disableableElement, changed: string[]): void => {
        res
          ? handleClick(el)
          : toast(flags.pt ? `CAPTCHA falhou` : `CAPTCHA failed`, {
              icon: "📑",
            });
        return loopChanged(changed);
      },
      [flags.pt, handleClick]
    ),
    currentForm = useRef<nlFm>(null),
    handleDisable = useCallback(
      (changed: string[]): void => {
        if (!form?.isConnected) {
          if (!r.current) {
            r.current = document.getElementById(id) as HTMLButtonElement;
            if (!r.current) return;
          }
          currentForm.current = r.current.form ?? r.current.closest("form");
        }
        if (!form?.isConnected) return;
        for (const e of form.elements) {
          const idf = DOMHandler.getIdentifier(e);
          if (!DOMValidator.isDefaultDisableable(e)) continue;
          if (!idf || (idf && !e.disabled)) {
            e.disabled = true;
            idf && changed.push(idf);
          }
        }
        for (const e of form.querySelectorAll(".customRole")) {
          const idf = DOMHandler.getIdentifier(e);
          if (!DOMValidator.isCustomDisableable(e)) continue;
          if (!idf || (idf && !e.dataset.disabled)) {
            e.dataset.disabled = "true";
            idf && changed.push(idf);
          }
        }
      },
      [form]
    );
  return (
    <>
      {isTransitioning && <Spinner fs={true} />}
      <button
        ref={r as RefObject<HTMLButtonElement>}
        type='button'
        id={id}
        className={classes.btnPrim}
        style={{
          background:
            "radial-gradient(circle at bottom left, #0278ff, #619df7)",
        }}
        onMouseEnter={() => router.prefetch("/success")}
        onClick={ev => {
          const [res, suspicious] = new DOMHandler(ev).evaluateClickMovements();
          if (suspicious) {
            toast.error(res);
            return;
          }
          const el = ev.currentTarget,
            changed: string[] = [];
          sessionStorage.setItem(cpt, "true");
          handleDisable(changed);
          check().then(res => handleRes(res, el, changed));
          setTimeout(
            () => sessionStorage.getItem(cpt) && loopChanged(changed),
            3000
          );
        }}
      >
        <span>Enviar</span>
      </button>
    </>
  );
}
