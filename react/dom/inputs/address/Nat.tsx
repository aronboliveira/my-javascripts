import { handleEventReq } from "../../../src/lib/global/handlers/gHandlers";
export default function Nat(): JSX.Element {
  return (
    <input
      type='text'
      name='naturality'
      id='munId'
      className='form-control autocorrect inpIdentif noInvert minText'
      autoComplete='address-level2'
      data-title='naturalidade'
      minLength={3}
      data-reqlength='3'
      required
      onInput={ev => handleEventReq(ev.currentTarget)}
    />
  );
}
