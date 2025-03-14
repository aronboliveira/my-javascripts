import { changeToAstDigit } from "../../../src/lib/global/handlers/gHandlers";
import { nullishCanvas, rMouseEvent } from "../../../src/lib/global/declarations/types";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { addCanvasListeners, getCanvasCoords } from "../../../src/lib/global/gController";
import { useLocation } from "react-router-dom";
import s from "../../../src/styles/modules/sharedComponents.module.scss";
export default function Signature(): JSX.Element {
  const canvasRef = useRef<nullishCanvas>(null),
    ctxRef = useRef<CanvasRenderingContext2D | null>(null),
    [isDrawing, setDrawing] = useState<boolean>(false),
    location = useLocation(),
    startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void => {
      e.preventDefault();
      setDrawing(true);
      draw(e);
    },
    startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>): void => {
      setDrawing(true);
      drawTouch(e);
    },
    memoizedCoords = useMemo(
      () => (canvas: HTMLCanvasElement, e: React.Touch | Touch | rMouseEvent) => {
        if (!(canvas instanceof HTMLCanvasElement)) return { x: e.clientX, y: e.clientY };
        return getCanvasCoords(e.clientX, e.clientY, canvas);
      },
      [],
    ),
    draw = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void => {
        try {
          const canvas = canvasRef.current;
          if (!(canvas instanceof HTMLCanvasElement)) return;
          const ctx = ctxRef.current ?? canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas context could not be obtained");
          if (!isDrawing) return;
          const { x, y } = memoizedCoords(canvas, e);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y);
        } catch (e) {
          return;
        }
      },
      [isDrawing, canvasRef, memoizedCoords],
    ),
    drawTouch = useCallback(
      (e: React.TouchEvent<HTMLCanvasElement>): void => {
        try {
          const canvas = canvasRef.current;
          if (!(canvas instanceof HTMLCanvasElement)) return;
          const ctx = ctxRef.current ?? canvas.getContext("2d");
          if (!(ctx instanceof CanvasRenderingContext2D))
            throw new Error(`Error getting Canvas Context:\nObtained Value: ${ctx ?? "nullish"}`);
          if (!isDrawing) return;
          const { x, y } = memoizedCoords(canvas, e.touches[0]);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y);
        } catch (e) {
          return;
        }
      },
      [isDrawing, canvasRef, memoizedCoords],
    ),
    stopDrawing = (): void => {
      setDrawing(false);
      ctxRef.current?.beginPath();
    };
  useEffect(() => {
    const equalizeCanvas = (): void => {
      try {
        if (!(canvasRef.current instanceof HTMLCanvasElement)) return;
        canvasRef.current.height = 80;
        const ctx = ctxRef.current ?? canvasRef.current.getContext("2d");
        if (!ctx) return;
        ctx.fillRect(10, canvasRef.current.height - 10, canvasRef.current.width - 20, 1.5);
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#222";
      } catch (e) {
        return;
      }
    };
    equalizeCanvas();
    addEventListener("resize", equalizeCanvas);
    return removeEventListener("resize", equalizeCanvas);
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctxRef.current = ctx;
    }
  }, []);
  return (
    <fieldset className='divSub divConfirm flexEl' id='divConfirm3' role='group'>
      <span role='group' id='spanAstPct' className='labConfirm labAst widHalf bolded'>
        <span>Assinatura do Paciente:</span>
        <canvas
          data-xls='Assinatura de Concordância do Paciente:'
          id='inpAstConfirmId'
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawingTouch}
          onTouchMove={drawTouch}
          onTouchEnd={stopDrawing}
          data-name='signature'></canvas>
        <button
          type='button'
          className={`astDigtBtn autocorrect confirmBtn btn btn-secondary ${
            /edfis/gi.test(location.pathname) ? s.confirmAstDigtBtnEn : ""
          }`}
          id='confirmAstDigtBtn'
          onClick={ev => changeToAstDigit(ev.currentTarget)}>
          Usar Assinatura Digital
        </button>
        <button
          type='button'
          className='btn btn-secondary'
          id='resetAstBtn'
          onClick={ev => {
            try {
              const divConfirm = ev.currentTarget.closest(".divConfirm");
              if (!(divConfirm instanceof HTMLElement)) return;
              const astEl = divConfirm.querySelector("#inpAstConfirmId");
              if (!(astEl instanceof HTMLCanvasElement || astEl instanceof HTMLInputElement)) return;
              if (astEl instanceof HTMLCanvasElement) {
                const replaceCanvas = Object.assign(document.createElement("canvas"), {
                  id: "inpAstConfirmId",
                });
                replaceCanvas.dataset.title = "Assinatura do Paciente";
                astEl.parentElement!.replaceChild(replaceCanvas, astEl);
                addCanvasListeners();
              }
              if (astEl instanceof HTMLInputElement) {
                const replaceInp = Object.assign(
                  Object.assign(document.createElement("input") as HTMLInputElement, {
                    type: "file",
                    id: "inpAstConfirmId",
                    accept: "image/*",
                  }),
                );
                replaceInp.dataset.title = "Assinatura do Paciente";
                replaceInp.classList.add("inpAst", "mg__07t", "form-control");
                astEl.parentElement?.replaceChild(replaceInp, astEl);
              }
            } catch (e2) {
              return;
            }
          }}>
          Resetar
        </button>
      </span>
    </fieldset>
  );
}
