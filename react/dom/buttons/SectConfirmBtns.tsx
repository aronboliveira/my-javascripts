import { ExportHandler } from "../../../src/lib/global/declarations/classes";
import { nlBtn } from "../../../src/lib/global/declarations/types";
import { addExportFlags } from "../../../src/lib/global/gController";
import { checkForReset } from "../../../src/lib/global/handlers/gHandlers";
import { exporters } from "../../../src/vars";
import { useEffect, useRef } from "react";
let exporter: ExportHandler | undefined;
export default function SectConfirmBtns(): JSX.Element {
  const btnRef = useRef<nlBtn>(null);
  useEffect(() => {
    exporter = (() => {
      if (/ag/gi.test(location.pathname)) {
        if (!exporters.agExporter) exporters.agExporter = new ExportHandler();
        return exporters.agExporter;
      } else if (/ed/gi.test(location.pathname)) {
        if (!exporters.edExporter) exporters.edExporter = new ExportHandler();
        return exporters.edExporter;
      } else if (/od/gi.test(location.pathname)) {
        if (!exporters.odExporter) exporters.odExporter = new ExportHandler();
        return exporters.odExporter;
      } else return new ExportHandler();
    })();
    const interv = exporter.autoResetTimer(600000),
      path = location.pathname,
      handleUnload = (): void => interv && clearInterval(interv),
      handlePop = (): boolean => {
        if (location.pathname !== path) {
          interv && clearInterval(interv);
          return true;
        }
        return false;
      };
    addEventListener(
      "beforeunload",
      () => {
        handleUnload();
        removeEventListener("beforeunload", handleUnload);
      },
      { once: true },
    );
    addEventListener("popstate", () => {
      handlePop() && removeEventListener("popstate", handlePop);
    });
    addExportFlags(btnRef.current?.closest("form") ?? document);
    (): void => {
      handlePop();
      removeEventListener("popstate", handlePop);
      handleUnload();
      removeEventListener("beforeunload", handleUnload);
    };
  }, []);
  return (
    <fieldset className='sectionMain sectionConfirm' id='sectConfirmBut' style={{ overflow: "visible" }}>
      <button
        type='submit'
        name='submitFormButName'
        id='submitFormButId'
        className='confirmBut btn btn-success forceInvert'
        formAction='_self'
        formMethod='POST'
        accessKey='enter'>
        Submeter
      </button>
      <button
        type='button'
        style={{
          background: "linear-gradient(to right, rgba(255, 200, 0, 0.5058823529), rgba(255, 153, 44, 0.6705882353))",
        }}
        className='confirmBut btn btn-warning forceInvert'
        id='resetFormBtn'
        onClick={checkForReset}>
        Resetar
      </button>
      <button
        ref={btnRef}
        type='button'
        id='btnExport'
        data-active='false'
        className='btn btn-secondary forceInvert'
        style={{
          backgroundColor: "rgba(0, 0, 255, 0.904)",
          borderColor: "rgba(0, 0, 255, 0.904)",
          cursor: "alias",
        }}
        onClick={ev => {
          if (!exporter) {
            exporter = (() => {
              if (/ag/gi.test(location.pathname)) {
                if (!exporters.agExporter) exporters.agExporter = new ExportHandler();
                return exporters.agExporter;
              } else if (/ed/gi.test(location.pathname)) {
                if (!exporters.edExporter) exporters.edExporter = new ExportHandler();
                return exporters.edExporter;
              } else if (/od/gi.test(location.pathname)) {
                if (!exporters.odExporter) exporters.odExporter = new ExportHandler();
                return exporters.odExporter;
              } else return new ExportHandler();
            })();
          }
          exporter.handleExportClick(
            ev,
            (() => {
              if (/ag/gi.test(location.pathname)) return "anamnese";
              else if (/ed/gi.test(location.pathname)) return "educacaoFisica__Nutricao";
              else if (/od/gi.test(location.pathname)) return "odontologia";
              else return "indefinido";
            })(),
            ev.currentTarget.closest("form") ?? document,
            `${localStorage.getItem("name")?.replace(/\s/g, "-") ?? ""}_${
              localStorage.getItem("secondName")?.replace(/\s/g, "-") ?? ""
            }_${localStorage.getItem("lastName")?.replace(/\s/g, "-") ?? ""}`,
          ),
            { signal: new AbortController().signal };
        }}>
        Gerar Planilha
      </button>
    </fieldset>
  );
}
