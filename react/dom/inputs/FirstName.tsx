"use client";
import { nlInp } from "@/lib/definitions/client/helpers";
import IOHandler from "@/lib/client/handlers/IOHandler";
import CompabilityValidator from "@/lib/client/validators/CompabilityValidator";
import { classes, flags } from "@/lib/client/vars";
import { useEffect, useRef, useState } from "react";
import StringHelper from "@/lib/helpers/StringHelper";
import StyleHandler from "@/lib/client/handlers/StyleHandler";
export default function FirstName() {
  const r = useRef<nlInp>(null),
    id = "firstName",
    [v, setV] = useState<string>("");
  useEffect(() => {
    if (!(r.current instanceof HTMLInputElement)) return;
    if (!CompabilityValidator.isSafari())
      r.current.autocapitalize = "words";
  }, [r]);
  useEffect(() => {
    if (!r.current) return;
    IOHandler.syncLabel(r.current);
    StyleHandler.alarmBorder(r.current);
  }, [r, v]);
  return (
    <div className={classes.inpDivClasses}>
      <label className={classes.inpLabClasses} htmlFor={id}>
        Primeiro Nome
      </label>
      <input
        ref={r}
        value={v}
        id={id}
        name={StringHelper.camelToSnake(id)}
        required
        autoComplete='given-name'
        // autoFocus
        className={`${classes.inpClasses} name firstName`}
        data-fixed='true'
        onChange={ev => {
          const t = ev.currentTarget;
          flags.isAutoCorrectOn
            ? setV(IOHandler.applyUpperCase(t.value, 1))
            : setV(t.value);
        }}
      />
    </div>
  );
}
