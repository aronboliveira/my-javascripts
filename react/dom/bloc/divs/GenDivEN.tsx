import { alignOpts, birthRelations, gens, person, timers, transOpts } from "../../../src/vars";
import { useContext, useEffect, useCallback, useRef } from "react";
import { NlMRef, NlrDispatch, nlSel } from "../../../src/lib/global/declarations/types";
import {
  AlignType,
  BirthRelation,
  BodyType,
  Gender,
  TransitionLevel,
} from "../../../src/lib/global/declarations/testVars";
import { ENCtx } from "../edfis/client/ENForm";
import { ENCtxProps } from "../../../src/lib/global/declarations/interfaces";
import useGenDiv from "../../../src/lib/hooks/useGenDiv";
import { handleGenRender } from "../../../src/lib/locals/edFisNutPage/edFisNutReactHandlers";
import { GenDivProps } from "../../../src/lib/global/declarations/interfacesCons";
import { fluxGen } from "../../../src/lib/global/gModel";
import sEn from "../../../src/styles/modules/enStyles.module.scss";
export default function GenDivEN({ genRef, genAlinRef }: GenDivProps): JSX.Element {
  let txbr: NlMRef<nlSel> = null,
    gbr: NlMRef<nlSel> = null,
    onSetBodyType: NlrDispatch<BodyType>;
  const trusted = useRef<boolean>(false),
    ctx1 = useContext<ENCtxProps>(ENCtx),
    {
      refs: { r, gtr },
      values: { gen, genBirthRel, genTrans, genFisAlin },
      setters: { setGen, setGenBirthRel, setGenTrans, setGenFisAlin },
    } = useGenDiv({}),
    handleGenUpdate = useCallback(() => {
      const g = genRef?.current ?? (document.getElementById("genId") as HTMLSelectElement),
        gb = gbr?.current ?? (document.getElementById("genBirthRelId") as HTMLSelectElement),
        gt = gtr.current ?? (document.getElementById("genTransId") as HTMLSelectElement),
        ga = genAlinRef?.current ?? (document.getElementById("genFisAlinId") as HTMLSelectElement);
      handleGenRender({ g, gb, gt, ga, setGenBirthRel, setGenFisAlin });
    }, [gen, genRef, gbr, gtr, genAlinRef, setGen, setGenFisAlin, setGenBirthRel]),
    handlePersonGenUpdate = useCallback(() => {
      if (!onSetBodyType) return;
      try {
        if (!txbr) throw new Error(`Reference object wasn't valid`);
        txbr.current ??= document.getElementById("textBodytype") as nlSel;
        if (!(txbr?.current instanceof HTMLSelectElement || (txbr?.current as any) instanceof HTMLInputElement)) return;
        onSetBodyType(person.gen === "masculino" || person.gen === "feminino" ? person.gen : ("neutro" as BodyType));
      } catch (e) {
        return;
      }
    }, [onSetBodyType, txbr]);
  if (ctx1) {
    if (ctx1.refs) ({ txbr, gbr } = ctx1.refs);
    if (ctx1.bt) onSetBodyType = ctx1.bt.d;
  }
  useEffect(() => {
    if (!trusted.current) return;
    if (/edfis/gi.test(location.pathname) || document.body.id.toLowerCase() === "edfisnutbody") {
      const genElement = genRef?.current ?? document.getElementById("genId");
      if (
        genElement instanceof HTMLSelectElement ||
        genElement instanceof HTMLInputElement ||
        genElement instanceof HTMLTextAreaElement
      )
        person.dispatchGen(genElement.value);
    }
  }, [genRef, trusted]);
  useEffect(() => {
    if (!trusted.current) return;
    handleGenUpdate();
  }, [gen, handleGenUpdate, genBirthRel, genTrans, genFisAlin, trusted]);
  useEffect(() => {
    if (!trusted.current) return;
    handlePersonGenUpdate();
  }, [handlePersonGenUpdate, trusted]);
  useEffect(() => {
    setTimeout(() => {
      try {
        const g = genRef?.current ?? (document.getElementById("genId") as HTMLSelectElement),
          gb = gbr?.current ?? (document.getElementById("genBirthRelId") as HTMLSelectElement),
          gt = gtr.current ?? (document.getElementById("genTransId") as HTMLSelectElement),
          ga = genAlinRef?.current ?? (document.getElementById("genFisAlinId") as HTMLSelectElement);
        person.dispatchGen(fluxGen({ g, gb, gt, ga }, setGenTrans, setGenBirthRel, setGenFisAlin));
      } catch (e) {
        return;
      }
    }, timers.personENTimer * 0.75);
  }, [genRef, gbr, gtr, genAlinRef, setGenBirthRel, setGenFisAlin, setGenTrans]);
  return (
    <div
      className={`noInvert ${sEn.genDivEn}`}
      id='genDiv'
      role='group'
      ref={r}
      style={{ width: "100%", columnGap: "0" }}>
      <span role='group' className='fsAnamGSpan flexAlItCt genSpan' id='spanFsAnamG13'>
        <label htmlFor='genId' className='labelIdentif'>
          Gênero:
          <select
            ref={genRef}
            value={gen}
            id='genId'
            className={`form-select inpIdentif noInvert min88_900 ${sEn.select} ${sEn.gEn}`}
            data-title='genero'
            data-xls='Gênero'
            required
            onChange={ev => {
              if (ev.isTrusted) trusted.current = true;
              if (!trusted.current) return;
              setGen(ev.currentTarget.value as Gender);
            }}>
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
            value={genBirthRel}
            id='genBirthRelId'
            className={`form-select inpIdentif noInvert min88_900 ${sEn.select} ${sEn.gbEn}`}
            required
            onChange={ev => {
              if (ev.isTrusted) trusted.current = true;
              if (!trusted.current) return;
              setGenBirthRel(ev.target.value as BirthRelation);
            }}>
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
            value={genTrans}
            id='genTransId'
            className={`form-select inpIdentif noInvert min88_900 ${sEn.select}`}
            onChange={ev => {
              if (ev.isTrusted) trusted.current = true;
              if (!trusted.current) return;
              setGenTrans(ev.target.value as TransitionLevel);
            }}>
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
        <label htmlFor='genFisAlinId' className={`labelIdentif ${sEn.labGa}`}>
          Alinhamento físico:
          <select
            ref={genAlinRef}
            value={genFisAlin}
            id='genFisAlinId'
            className={`form-select inpIdentif noInvert min88_900 ${sEn.select}`}
            onChange={ev => {
              if (ev.isTrusted) trusted.current = true;
              if (!trusted.current) return;
              setGenFisAlin(ev.target.value as AlignType);
            }}>
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
