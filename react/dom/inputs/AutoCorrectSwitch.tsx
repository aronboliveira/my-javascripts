"use client";
import { flags } from "@/lib/client/vars";
import { nlInp } from "@/lib/definitions/client/helpers";
import { useState, useRef, useEffect } from "react";
export default function AutoCorrectSwitch() {
  const [on, setOn] = useState<boolean>(true),
    r = useRef<nlInp>(null);
  useEffect(() => {
    if (!r.current) {
      flags.isAutoCorrectOn = false;
      return;
    }
    flags.isAutoCorrectOn = r.current.checked;
  }, [r, on]);
  return (
    <label
      role='group'
      htmlFor='autoFillBtn'
      className='form-switch spanLeft'
      id='autofillDiv'
      style={{
        height: "2rem",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        marginTop: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <input
        ref={r}
        checked={on}
        type='checkbox'
        className={`deActBtn form-check-input`}
        role='switch'
        id={`autoFillBtn`}
        data-title='Cálculo automático'
        onChange={ev => setOn(ev.currentTarget.checked)}
      />
      <strong>Correção Automática</strong>
    </label>
  );
}
