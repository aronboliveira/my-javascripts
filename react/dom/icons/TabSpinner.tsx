import { ErrorBoundary } from "react-error-boundary";
import { SpinnerComponentProps } from "../../src/lib/global/declarations/interfaces";
import GenericErrorComponent from "../error/GenericErrorComponent";
import { useRef, useEffect } from "react";
import { nlDiv } from "../../src/lib/global/declarations/types";
export default function TabSpinner({
  spinnerClass = "spinner-border",
  spinnerColor = "text-info",
  message = "Loading...",
  fs = false,
}: SpinnerComponentProps): JSX.Element {
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
  return (
    <ErrorBoundary FallbackComponent={() => <GenericErrorComponent message='Error loading Spinner' />}>
      <tr>
        <td>
          <div
            ref={spinner}
            className={`${spinnerClass} ${spinnerColor} spinner`}
            role='status'
            style={
              fs
                ? {
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
                : { cursor: "wait", backfaceVisibility: "hidden" }
            }>
            <span className='visually-hidden'>{`${message}`}</span>
          </div>
        </td>
      </tr>
    </ErrorBoundary>
  );
}
