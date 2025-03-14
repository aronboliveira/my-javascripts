import {
  compProp,
  formatCEP,
  parseNotNaN,
} from "../../../src/lib/global/gModel";
import { handleEventReq } from "../../../src/lib/global/handlers/gHandlers";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { navigatorVars } from "../../../src/vars";
import {
  looseNum,
  nlBtn,
  nlInp,
} from "../../../src/lib/global/declarations/types";
import sAg from "../../../src/styles/modules/agStyles.module.scss";
export default function CepElements(): JSX.Element {
  const inpRef = useRef<nlInp>(null),
    btnRef = useRef<nlBtn | HTMLInputElement>(null),
    equalizeCepElements = useCallback((): void => {
      try {
        inpRef.current ??= document.getElementById("cepId") as nlInp;
        const cepInp = inpRef.current;
        if (!(cepInp instanceof HTMLInputElement)) return;
        btnRef.current ??=
          (document.getElementById("autoCompCepBtn") as nlBtn) ||
          (cepInp.nextElementSibling as nlBtn) ||
          (cepInp.parentElement?.querySelector("button") as nlBtn);
        const cepBtn = btnRef.current;
        if (
          !(
            cepBtn instanceof HTMLButtonElement ||
            (cepBtn instanceof HTMLInputElement && cepBtn.type === "button")
          )
        )
          return;
        let width: looseNum = `${parseNotNaN(compProp(cepInp, "width"))}`;
        width = parseNotNaN(width);
        if (!Number.isFinite(width) && width <= 0) return;
        width = width.toFixed(4);
        cepBtn.style.maxWidth = `${width}px`;
      } catch (e) {
        return;
      }
    }, [inpRef, btnRef]);
  useEffect(() => {
    equalizeCepElements();
    addEventListener("resize", equalizeCepElements);
    return (): void => removeEventListener("resize", equalizeCepElements);
  }, [equalizeCepElements]);
  return (
    <label
      htmlFor="cepId"
      className={`labelIdentif noInvert flexWC ${sAg.cepIdLab}`}
    >
      CEP:
      <input
        ref={inpRef}
        type="text"
        name="cep"
        id="cepId"
        className="form-control inpIdentif noInvert minText maxText patternText"
        minLength={3}
        maxLength={11}
        data-xls="CEP"
        data-title="cep"
        data-reqlength="3"
        data-maxlength="11"
        data-pattern="^\d{2}[\s.-]?\d{3}[\s.-]?\d{2,3}$"
        required
        onInput={(ev) => {
          const cepElementBtn = document.getElementById("autoCompCepBtn");
          formatCEP(ev.currentTarget);
          handleEventReq(ev.currentTarget);
          if (!enableCEPBtn(cepElementBtn, ev.currentTarget.value.length))
            return;
          toast.promise(
            searchCEP(ev.currentTarget).then((res) => {
              if (res === "fail") return searchCEPXML(ev.currentTarget);
              return res;
            }),
            {
              loading: navigatorVars.pt
                ? "Pesquisando CEP..."
                : "Searching CEP...",
              success: () =>
                navigatorVars.pt
                  ? "Sucesso carregando os dados!"
                  : "Success on loading data!",
              error: (err) =>
                navigatorVars.pt
                  ? `Erro obtendo dados para o CEP: Código ${
                      err?.status || "indefinido"
                    }`
                  : `Failed to retrieve CEP information: Code ${
                      err?.status || "undefined"
                    }`,
            }
          );
          setTimeout(() => toast.dismiss(), 4000);
        }}
      />
      <button
        ref={btnRef as any}
        type="button"
        id="autoCompCepBtn"
        className="btn btn-secondary"
        disabled
      >
        Preencher com CEP
      </button>
      <div
        className="min20H"
        id="divProgCEP"
        style={{ height: "1rem" }}
        role="separator"
      ></div>
      <div
        className="min20H customBlValidityWarn"
        id="divCEPWarn"
        style={{ height: "1.6rem" }}
        role="separator"
      ></div>
    </label>
  );
}
export function searchCEPXML(cepElement: targEl): number {
  let initTime = Date.now(),
    reqAcc = 2,
    statusNum = 0;
  if (cepElement instanceof HTMLInputElement) {
    const progInts = displayCEPLoadBar(cepElement) ?? [0, 100, null];
    const [progMax, progValue, progBar] = progInts;
    const cepHifenOutValue = cepElement.value?.replaceAll("-", "") ?? "";
    const xmlReq1 = new XMLHttpRequest();
    xmlReq1.open(
      "GET",
      `https://brasilapi.com.br/api/cep/v2/${cepHifenOutValue}`
    );
    xmlReq1.send();
    xmlReq1.onload = (): void => {
      statusNum = loadCEPXML(xmlReq1, reqAcc);
      if (statusNum === 200) {
        progBar &&
          progMax &&
          uploadCEPLoadBar(cepElement, progBar, initTime, progMax, progValue);
      } else {
        reqAcc--;
        initTime = Date.now();
        const xmlReq2 = new XMLHttpRequest();
        xmlReq2.open(
          "GET",
          `https://brasilapi.com.br/api/cep/v1/${cepHifenOutValue}`
        );
        xmlReq2.send();
        xmlReq2.onload = (): void => {
          statusNum = loadCEPXML(xmlReq2, reqAcc);
          if (statusNum === 200)
            progBar &&
              progMax &&
              uploadCEPLoadBar(
                cepElement,
                progBar,
                initTime,
                progMax,
                progValue
              );
          else
            progBar &&
              progMax &&
              uploadCEPLoadBar(
                cepElement,
                progBar,
                initTime,
                progMax,
                progValue
              );
        };
      }
    };
  }
  return statusNum;
}
export function loadCEPXML(
  xmlReq: XMLHttpRequest = new XMLHttpRequest(),
  reqAcc: number = 1
): number {
  try {
    if (xmlReq instanceof XMLHttpRequest && typeof reqAcc === "number") {
      const parsedAddress = JSON.parse(xmlReq.response);
      if (xmlReq.status === 200 && parsedAddress) {
        const uf = document.getElementById("UFId");
        const city = document.getElementById("cityId");
        const neighborhood = document.getElementById("neighbourhoodId");
        const street = document.getElementById("streetId");
        if (uf instanceof HTMLInputElement) uf.value = parsedAddress.state;
        if (city instanceof HTMLInputElement) city.value = parsedAddress.city;
        if (neighborhood instanceof HTMLInputElement)
          neighborhood.value = parsedAddress.neighborhood;
        if (street instanceof HTMLInputElement)
          street.value = parsedAddress.street;
      } else if (!xmlReq.status.toString().match(/^2/))
        throw new Error(`Invalid status: ${xmlReq.status}`);
      else throw new Error(`Status not recognized.`);
    } else
      throw new Error(`Error on the values entry.
      Obtained values: ${JSON.stringify(xmlReq) || null}, ${reqAcc}`);
  } catch (loadError) {
    return xmlReq?.status || 404;
  }
  return xmlReq.status;
}
export async function searchCEP(cepElement: targEl): Promise<string> {
  let status = 404;
  try {
    const initTime = Date.now();
    if (!(cepElement instanceof HTMLInputElement)) return "fail";
    const progInts = displayCEPLoadBar(cepElement) ?? [0, 100, null];
    const [progMax, progValue, progBar] = progInts;
    const cepHifenOutValue = cepElement.value?.replaceAll("-", "") ?? "";
    try {
      const res = await Promise.any(
        [
          `https://brasilapi.com.br/api/cep/v2/${cepHifenOutValue}`,
          `https://brasilapi.com.br/api/cep/v1/${cepHifenOutValue}`,
        ].map(makeCEPRequest)
      );
      if (res.ok) {
        loadCEP(res);
        progBar &&
          progMax &&
          uploadCEPLoadBar(cepElement, progBar, initTime, progMax, progValue);
        return "success";
      } else {
        progBar &&
          progMax &&
          uploadCEPLoadBar(cepElement, progBar, initTime, progMax, progValue);
        status = res.status;
      }
    } catch (error) {
      if (document.getElementById("divCEPWarn")) {
        document.getElementById("divCEPWarn")!.textContent =
          "*Erro carregando informações a partir de CEP. \n Inclua manualmente";
        setTimeout(
          () => (document.getElementById("divCEPWarn")!.textContent = ""),
          3000
        );
      }
      progBar &&
        progMax &&
        uploadCEPLoadBar(cepElement, progBar, initTime, progMax, progValue);
    }
  } catch (err) {
    return `${status}`;
  }
  return `${status}`;
}
export async function makeCEPRequest(url: string): Promise<Response> {
  const response = await fetch(url);
  try {
    if (!response.ok)
      throw new Error(`Error in CEP request. Status: ${response.status}`);
  } catch (error) {
    return response;
  }
  return response;
}
export async function loadCEP(res: Response): Promise<any> {
  try {
    if (res instanceof Response) {
      const parsedAddress = await res.json();
      if (res.ok && parsedAddress) {
        const uf = document.getElementById("UFId");
        const city = document.getElementById("cityId");
        const neighborhood = document.getElementById("neighbourhoodId");
        const street = document.getElementById("streetId");
        if (uf instanceof HTMLInputElement) uf.value = parsedAddress.state;
        if (city instanceof HTMLInputElement) city.value = parsedAddress.city;
        if (neighborhood instanceof HTMLInputElement)
          neighborhood.value = parsedAddress.neighborhood;
        if (street instanceof HTMLInputElement)
          street.value = parsedAddress.street;
        return parsedAddress;
      } else if (!res.status.toString().match(/^2/))
        throw new Error(`Invalid status: ${res.status}`);
      else throw new Error(`Status not recognized.`);
    } else
      throw new Error(`Error on the values entry.
      Obtained values: ${JSON.stringify(res) || null}`);
  } catch (loadError) {
    return res.status || 404;
  }
}
export function displayCEPLoadBar(
  cepElement: targEl
): [number, number, HTMLProgressElement] {
  const progressBar = document.createElement("progress");
  if (cepElement instanceof HTMLInputElement) {
    document.getElementById("divProgCEP")?.append(progressBar);
    Object.assign(progressBar, {
      id: "loadBarCepVars",
      max: 100,
      value: 0,
      style: { backgroundColor: "blue", color: "white" },
      width: cepElement.width,
    });
  }
  return [progressBar.max, progressBar.value, progressBar];
}
export function uploadCEPLoadBar(
  cepElement: targEl,
  progressBar: targEl = new HTMLProgressElement(),
  initTime: number = 0,
  progMaxInt: number = 100,
  progValueInt: number = 0
): void {
  if (
    cepElement instanceof HTMLInputElement &&
    progressBar instanceof HTMLProgressElement &&
    typeof initTime === `number` &&
    typeof progMaxInt === `number` &&
    typeof progValueInt === `number`
  ) {
    const elapsedTime = Date.now() - initTime;
    const elapsedNDec = elapsedTime.toString().length - 1;
    const addedZerosMult = Array.from(
      { length: elapsedNDec },
      () => "0"
    ).reduce((acc, curr) => acc + curr, "1");
    const indNDec = 1 * parseInt(addedZerosMult);
    const roundedElapsed = Math.round(elapsedTime / indNDec) * indNDec;
    if (progValueInt !== progMaxInt) {
      const loadingEvent = setInterval(() => {
        progValueInt += 5;
        progressBar.value = progValueInt;
        if (progValueInt === progMaxInt) clearInterval(loadingEvent);
      }, roundedElapsed / 20);
    }
    setTimeout(() => {
      document.getElementById("divProgCEP")?.removeChild(progressBar);
      document.getElementById("divProgCEP")!.style.minHeight = "1rem";
      document.getElementById("divProgCEP")!.style.height = "1rem";
    }, roundedElapsed);
  }
}
export function enableCEPBtn(cepBtn: targEl, cepLength: number = 0): boolean {
  let isCepElemenBtnOn = false;
  if (cepBtn instanceof HTMLButtonElement && typeof cepLength === "number") {
    if (cepLength === 9) {
      cepBtn.removeAttribute("disabled");
      isCepElemenBtnOn = true;
    } else cepBtn.setAttribute("disabled", "");
  }
  return isCepElemenBtnOn;
}
export function formatCEP(CEPInp: targEl): string {
  if (
    CEPInp instanceof HTMLInputElement ||
    CEPInp instanceof HTMLTextAreaElement
  ) {
    CEPInp.value.replaceAll(/[^0-9]/g, "");
    if (
      CEPInp.value.length >= 5 &&
      CEPInp.value.match(/[0-9]{5,}[^-][0-9]{1,3}/)
    )
      CEPInp.value = `${CEPInp.value.slice(0, 5)}-${CEPInp.value.slice(5, 9)}`;
  }
  return (CEPInp as entryEl)?.value ?? "";
}
