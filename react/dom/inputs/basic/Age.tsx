"use client";
import IOHandler from "@/lib/client/handlers/IOHandler";
import StyleHandler from "@/lib/client/handlers/StyleHandler";
import { classes } from "@/lib/client/vars";
import { nlInp } from "@/lib/definitions/client/helpers";
import { PseudoNum } from "@/lib/definitions/foundations";
import { limits, patterns } from "@/lib/vars";
import { useState, useEffect, useRef } from "react";
export default function Age() {
  const [v, setV] = useState<PseudoNum | "">(""),
    r = useRef<nlInp>(null),
    id = "age",
    maxLength = 3;
  useEffect(() => {
    if (!r.current) return;
    IOHandler.syncLabel(r.current);
    StyleHandler.alarmBorder(r.current);
  }, [r, v]);
  return (
    <div className={`${classes.inpDivClasses}`}>
      <label className={classes.inpLabClasses} htmlFor={id}>
        Idade
      </label>
      <input
        ref={r}
        placeholder='Escreva ou selecione aqui'
        value={v}
        className={classes.inpClasses}
        name={id}
        id={id}
        minLength={1}
        maxLength={maxLength}
        min={0}
        max={limits.tiny.MAX_UTF16_SIGNED_NOTSURROGATE()}
        pattern={patterns.age}
        required
        type='number'
        data-fixed='true'
        onChange={ev =>
          setV(
            IOHandler.applyNumRules(
              ev.currentTarget.value,
              maxLength,
              limits.tiny.MAX_UTF16_SIGNED_NOTSURROGATE()
            ) as PseudoNum
          )
        }
      />
    </div>
  );
}
