import { clearPhDates } from "../../../src/lib/global/gStyleScript";
import { nlBtn, nlInp } from "../../../src/lib/global/declarations/types";
import { useCallback, useEffect, useRef } from "react";
import { compProp, parseNotNaN } from "../../../src/lib/global/gModel";
export default function HeaderDate(): JSX.Element {
  const dateRef = useRef<nlInp>(null),
    btnRef = useRef<nlBtn>(null),
    equalizeBtn = useCallback((): void => {
      btnRef.current ??= document.getElementById("headerDatBtn") as HTMLButtonElement;
      dateRef.current ??= document.getElementById("dateHeader") as HTMLInputElement;
      const btnWidth = parseNotNaN(compProp(btnRef.current, "width"));
      dateRef.current.style.width = `${btnWidth}px`;
      dateRef.current.style.maxWidth = `${btnWidth}px`;
    }, [btnRef, dateRef]);
  useEffect(() => {
    try {
      if (!(dateRef.current instanceof HTMLInputElement && dateRef.current.type === "date")) return;
      clearPhDates([dateRef.current]);
      equalizeBtn();
      addEventListener("resize", equalizeBtn);
      return (): void => removeEventListener("resize", equalizeBtn);
    } catch (e) {
      return;
    }
  }, [equalizeBtn, dateRef]);
  return (
    <fieldset style={{ display: "flex-inline" }} role='group' className='control flexJSt flexQ900NoW' id='spanHFlex'>
      <input
        type='date'
        className='form-control d_ibl minCurrDate'
        id='dateHeader'
        placeholder='Date'
        data-xls='Data de preenchimento'
        data-title='data_cabecalho'
        ref={dateRef}
      />
      <button type='button' className='datBtn d_ibl btn btn-secondary' id='headerDatBtn' ref={btnRef}>
        Usar data atual
      </button>
    </fieldset>
  );
}
