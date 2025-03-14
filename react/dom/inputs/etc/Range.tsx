"use client";
import { classes, colors } from "@/lib/client/vars";
import { RangeInputBlock } from "@/lib/definitions/client/interfaces/components";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import s from "@/styles/modules/range.module.scss";
import { nlHtEl, nlInp } from "@/lib/definitions/client/helpers";
import IOHandler from "@/lib/client/handlers/IOHandler";
import StyleHandler from "@/lib/client/handlers/StyleHandler";
import MathHandler from "@/lib/client/handlers/MathHandler";
import StyleValidator from "@/lib/client/validators/StyleValidator";
import {
  complexityLabel,
  complexityLevel,
} from "@/lib/definitions/foundations";
import { JSX } from "react/jsx-runtime";
import DOMValidator from "@/lib/client/validators/DOMValidator";
export const Range = memo((props: RangeInputBlock): JSX.Element => {
  const min = 0,
    max = 100,
    modulator = 20,
    r = useRef<nlInp>(null),
    query = `.fsRanged[data-controlledby="${props.id}"]`,
    coloringStylesheet = useRef<CSSStyleSheet | undefined>(undefined),
    relatedAdd = useRef<nlHtEl>(null),
    prevLevel = useRef<complexityLabel>("beginner"),
    level = useRef<complexityLabel>("beginner"),
    handleTrackSlideColor = (val: number): string => {
      switch (val) {
        case 1:
          return colors.orangeRed;
        case 2:
          return colors.orangeBasic;
        case 3:
          return colors.yellowGold;
        case 4:
          return colors.greenMid;
        case 5:
          return colors.turquoise;
        default:
          return colors.grey;
      }
    },
    handleRelUpdate = useCallback(() => {
      relatedAdd.current = document.querySelector(query);
      if (!relatedAdd.current) return;
      const l = relatedAdd.current.dataset.level;
      if (!l) return;
      const prev = level.current;
      level.current = ["beginner", "intermediate", "expert"].includes(l)
        ? (l as complexityLabel)
        : "beginner";
      if (level.current !== prev)
        StyleHandler.tickFading(relatedAdd.current, "0.1");
    }, [relatedAdd, level]),
    handleCtxComponent = useCallback(
      (lvl: complexityLevel, controller: string): JSX.Element => {
        switch (props.id) {
          case "1":
            return <></>;
          case "2":
            return <></>;
          case "3":
            return <></>;
          case "4":
            return <></>;
          case "5":
            return <></>;
          case "6s":
            return <></>;
          case "7":
            return <></>;
          case "8":
            return <></>;
          case "9":
            return <></>;
          default:
            return <></>;
        }
      },
      [props.id]
    ),
    handleSlide = useCallback(
      (el: EventTarget | null, setValue: boolean = true): void => {
        {
          if (!(el instanceof HTMLInputElement)) return;
          el.dataset.observeable = "false";
          if (el.disabled || el.readOnly) return;
          IOHandler.handleRangeSlide(el, modulator, setValue);
          if (!coloringStylesheet.current)
            coloringStylesheet.current =
              StyleHandler.findStyleSheet(/bootstrap@/g);
          if (!coloringStylesheet.current) return;
          const pseudoElement = StyleHandler.defineRangeThumbPseudoElement();
          if (!pseudoElement) return;
          const i = StyleHandler.findCssRule(
            coloringStylesheet.current,
            new RegExp(pseudoElement)
          );
          if (i === -1) return;
          const rule = coloringStylesheet.current.cssRules[i].cssText;
          if (!rule.match("scale") && rule.match(":focus")) {
            StyleHandler.replaceCssRule(
              coloringStylesheet.current,
              i,
              `transform: scale(1.2)`,
              true
            );
            coloringStylesheet.current.insertRule(
              `.form-range.${s.range}:not(:focus)${pseudoElement} { transform: scale(1); }`
            );
          }
          const curr = MathHandler.parseNotNaN(el.value, 0, "int"),
            pseudos = StyleValidator.scanPseudoSelectorTag();
          if (!pseudos) return;
          let val = (curr - (curr % modulator)) * 0.05;
          const bgColor = handleTrackSlideColor(
              (val !== 0 && val !== 5) || (curr <= 0 && curr >= 20)
                ? val + 1
                : val
            ),
            idf = el.id;
          setTimeout(() => {
            const el = document.getElementById(idf);
            if (!(el instanceof HTMLInputElement)) return;
            const update = (color: keyof typeof colors, v: string) => {
              StyleHandler.updatePseudos({
                idf: `.form-range#${idf}`,
                pseudo: pseudoElement,
                prop: "background-color",
                value: colors[color],
              });
              handleRelUpdate();
              setTimeout(() => {
                let value = Math.round(MathHandler.parseNotNaN(v));
                value = (value - (value % modulator)) * 0.05;
                if (value < 0) value = 0;
                if (value > 5) value = 5;
                setCtxFs(value as complexityLevel);
                setTimeout(() => {
                  const el = document.getElementById(idf);
                  if (!(el instanceof HTMLElement)) return;
                  el.dataset.observeable = "true";
                }, 500);
              }, 500);
            };
            switch (el.value) {
              case "20":
                update("orangeRed", el.value);
                break;
              case "40":
                update("orangeBasic", el.value);
                break;
              case "60":
                update("yellowGold", el.value);
                break;
              case "80":
                update("greenMid", el.value);
                break;
              case "100":
                update("turquoise", el.value);
                break;
              default:
                const parsed = MathHandler.parseNotNaN(el.value, 0, "int");
                /* eslint-disable */
                parsed > 50
                  ? update("greenMid", el.value)
                  : parsed > 20
                  ? update("orangeBasic", el.value)
                  : update("grey", el.value);
              /* eslint-enable */
            }
          }, 200);
          StyleHandler.updatePseudos({
            idf: `.form-range#${el.id}`,
            pseudo: pseudoElement,
            prop: "background-color",
            value: bgColor,
          });
        }
      },
      [coloringStylesheet, handleTrackSlideColor, handleRelUpdate]
    ),
    [ctxLevel, setCtxFs] = useState<complexityLevel | 0>(0);
  useEffect(() => {
    if (
      !(r.current instanceof HTMLInputElement) ||
      (r.current instanceof HTMLElement &&
        r.current.dataset.slideable === "true")
    )
      return;
    r.current.value = "0";
    r.current.addEventListener("change", (ev) => handleSlide(ev.currentTarget));
    r.current.dataset.slideable = "true";
  }, [r]);
  useEffect(() => {
    if (!r.current) return;
    handleRelUpdate();
  }, [r]);
  useEffect(() => {
    if (!r.current || (r.current && r.current.dataset.observed === "true"))
      return;
    const idf = r.current.id;
    setInterval(() => {
      const e = document.getElementById(idf);
      if (
        !(e && DOMValidator.isDefaultEntry(e)) ||
        (e && e.dataset.observeable === "false")
      )
        return;
      if (e.dataset.delayed === "true") {
        e.dispatchEvent(
          new Event("change", {
            bubbles: false,
            cancelable: true,
          })
        );
        handleSlide(e, false);
        e.dataset.delayresolved = "true";
        e.removeAttribute("data-delayed");
      }
    }, 500);
    r.current.dataset.observed === "true";
  }, [r]);
  useEffect(() => {
    if (relatedAdd.current && level.current !== prevLevel.current) {
      relatedAdd.current = document.querySelector(query);
      if (!(relatedAdd.current instanceof HTMLElement)) return;
      relatedAdd.current.style.opacity = "0";
      setTimeout(() => {
        StyleHandler.tickFading(relatedAdd.current, "0.025");
      }, 250);
    }
    prevLevel.current = level.current;
  }, [level.current]);
  return (
    <fieldset className={`${classes.inpDivClasses} ${s.divRange}`}>
      <label
        className={`${classes.inpLabClasses} labelRange`}
        htmlFor={props.id}
      >
        {props.label}
      </label>
      <div>
        <span className={`${s.rangeNumRef} ${s.rangeMin}`}>{min}</span>
        <input
          ref={r}
          type="range"
          data-fixed="true"
          min={min}
          max={max}
          data-slideable="false"
          data-sliding="false"
          data-observed="false"
          data-observeable="true"
          className={`form-range ${s.range}`}
          id={props.id}
        />
        <span className={`${s.rangeNumRef} ${s.rangeMax}`}>
          {Math.round(
            Number.isFinite(max / modulator) ? max / modulator : max * 0.05
          )}
        </span>
      </div>
      {ctxLevel >= 1 &&
        handleCtxComponent(ctxLevel as complexityLevel, props.id)}
    </fieldset>
  );
});
export default Range;
