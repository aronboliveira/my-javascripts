"use client";
import IOHandler from "@/lib/client/handlers/IOHandler";
import { classes } from "@/lib/client/vars";
import { nlSel } from "@/lib/definitions/client/helpers";
import { useEffect, useRef } from "react";
export default function Gender() {
  const id = "gender",
    r = useRef<nlSel>(null);
  useEffect(() => IOHandler.syncLabel(r.current), [r]);
  return (
    <div className={`${classes.inpDivClasses}`}>
      <label className={classes.inpLabClasses} htmlFor={id}>
        Gênero
      </label>
      <select
        data-fixed='true'
        ref={r}
        className={classes.selectClasses}
        id={id}
        name={id}
      >
        <option value='feminino'>Feminino</option>
        <option value='masculino'>Masculino</option>
        <option value='nb'>Não-Binário</option>
        <option value='undefined'>Outros</option>
      </select>
    </div>
  );
}
