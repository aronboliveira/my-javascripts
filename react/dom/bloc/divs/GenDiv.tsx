import { AlignType, BirthRelation, Gender, TransitionLevel } from "../../../src/lib/global/declarations/testVars";
import useGenDiv from "../../../src/lib/hooks/useGenDiv";
import useResetPerson from "../../../src/lib/hooks/useResetPerson";
import { handleGenRender } from "../../../src/lib/locals/edFisNutPage/edFisNutReactHandlers";
import { alignOpts, birthRelations, gens, transOpts } from "../../../src/vars";
import { useCallback, useEffect } from "react";
export default function GenDiv(): JSX.Element {
  const {
      refs: { r, gr, gbr, gtr, gar },
      values: { gen, genBirthRel, genTrans, genFisAlin },
      setters: { setGen, setGenBirthRel, setGenTrans, setGenFisAlin },
    } = useGenDiv({}),
    handleGenUpdate = useCallback(() => {
      const g = gr.current ?? (document.getElementById("genId") as HTMLSelectElement),
        gb = gbr.current ?? (document.getElementById("genBirthRelId") as HTMLSelectElement),
        gt = gtr.current ?? (document.getElementById("genTransId") as HTMLSelectElement),
        ga = gar.current ?? (document.getElementById("genFisAlinId") as HTMLSelectElement);
      handleGenRender({
        g,
        gb,
        gt,
        ga,
        setGenBirthRel,
        setGenFisAlin,
      });
    }, [gen, gr, gbr, gtr, gar, setGen, setGenFisAlin]);
  useResetPerson();
  useEffect(handleGenUpdate, [gen, genBirthRel, genTrans, genFisAlin, handleGenUpdate]);
  return (
    <div className='gridTwoCol noInvert' id='genDiv' role='group' ref={r}>
      <span role='group' className='fsAnamGSpan flexAlItCt genSpan' id='spanFsAnamG13'>
        <label htmlFor='genId' className='labelIdentif'>
          Gênero:
          <select
            ref={gr}
            id='genId'
            className='form-select inpIdentif noInvert'
            data-title='genero'
            data-xls='Gênero'
            required
            value={gen}
            onChange={ev => setGen(ev.currentTarget.value as Gender)}>
            {gens.map(({ v, l }, i) => (
              <option key={`gender__${i}`} value={v} className='genderOpt'>
                {l}
              </option>
            ))}
          </select>
        </label>
        <br role='presentation' />
      </span>
      <span role='group' className='fsAnamGSpan flexAlItCt genSpan' id='spanFsAnamG14'>
        <label htmlFor='genBirthRelId' className='labelIdentif'>
          Identidade de gênero:
          <select
            ref={gbr}
            id='genBirthRelId'
            className='form-select inpIdentif noInvert'
            required
            value={genBirthRel}
            onChange={ev => setGenBirthRel(ev.target.value as BirthRelation)}>
            {birthRelations.map(b => (
              <option key={`br___${b.v}`} value={b.v} className='birthRelationOpt'>
                {b.l}
              </option>
            ))}
          </select>
        </label>
        <br role='presentation' />
      </span>
      <span role='group' className='fsAnamGSpan flexAlItCt genSpan' id='spanFsAnamG15' hidden>
        <label htmlFor='genTransId' className='labelIdentif'>
          Estágio da Transição Hormonal:
          <select
            ref={gtr}
            id='genTransId'
            className='form-select inpIdentif noInvert'
            value={genTrans}
            onChange={ev => setGenTrans(ev.target.value as TransitionLevel)}>
            {transOpts.map((o, i) => (
              <option key={`trans_lvl__${i}`} value={o.v} className='transOpt'>
                {o.l}
              </option>
            ))}
          </select>
        </label>
        <br role='presentation' />
      </span>
      <span role='group' className='fsAnamGSpan flexAlItCt genSpan' id='spanFsAnamG16' hidden>
        <label htmlFor='genFisAlinId' className='labelIdentif'>
          Alinhamento físico:
          <select
            ref={gar}
            id='genFisAlinId'
            className='form-select inpIdentif noInvert'
            value={genFisAlin}
            onChange={ev => setGenFisAlin(ev.target.value as AlignType)}>
            {alignOpts.map(a => (
              <option key={`align__${a.v}`} value={a.v} className='alignOpt'>
                {a.l}
              </option>
            ))}
          </select>
        </label>
        <br role='presentation' />
      </span>
    </div>
  );
}
