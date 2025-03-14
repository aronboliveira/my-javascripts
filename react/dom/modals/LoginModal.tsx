import { useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { DlgProps } from "../../lib/declarations/interfaces";
import { nullishDlg } from "../../lib/declarations/types";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import {
  adjustIdentifiers,
  isClickOutside,
  syncAriaStates,
} from "../../lib/handlers/handlersCmn";
import { htmlElementNotFound } from "../../lib/handlers/handlersErrors";
import { basePath } from "../../gVariables";
import LoginForm from "../forms/LoginForm";
import "./loginModalStyle.scss";

export default function LoginModal({ dispatch, state }: DlgProps): JSX.Element {
  const dlgRef = useRef<nullishDlg>(null);
  useEffect(() => {
    const handleKeyPress = (press: KeyboardEvent) => {
      if (press.key === "Escape") {
        dispatch && dispatch(!state);
        if (dlgRef.current)
          state ? dlgRef.current.showModal() : dlgRef.current.close();
      }
    };
    try {
      if (!(dlgRef.current instanceof HTMLDialogElement))
        throw htmlElementNotFound(
          dlgRef.current,
          `validation of ${LoginModal.prototype.constructor.name} Main Reference`,
          ["HTMLDialogElement"],
        );
      dlgRef.current.showModal();
      addEventListener("keydown", press => handleKeyPress(press));
    } catch (e) {
      console.error(
        `Error executing useEffect for ${
          LoginModal.prototype.constructor.name
        }:${(e as Error).message}`,
      );
    }
    return () => removeEventListener("keydown", handleKeyPress);
  }, [dlgRef, dispatch, state]);
  useEffect(() => {
    const activeQuery = /\?q=/g.test(location.href)
      ? `${location.href.slice(location.href.indexOf("?q="))}`
      : "";
    try {
      if (!(dlgRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          dlgRef.current,
          `validation of ${LoginModal.prototype.constructor.name} Main Reference`,
          ["HTMLDialogElement"],
        );
      adjustIdentifiers(dlgRef.current);
      syncAriaStates(dlgRef.current);
      history.pushState({}, "", `${basePath}${activeQuery}#login`);
    } catch (e) {
      console.error(
        `Error executing useEffect for ${
          LoginModal.prototype.constructor.name
        }:${(e as Error).message}`,
      );
    }
    return () => history.pushState({}, "", `${basePath}${activeQuery}`);
  }, [dlgRef, dispatch, state]);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message='Erro carregando modal de login!' />
      )}>
      {state && (
        <dialog
          className='modal-content'
          id='loginModalDlg'
          ref={dlgRef}
          onClick={click => {
            if (
              isClickOutside(click, dlgRef.current!).some(
                coord => coord === true,
              )
            ) {
              dispatch && dispatch(!state);
              if (dlgRef.current)
                state ? dlgRef.current.showModal() : dlgRef.current.close();
            }
          }}>
          <section className='flNoW' aria-hidden='false' id='loginHeader'>
            <h2
              className='loginHeading'
              aria-hidden='false'
              id='loginHeadingMain'>
              <span aria-hidden='false'>Login</span>
            </h2>
            <button
              className='fade-in-mid btn btn-close'
              aria-hidden='false'
              onClick={() => {
                dispatch && dispatch(!state);
                if (dlgRef.current)
                  state ? dlgRef.current.showModal() : dlgRef.current.close();
              }}></button>
          </section>
          <section id='login-body'>
            <LoginForm />
          </section>
        </dialog>
      )}
    </ErrorBoundary>
  );
}
