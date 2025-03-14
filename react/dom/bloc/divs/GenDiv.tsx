import {
  AlignType,
  BirthRelation,
  Gender,
  TransitionLevel,
} from "../../../src/lib/global/declarations/testVars";
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
      const g =
          gr.current ?? (document.getElementById("genId") as HTMLSelectElement),
        gb =
          gbr.current ??
          (document.getElementById("genBirthRelId") as HTMLSelectElement),
        gt =
          gtr.current ??
          (document.getElementById("genTransId") as HTMLSelectElement),
        ga =
          gar.current ??
          (document.getElementById("genFisAlinId") as HTMLSelectElement);
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
  useEffect(handleGenUpdate, [
    gen,
    genBirthRel,
    genTrans,
    genFisAlin,
    handleGenUpdate,
  ]);
  return (
    <div className="gridTwoCol noInvert" id="genDiv" role="group" ref={r}>
      <span
        role="group"
        className="fsAnamGSpan flexAlItCt genSpan"
        id="spanFsAnamG13"
      >
        <label htmlFor="genId" className="labelIdentif">
          Gênero:
          <select
            ref={gr}
            id="genId"
            className="form-select inpIdentif noInvert"
            data-title="genero"
            data-xls="Gênero"
            required
            value={gen}
            onChange={(ev) => setGen(ev.currentTarget.value as Gender)}
          >
            {gens.map(({ v, l }, i) => (
              <option key={`gender__${i}`} value={v} className="genderOpt">
                {l}
              </option>
            ))}
          </select>
        </label>
        <br role="presentation" />
      </span>
      <span
        role="group"
        className="fsAnamGSpan flexAlItCt genSpan"
        id="spanFsAnamG14"
      >
        <label htmlFor="genBirthRelId" className="labelIdentif">
          Identidade de gênero:
          <select
            ref={gbr}
            id="genBirthRelId"
            className="form-select inpIdentif noInvert"
            required
            value={genBirthRel}
            onChange={(ev) => setGenBirthRel(ev.target.value as BirthRelation)}
          >
            {birthRelations.map((b) => (
              <option
                key={`br___${b.v}`}
                value={b.v}
                className="birthRelationOpt"
              >
                {b.l}
              </option>
            ))}
          </select>
        </label>
        <br role="presentation" />
      </span>
      <span
        role="group"
        className="fsAnamGSpan flexAlItCt genSpan"
        id="spanFsAnamG15"
        hidden
      >
        <label htmlFor="genTransId" className="labelIdentif">
          Estágio da Transição Hormonal:
          <select
            ref={gtr}
            id="genTransId"
            className="form-select inpIdentif noInvert"
            value={genTrans}
            onChange={(ev) => setGenTrans(ev.target.value as TransitionLevel)}
          >
            {transOpts.map((o, i) => (
              <option key={`trans_lvl__${i}`} value={o.v} className="transOpt">
                {o.l}
              </option>
            ))}
          </select>
        </label>
        <br role="presentation" />
      </span>
      <span
        role="group"
        className="fsAnamGSpan flexAlItCt genSpan"
        id="spanFsAnamG16"
        hidden
      >
        <label htmlFor="genFisAlinId" className="labelIdentif">
          Alinhamento físico:
          <select
            ref={gar}
            id="genFisAlinId"
            className="form-select inpIdentif noInvert"
            value={genFisAlin}
            onChange={(ev) => setGenFisAlin(ev.target.value as AlignType)}
          >
            {alignOpts.map((a) => (
              <option key={`align__${a.v}`} value={a.v} className="alignOpt">
                {a.l}
              </option>
            ))}
          </select>
        </label>
        <br role="presentation" />
      </span>
    </div>
  );
}
export function checkAllGenConts(...els: targEl[]): boolean {
  if (
    Array.isArray(els) &&
    els?.every(
      (el) =>
        el instanceof HTMLSelectElement ||
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement
    )
  )
    return true;
  return false;
}
export function fluxGen(
  genConts: {
    g: entryEl;
    gb: entryEl;
    gt: entryEl;
    ga: entryEl;
  },
  transSetter?: Dispatch<SetStateAction<TransitionLevel>>,
  birthSetter?: Dispatch<SetStateAction<BirthRelation>>,
  alignSetter?: Dispatch<SetStateAction<AlignType>>
): BodyType {
  if (
    Object.values(genConts).every(
      (genCont) =>
        genCont instanceof HTMLSelectElement ||
        genCont instanceof HTMLInputElement ||
        genCont instanceof HTMLTextAreaElement
    )
  ) {
    const switchAlign = (): void => {
        if (gb.value === "cis") return;
        const contFeminilizado =
          ga instanceof HTMLSelectElement
            ? Array.from(ga.options).find((o) => o.value === "feminilizado") ??
              ga.querySelector('option[value="masculinizado"]')
            : document.querySelector('option[value="feminilizado"]');
        const contMasculinizado =
          ga instanceof HTMLSelectElement
            ? Array.from(ga.options).find((o) => o.value === "masculinizado") ??
              ga.querySelector('option[value="masculinizado"]')
            : document.querySelector('option[value="masculinizado"]');
        if (
          contFeminilizado instanceof HTMLOptionElement &&
          contMasculinizado instanceof HTMLOptionElement
        ) {
          if (gt.value === "avancado" || gb.value === "undefined") {
            if (g.value === "masculino") {
              if (alignSetter) alignSetter("masculinizado");
              else {
                contFeminilizado?.selected &&
                  contFeminilizado.removeAttribute("selected");
                contMasculinizado.setAttribute("selected", "");
              }
            }
            if (g.value === "feminino") {
              if (alignSetter) alignSetter("feminilizado");
              else {
                contMasculinizado?.selected &&
                  contMasculinizado.removeAttribute("selected");
                contFeminilizado.setAttribute("selected", "");
              }
            }
          }
        }
      },
      fluxAlign = (): BodyType => {
        switchAlign();
        showStgTransHorm(gt);
        showGenFisAlin(ga, g);
        switch (ga.value) {
          case "masculinizado":
            return "masculino";
          case "feminilizado":
            return "feminino";
          case "neutro":
            return "neutro";
          default:
            return person.gen;
        }
      },
      { g, gb, gt, ga } = genConts;
    gb.disabled = false;
    gt.disabled = false;
    ga.disabled = false;
    if (g.value === "masculino" || g.value === "feminino") {
      if (gb.value === "cis" || gb.value === "undefined") {
        switchAlign();
        hideStgTransHorm(gt);
        hideGenFisAlin(ga);
        gt.disabled = true;
        ga.disabled = true;
        return g.value || person.gen;
      }
      switchAlign();
      showStgTransHorm(gt);
      if (gb.value === "trans" && gt.value === "avancado") {
        hideGenFisAlin(ga);
        ga.disabled = true;
        return g.value || person.gen;
      }
      return fluxAlign();
    }
    if (g.value === "naoBinario") {
      gb.disabled = true;
      if (birthSetter) birthSetter("trans");
      else gb.value = "trans";
    } else if (g.value === "undefined") {
      gb.disabled = true;
      if (birthSetter) birthSetter("undefined");
      else gb.value = "undefined";
      gt.disabled = true;
      if (transSetter) transSetter("undefined");
      else gt.value = "undefined";
      hideStgTransHorm(gt);
    }
    return fluxAlign();
  }
  return "masculino";
}
export function showGenFisAlin(ga: targEl, g: targEl): boolean {
  if (
    ga instanceof HTMLSelectElement ||
    ga instanceof HTMLInputElement ||
    (ga instanceof HTMLTextAreaElement && ga.closest(".genSpan"))
  ) {
    if ((ga.closest(".genSpan") as HTMLElement)?.hidden === true) {
      fadeElement(ga.closest(".genSpan"), "0");
      setTimeout(() => {
        ga.closest(".genSpan")?.removeAttribute("hidden");
        setTimeout(() => {
          fadeElement(ga.closest(".genSpan"), "1");
          if (!g) return;
          ga.style.width = getComputedStyle(g).width;
          ga.style.maxWidth = getComputedStyle(g).width;
        }, 250);
      }, 250);
    }
    return true;
  }
  return false;
}
export function hideGenFisAlin(ga: targEl): boolean {
  if (
    ga instanceof HTMLSelectElement ||
    ga instanceof HTMLInputElement ||
    (ga instanceof HTMLTextAreaElement && ga.closest(".genSpan"))
  ) {
    if ((ga.closest(".genSpan") as HTMLElement)?.hidden === false) {
      setTimeout(() => {
        fadeElement(ga.closest(".genSpan"), "0");
        setTimeout(
          () => ga.closest(".genSpan")?.setAttribute("hidden", ""),
          500
        );
      }, 250);
    }
    return false;
  }
  return true;
}
export function showStgTransHorm(gt: targEl): boolean {
  if (
    gt instanceof HTMLSelectElement ||
    gt instanceof HTMLInputElement ||
    (gt instanceof HTMLTextAreaElement && gt.closest(".genSpan"))
  ) {
    if ((gt.closest(".genSpan") as HTMLElement)?.hidden === true) {
      fadeElement(gt.closest(".genSpan"), "0");
      setTimeout(() => {
        gt.closest(".genSpan")?.removeAttribute("hidden");
        setTimeout(() => {
          fadeElement(gt.closest(".genSpan"), "1");
        }, 250);
      }, 250);
    }
    return true;
  }
  return false;
}
export function hideStgTransHorm(gt: targEl): boolean {
  if (
    gt instanceof HTMLSelectElement ||
    gt instanceof HTMLInputElement ||
    (gt instanceof HTMLTextAreaElement && gt.closest(".genSpan"))
  ) {
    if ((gt.closest(".genSpan") as HTMLElement)?.hidden === false) {
      setTimeout(() => {
        fadeElement(gt.closest(".genSpan"), "0");
        setTimeout(() => {
          gt.closest(".genSpan")?.setAttribute("hidden", "");
        }, 500);
      }, 250);
    }
    return false;
  }
  return true;
}
export function filterIdsByGender(
  arrayIds: string[] = ["peit", "abd", "coxa"],
  bodyType: string = "masculino"
): string[] {
  if (
    Array.isArray(arrayIds) &&
    arrayIds?.every((prop) => typeof prop === "string") &&
    typeof bodyType === "string"
  ) {
    switch (bodyType) {
      case "masculino":
        return arrayIds.filter((id) => /peit|abd|coxa/g.test(id));
      case "feminino":
        return arrayIds.filter((id) => /tricp|suprail|coxa/g.test(id));
      case "neutro":
        return arrayIds.filter((id) => /peit|abd|tricp|suprail|coxa/g.test(id));
      default:
        return ["peit", "abd", "coxa"];
    }
  }
  return ["peit", "abd", "coxa"];
}
