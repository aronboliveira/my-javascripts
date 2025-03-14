import { CounterAction } from "../../../src/lib/global/declarations/interfaces";
import { addMedHistHandler } from "../../../src/lib/locals/aGPage/aGHandlers";
import { clearPhDates } from "../../../src/lib/global/gStyleScript";
import { nlFs } from "../../../src/lib/global/declarations/types";
import { syncAriaStates } from "../../../src/lib/global/handlers/gHandlers";
import { useEffect, useReducer, useRef } from "react";
export default function AntMedFs({ children = <></> }: { children: JSX.Element }): JSX.Element {
  const mainRef = useRef<nlFs>(null);
  const [blockCount, setBlockCount] = useReducer((s: number, a: CounterAction) => {
    switch (a.type) {
      case "INCREMENT":
        return s + 1;
      case "DECREMENT":
        return s > 2 ? s - 1 : s;
      default:
        return s;
    }
  }, 2);
  useEffect(() => {
    try {
      if (!(mainRef.current instanceof HTMLElement)) return;
      syncAriaStates([mainRef.current, ...mainRef.current.querySelectorAll("*")]);
      clearPhDates(Array.from(document.querySelectorAll('input[type="date"]')));
    } catch (e) {
      return;
    }
  }, [blockCount]);
  return (
    <fieldset name='fsAntMedName' id='fsAntMedId' className='fsSub' ref={mainRef}>
      <legend id='fsAntMedLeg'>
        Tratamentos Médicos Atuais e Anteriores e/ou Internações
        <fieldset style={{ display: "inline" }} role='group' id='antMedBtnsDiv' className='btnsDiv'>
          <button
            type='button'
            name='addAntMedName1'
            id='addAntMedId1'
            className='addAntMed countAntMed btn btn-secondary biBtn mg__1br'
            aria-label='Adicionar Antecedente Médico'
            defaultValue='addAntMed'
            style={{ cursor: "cell" }}
            onClick={ev => {
              addMedHistHandler(ev, blockCount);
              setBlockCount({ type: "INCREMENT" });
            }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='bi bi-plus'
              viewBox='0 0 16 16'>
              <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4' />
            </svg>
          </button>
          <button
            type='button'
            name='removeAntMedName1'
            id='removeAntMedId1'
            className='removeAntMed countAntMed btn btn-secondary biBtn mg__1br'
            aria-label='Remover Antecedente Médico'
            defaultValue='removeAntMed'
            style={{ cursor: "vertical-text" }}
            onClick={ev => {
              addMedHistHandler(ev, blockCount);
              setBlockCount({ type: "DECREMENT" });
            }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='bi bi-dash'
              viewBox='0 0 16 16'>
              <path d='M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8' />
            </svg>
          </button>
        </fieldset>
      </legend>
      {children}
    </fieldset>
  );
}
