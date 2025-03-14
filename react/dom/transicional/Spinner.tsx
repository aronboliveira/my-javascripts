"use client";
import { ErrorBoundary } from "react-error-boundary";
import { useRef, useEffect } from "react";
import { nlDiv } from "@/lib/definitions/client/helpers";
import GenericErrorComponent from "../errors/Error";
import { SpinnerComponentProps } from "@/lib/definitions/client/interfaces/components";
import { createPortal } from "react-dom";
export default function Spinner({
  spinnerClass = "spinner-border",
  spinnerColor = "text-info",
  message = "Loading...",
  fs = false,
  style = {},
}: SpinnerComponentProps & {
  style?: CSSStyleDeclaration | {};
}) {
  useEffect(() => {
    for (const f of document.forms) f.style.filter = "blur(2px)";
  }, []);
  const spinner = useRef<nlDiv>(null);
  useEffect(() => {
    try {
      const handleResize = (): void => {
        if (!spinner.current) return;
        if (innerWidth > 1100) spinner.current.style.left = "37.5%";
        else if (innerWidth > 530) spinner.current.style.left = "33%";
        else spinner.current.style.left = "17.5%";
      };
      handleResize();
      addEventListener("resize", handleResize);
      (): void => removeEventListener("resize", handleResize);
    } catch (e) {
      return;
    }
  }, []);
  return createPortal(
    <ErrorBoundary
      FallbackComponent={() => (
        <GenericErrorComponent message='Error loading Spinner' />
      )}
    >
      <div
        ref={spinner}
        className={`${spinnerClass} ${spinnerColor} spinner`}
        role='status'
        style={
          fs
            ? {
                ...(style as any),
                bottom: "30%",
                left: "17.5%",
                right: "10%",
                minHeight: "15rem",
                minWidth: "15rem",
                maxHeight: "20rem",
                maxWidth: "20rem",
                width: "35vw",
                height: "35vw",
                background: "transparent",
                position: "fixed",
                borderWidth: "0.5vw 1vw 1vw 1vw",
                borderRight: "0.8vw",
                borderRightStyle: "solid",
                borderTop: "0.5vw dotted #a6cad5",
                zIndex: 1,
                animationTimingFunction: "cubic-bezier(0.1, 0.05, 0, 1)",
                animationDuration: "1.2s",
                cursor: "wait",
              }
            : {
                ...style,
                cursor: "wait",
                backfaceVisibility: "hidden",
              }
        }
      >
        <span className='visually-hidden'>{`${message}`}</span>
      </div>
    </ErrorBoundary>,
    Array.from(document.querySelectorAll(".divModal")).filter(
      e => !e.hasChildNodes()
    )[0]
  );
}
