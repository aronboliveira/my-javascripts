"use client";
import { useState, useEffect, useRef } from "react";
import IOHandler from "@/lib/client/handlers/IOHandler";
import {
  nlEl,
  nlInp,
  nlTxtEl,
} from "@/lib/definitions/client/helpers";
import { DDDPattern } from "@/lib/definitions/foundations";
import MathHandler from "@/lib/client/handlers/MathHandler";
import StyleHandler from "@/lib/client/handlers/StyleHandler";
import { TelFragmentOptInput } from "@/lib/definitions/client/interfaces/components";
import { classes } from "@/lib/client/vars";
export default function DDD({
  required,
  id,
}: TelFragmentOptInput) {
  id ||= "ddd";
  const [v, setV] = useState<DDDPattern>("21"),
    r = useRef<nlInp>(null),
    linkedTo = useRef<nlEl>(null);
  useEffect(() => {
    if (!(r.current instanceof HTMLInputElement)) return;
    linkedTo.current =
      r.current
        .closest("telBlock")
        ?.querySelector(".tel") ??
      document.getElementById(
        r.current.id.replace("ddd", "tel")
      );
    if (
      !(
        linkedTo.current instanceof HTMLInputElement ||
        linkedTo.current instanceof HTMLTextAreaElement
      )
    )
      return;
    r.current.dataset.linkedto = linkedTo.current.id;
    IOHandler.syncLabel(r.current);
    /* eslint-disable */
    required && StyleHandler.alarmBorder(r.current);
    /* eslint-enable */
  }, [r, v, required]);
  return (
    <div className={`${classes.inpDivClasses} dddBlock`}>
      <label className={classes.inpLabClasses} htmlFor={id}>
        DDD
      </label>
      <input
        value={v}
        ref={r}
        name={id}
        id={id}
        type='number'
        className={classes.dddClasses}
        autoComplete='tel-area-code'
        pattern='^[0-9]{2,}$'
        required={required}
        min={11}
        max={99}
        minLength={2}
        maxLength={3}
        data-fixed='true'
        onChange={ev => {
          const i = ev.currentTarget;
          setV(prev => {
            const prevNum = MathHandler.parseNotNaN(
                prev,
                11,
                "int"
              ),
              curr = IOHandler.adjustTelDDD(
                i.value,
                MathHandler.parseNotNaN(
                  i.value,
                  11,
                  "int"
                ) > prevNum
              ),
              currNum = MathHandler.parseNotNaN(
                curr,
                11,
                "int"
              );
            if (
              Math.abs(currNum - prevNum) >
              (MathHandler.parseNotNaN(i.step, 1, "int") ||
                1)
            )
              StyleHandler.blurOnChange(i);
            return curr;
          });
        }}
        onInput={ev => {
          IOHandler.moveCursorFocus(
            ev.currentTarget,
            linkedTo.current as nlTxtEl,
            2
          );
        }}
      />
    </div>
  );
}
