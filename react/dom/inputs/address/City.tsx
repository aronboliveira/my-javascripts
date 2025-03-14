import { handleEventReq } from "../../../src/lib/global/handlers/gHandlers";
export default function City(): JSX.Element {
  return (
    <input
      type='text'
      name='city'
      id='cityId'
      className='form-control autocorrect inpIdentif noInvert minText'
      data-title='cidade'
      minLength={3}
      data-reqlength='3'
      required
      placeholder='Preencha aqui a cidade'
      onInput={ev => handleEventReq(ev.currentTarget)}
    />
  );
}
