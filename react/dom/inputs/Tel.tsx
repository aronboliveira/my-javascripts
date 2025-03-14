"use client";
import IOHandler from "@/lib/client/handlers/IOHandler";
import StyleHandler from "@/lib/client/handlers/StyleHandler";
import { classes, flags } from "@/lib/client/vars";
import { ITelInput } from "@/lib/definitions/client/interfaces/components";
import { nlInp } from "@/lib/definitions/client/helpers";
import { ValidPhonePattern } from "@/lib/definitions/foundations";
import { useEffect, useState, useRef } from "react";
export default function Tel({
  required = false,
  type = "complete",
  label = "Telefone",
  id,
}: ITelInput) {
  const [v, setV] = useState<ValidPhonePattern | "">(""),
    r = useRef<nlInp>(null);
  id ||= "tel";
  useEffect(() => {
    const i = r.current;
    if (!(i instanceof HTMLInputElement)) return;
    const val = i.value;
    if (val.endsWith("-") || val.endsWith(" ")) {
      StyleHandler.blurOnChange(i);
      i.style;
    }
    if (!r.current) return;
    IOHandler.syncLabel(r.current);
    required && StyleHandler.alarmBorder(r.current);
  }, [v, r]);
  return (
    <div
      className={`${classes.inpDivClasses} telMainBlock`}
    >
      <label className={classes.inpLabClasses} htmlFor={id}>
        {label}
      </label>
      <input
        value={v}
        ref={r}
        type='tel'
        name={id}
        id={id}
        data-fixed='true'
        autoComplete={(() => {
          switch (type) {
            case "national":
              return "tel-national";
            case "local":
              return "tel-local";
            default:
              return "tel";
          }
        })()}
        required={required ? true : false}
        className={classes.inpClasses}
        onChange={ev => {
          const t = ev.currentTarget;
          setV(prev => {
            if (!flags.isAutoCorrectOn)
              return t.value as ValidPhonePattern;
            const curr = IOHandler.applyTelExtension(
              t.value,
              type
            ) as ValidPhonePattern;
            return curr === prev && curr.endsWith("-")
              ? (curr.slice(0, -1) as ValidPhonePattern)
              : curr;
          });
        }}
      />
    </div>
  );
}
