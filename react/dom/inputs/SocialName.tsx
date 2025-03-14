import { nlInp, nlSel } from "../../../src/lib/global/declarations/types";
import { handleCondtReq } from "../../../src/lib/global/handlers/gHandlers";
import { useEffect, useRef } from "react";
export default function SocialName(): JSX.Element {
  const r = useRef<nlInp>(null),
    fr = useRef<nlInp>(null),
    ar = useRef<nlInp>(null),
    gr = useRef<nlSel>(null);
  useEffect(() => {
    try {
      const handleResize = (): void => {
        if (!(r.current instanceof HTMLElement)) return;
        if (!(fr.current instanceof HTMLElement)) fr.current = document.getElementById("firstNameId") as nlInp;
        if (!(fr.current instanceof HTMLElement)) return;
        const frWid = getComputedStyle(fr.current).width;
        r.current.style.width = frWid;
        if (!(ar.current instanceof HTMLElement)) ar.current = document.getElementById("ageId") as nlInp;
        if (!(ar.current instanceof HTMLElement)) return;
        ar.current.style.width = frWid;
        if (!(gr.current instanceof HTMLElement)) gr.current = document.getElementById("genId") as nlSel;
        if (!(gr.current instanceof HTMLElement)) return;
        gr.current.style.width = frWid;
      };
      handleResize();
      addEventListener("resize", handleResize);
      return (): void => removeEventListener("resize", handleResize);
    } catch (e) {
      return;
    }
  }, [r, fr]);
  return (
    <span role='group' className='fsAnamGSpan flexAlItCt col' id='fsAnamGSpan4'>
      <label htmlFor='socialNameId' className='labelIdentif'>
        Nome Social:
        <input
          ref={r}
          type='text'
          name='social_name'
          id='socialNameId'
          className='form-control autocorrect inpIdentif noInvert'
          data-title='nome_social'
          autoComplete='given-name'
          onInput={ev =>
            handleCondtReq(ev.currentTarget, {
              min: 3,
              max: 99,
              pattern: ["[^0-9]", "gi"],
            })
          }
        />
      </label>
    </span>
  );
}
