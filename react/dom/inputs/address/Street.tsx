import { handleEventReq } from "../../../src/lib/global/handlers/gHandlers";
export default function Street(): JSX.Element {
  return (
    <input
      type='text'
      name='street'
      id='streetId'
      className='form-control autocorrect inpIdentif noInvert minText'
      autoComplete='address-level3'
      data-xls='Endereço'
      data-title='endereco'
      minLength={3}
      data-reqlength='3'
      required
      placeholder='Preencha aqui o endereço'
      onInput={ev => handleEventReq(ev.currentTarget)}
    />
  );
}
