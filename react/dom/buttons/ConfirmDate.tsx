import { nlBtn, nlInp } from "../../../src/lib/global/declarations/types";
import { useCallback, useEffect, useRef } from "react";
import { compProp, parseNotNaN } from "../../../src/lib/global/gModel";
export default function ConfirmDate(): JSX.Element {
  const dateRef = useRef<nlInp>(null),
    btnRef = useRef<nlBtn>(null),
    equalizeBtn = useCallback((): void => {
      btnRef.current ??= document.getElementById("headerDatBtn") as HTMLButtonElement;
      dateRef.current ??= document.getElementById("dateHeader") as HTMLInputElement;
      const dateWidth = parseNotNaN(compProp(dateRef.current, "width")),
        btnWidth = parseNotNaN(compProp(btnRef.current, "width"));
      if (dateWidth > btnWidth) btnRef.current.style.width = `${dateWidth}px`;
      else if (dateWidth < btnWidth) dateRef.current.style.width = `${btnWidth}px`;
    }, [dateRef, btnRef]);
  useEffect(() => {
    equalizeBtn();
    addEventListener("resize", equalizeBtn);
    return (): void => removeEventListener("resize", equalizeBtn);
  }, [equalizeBtn]);
  return (
    <label
      htmlFor='confirmDatId'
      className='labConfirm labDivConfirm2 pdT2pc900Q htFull900Q flexNoWC htHalf900Q bolded'
      id='labConfirmDate'>
      <span>Data:</span>
      <div className='widFull flexQ900NoW htFull900Q' id='divConfirmDat' role='group'>
        <input
          type='date'
          name='confirmDatName'
          id='confirmDatId'
          className='inpConfirm inpDate form-control noInvert minCurrDate'
          data-title='assinatura_data'
          data-xls='Data de Assinatura'
          required
          ref={dateRef}
        />
        <button type='button' className='datBtn confirmBtn btn btn-secondary widFull' id='confirmDatBtn' ref={btnRef}>
          Usar data atual
        </button>
      </div>
    </label>
  );
}
