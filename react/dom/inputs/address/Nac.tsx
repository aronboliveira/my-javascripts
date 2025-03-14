import { handleEventReq } from "../../../src/lib/global/handlers/gHandlers";
export default function Nac(): JSX.Element {
  return (
    <input
      type='text'
      name='country'
      id='countryId'
      className='form-control autocorrect inpIdentif noInvert minText patternText'
      autoComplete='country'
      data-title='nacionalidade'
      minLength={3}
      data-reqlength='3'
      data-pattern='[^0-9]'
      data-flags='g'
      required
      onInput={ev => handleEventReq(ev.currentTarget)}
    />
  );
}
