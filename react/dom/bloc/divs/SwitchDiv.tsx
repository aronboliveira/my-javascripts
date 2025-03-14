import { switchAutoFill } from "../../../src/lib/locals/edFisNutPage/edFisNutHandler";
import { agProps, navigatorVars, odProps, tabProps, timers } from "../../../src/vars";
import { useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import s from "../../../src/styles/modules/sharedComponents.module.scss";
import { nlInp } from "../../../src/lib/global/declarations/types";
import { toast } from "react-hot-toast";
export default function SwitchDiv({ autofill = false }: { autofill?: boolean }): JSX.Element {
  const location = useLocation(),
    isEdFis = /edfis/gi.test(location.pathname),
    fillRef = useRef<nlInp>(null),
    correctRef = useRef<nlInp>(null),
    spanStyle = { display: "flex", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
  useEffect(() => {
    if (!isEdFis) return;
    setTimeout(() => {
      try {
        const query = document.getElementById("autoFillBtn");
        tabProps.isAutoFillActive =
          fillRef.current?.checked ||
          (query instanceof HTMLInputElement && (query as HTMLInputElement).checked) ||
          tabProps.isAutoFillActive;
      } catch (e) {
        return;
      }
      try {
        const query = document.getElementById("deactAutocorrectBtnPac");
        tabProps.edIsAutoCorrectOn =
          correctRef.current?.checked ||
          (query instanceof HTMLInputElement && (query as HTMLInputElement).checked) ||
          tabProps.edIsAutoCorrectOn;
      } catch (e) {
        return;
      }
    }, timers.personENTimer * 0.75);
  }, [correctRef, isEdFis, fillRef]);
  return (
    <div role='group' className={`switchDiv flexQ900NoWC divTab ${isEdFis ? `${s.switchDivEn} ${s.divTabEn}` : ""}`}>
      {autofill && (
        <label role='group' htmlFor='autoFillBtn' className='form-switch spanLeft' id='autofillDiv' style={spanStyle}>
          <input
            ref={fillRef}
            type='checkbox'
            className={`deActBtn form-check-input ${isEdFis ? `${s.autoFillBtnEn}` : ""}`}
            role='switch'
            id={`autoFillBtn`}
            data-title='Cálculo automático'
            defaultChecked
            onChange={ev => {
              ev.currentTarget.checked ? (tabProps.isAutoFillActive = true) : (tabProps.isAutoFillActive = false);
              tabProps.isAutoFillActive
                ? toast(navigatorVars.pt ? "Autopreenchimento ativado" : "Autofill activated", {
                    icon: "🔢",
                  })
                : toast(navigatorVars.pt ? "Autopreenchimento desativado" : "Autofill deactivated", { icon: "📝" });
              switchAutoFill(ev.currentTarget);
            }}
          />
          <strong className={s.calcText}>Cálculo Automático</strong>
        </label>
      )}
      <span role='group' className='form-switch spanRight' id='autocorrectDiv' style={spanStyle}>
        <input
          ref={correctRef}
          type='checkbox'
          className={`deActBtn form-check-input ${isEdFis ? `${s.deactAutocorrectBtnPacEn}` : ""}`}
          role='switch'
          id={`deactAutocorrectBtnPac`}
          data-title='Autocorreção'
          defaultChecked
          onClick={ev => {
            const toastMsg = (autoCorrect: boolean): void => {
              autoCorrect
                ? toast(navigatorVars.pt ? "Autocorreção ativada" : "Autocorrection activated", {
                    icon: "🔢",
                  })
                : toast(navigatorVars.pt ? "Autocorreção desativada" : "Autocorrection deactivated", {
                    icon: "📝",
                  });
              setTimeout(() => toast.dismiss(), 2000);
            };
            if (location.pathname.toLowerCase().includes("edfis")) {
              ev.currentTarget.checked ? (tabProps.edIsAutoCorrectOn = true) : (tabProps.edIsAutoCorrectOn = false);
              toastMsg(tabProps.edIsAutoCorrectOn);
            } else if (location.pathname.toLowerCase().includes("od")) {
              ev.currentTarget.checked ? (odProps.odIsAutoCorrectOn = true) : (odProps.odIsAutoCorrectOn = false);
              toastMsg(odProps.odIsAutoCorrectOn);
            } else if (location.pathname.toLowerCase().includes("ag")) {
              ev.currentTarget.checked ? (agProps.agIsAutoCorrectOn = true) : (agProps.agIsAutoCorrectOn = false);
              toastMsg(agProps.agIsAutoCorrectOn);
            }
          }}
        />
        <label htmlFor='deactAutocorrectBtnPac' style={{ display: "inline", marginLeft: "0.3rem" }}>
          <strong>Autocorreção</strong>
        </label>
      </span>
    </div>
  );
}
