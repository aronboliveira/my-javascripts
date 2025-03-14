"use client";
import { classes } from "@/lib/client/vars";
import { useRef, useEffect, useState } from "react";
import CompabilityValidator from "@/lib/client/validators/CompabilityValidator";
import IOHandler from "@/lib/client/handlers/IOHandler";
import { nlInp } from "@/lib/definitions/client/helpers";
import { autoCapitalizeInputs } from "@/lib/client/handlers/AutoCorrectHandler";
import StringHelper from "@/lib/helpers/StringHelper";
import StyleHandler from "@/lib/client/handlers/StyleHandler";
export default function LastName() {
  const r = useRef<nlInp>(null),
    id = "lastName",
    [v, setV] = useState<string>("");
  useEffect(() => {
    if (!(r.current instanceof HTMLInputElement)) return;
    if (!CompabilityValidator.isSafari())
      r.current.autocapitalize = "sentences";
  }, [r]);
  useEffect(() => {
    if (!r.current) return;
    IOHandler.syncLabel(r.current);
    StyleHandler.alarmBorder(r.current);
  }, [r, v]);
  return (
    <div className={classes.inpDivClasses}>
      <label className={classes.inpLabClasses} htmlFor={id}>
        Sobrenome
      </label>
      <input
        ref={r}
        value={v}
        id={id}
        name={StringHelper.camelToSnake(id)}
        required
        data-fixed='true'
        autoComplete='family-name'
        className={`${classes.inpClasses} name autocorrectAll`}
        onChange={ev =>
          ev.currentTarget.value.length === 1
            ? setV(
                IOHandler.applyUpperCase(
                  ev.currentTarget.value,
                  1
                )
              )
            : setV(autoCapitalizeInputs(ev.currentTarget))
        }
      />
    </div>
  );
}
