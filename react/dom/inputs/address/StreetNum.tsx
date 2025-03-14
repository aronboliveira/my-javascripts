import { handleCondtReq } from "../../../src/lib/global/handlers/gHandlers";
import usePairedHeights from "../../../src/lib/hooks/usePairedHeights";
export default function StreetNum(): JSX.Element {
  const { left, right } = usePairedHeights();
  return (
    <>
      <input
        ref={left}
        type='number'
        name='street_num'
        id='streetNumId'
        className='form-control inpIdentif noInvert inpLocNum halfL'
        min='1'
        autoComplete='address-level4'
        data-xls='Número no Endereço'
        data-title='num_rua'
        placeholder='Preencha o número'
        onInput={ev =>
          handleCondtReq(ev.currentTarget, {
            min: 1,
            minNum: 0,
          })
        }
      />
      <label ref={right} role='group' htmlFor='streetNumNullId' className='halfSpanCheck halfR flexAlItCt noInvert'>
        <input
          type='checkbox'
          name='streetNumNullName'
          id='streetNumNullId'
          className='noInvert numNullId form-check-input'
          role='switch'
          data-title='switch_num_rua'
          onClick={ev => {
            const blockeableInput = ev.currentTarget.parentElement?.parentElement?.querySelector(".inpLocNum");
            ev.currentTarget.checked
              ? blockeableInput?.setAttribute("disabled", "")
              : blockeableInput?.removeAttribute("disabled");
          }}
          onDoubleClick={ev => {
            const blockeableInput = ev.currentTarget.parentElement?.parentElement?.querySelector(".inpLocNum");
            ev.currentTarget.checked
              ? blockeableInput?.setAttribute("disabled", "")
              : blockeableInput?.removeAttribute("disabled");
          }}
        />
      </label>
    </>
  );
}
