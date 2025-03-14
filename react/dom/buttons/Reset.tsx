"use client";
import { classes } from "@/lib/client/vars";
import promptToast from "../bloc/toasts/PromptToast";
import { RefObject } from "react";
import { FormRelated } from "@/lib/definitions/client/interfaces/components";
import useFormButton from "@/lib/client/hooks/useFormButton";
export default function Reset({ form }: FormRelated) {
  const id = "btnReset",
    r = useFormButton({ form, idf: id });
  return (
    <button
      ref={r as RefObject<HTMLButtonElement>}
      type='button'
      id={id}
      className={classes.btnSec}
      onClick={() => {
        promptToast(
          navigator.language.startsWith("pt-")
            ? "Tem certeza que deseja resetar o formulário?"
            : "Are you sure you want to reset the form?",
          navigator.language.startsWith("pt-")
            ? "Escreva Y aqui"
            : "Type Y here"
        ).then(s => s === "Y" && form?.reset());
      }}
    >
      <span>Resetar</span>
    </button>
  );
}
