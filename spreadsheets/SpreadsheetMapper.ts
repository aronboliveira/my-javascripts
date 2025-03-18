import { toast } from "react-hot-toast";
import { voidish } from "../foundations";
import { flags } from "../utils/MathHandler";
import { utils, writeFile } from "xlsx";
import StringHelper from "../utils/StringHelper";
import JSZip from "jszip";
import DOMValidator from "../dom/DOMValidator";
export type queryableNode = Document | DocumentFragment | Element;
interface ExtratectedLabeledData {
  elsDefs: {
    [k: string]: {
      title: string | undefined;
      v: string | undefined;
      type: "s" | "b" | "n" | "d" | "i" | undefined;
    };
  };
  imageEls: {
    [k: string]: HTMLCanvasElement | HTMLInputElement;
  };
}
export default class SpreadsheetMapper {
  #data: ExtratectedLabeledData;
  static _instance: SpreadsheetMapper;
  constructor(_data: ExtratectedLabeledData) {
    this.#data = _data;
  }
  static construct(
    _data: ExtratectedLabeledData
  ): SpreadsheetMapper {
    if (!SpreadsheetMapper._instance)
      SpreadsheetMapper._instance = new SpreadsheetMapper(
        _data
      );
    return SpreadsheetMapper._instance;
  }
  public static extractData(
    scope: queryableNode = document
  ): ExtratectedLabeledData {
    let v: string | ArrayBuffer | null = "Não preenchido",
      type: "s" | "b" | "n" | "d" | "i" | undefined;
    const allEntryEls = [
        ...Array.from(
          (scope ?? document).querySelectorAll("input")
        ).filter(
          el =>
            !(
              el instanceof HTMLInputElement &&
              (el.type === "checkbox" ||
                el.type === "radio") &&
              (el.role === "switch" ||
                el.parentElement?.classList.contains(
                  "form-switch"
                ) ||
                el.labels?.[0]?.innerText
                  ?.toLowerCase()
                  .includes("cálculo automático") ||
                el.labels?.[0]?.innerText
                  ?.toLowerCase()
                  .includes("autocorreção"))
            )
        ),
        ...(scope ?? document).querySelectorAll("textarea"),
        ...(scope ?? document).querySelectorAll("select"),
        ...(scope ?? document).querySelectorAll("output"),
        ...(scope ?? document).querySelectorAll("canvas"),
      ],
      elsDefs: {
        [k: string]: {
          title: string | undefined;
          v: string | undefined;
          type: "s" | "b" | "n" | "d" | "i" | undefined;
        };
      } = {},
      imageEls: {
        [k: string]: HTMLCanvasElement | HTMLInputElement;
      } = {},
      filterTitle = (
        v: string | voidish
      ): string | voidish => {
        return v
          ?.split("")
          .map((c, i) => (i === 0 ? c.toUpperCase() : c))
          .join("")
          .replace(/_/g, " ");
      };
    let acc = 1;
    for (const el of allEntryEls) {
      const title =
        filterTitle(el.dataset.xls) ||
        (DOMValidator.isDefaultEntry(el) &&
          el.labels?.[0] &&
          filterTitle(el.labels[0].textContent)) ||
        filterTitle(el.title) ||
        StringHelper.capitalize(
          filterTitle(el.id) || crypto.randomUUID()
        ) ||
        (!(el instanceof HTMLCanvasElement) &&
          StringHelper.capitalize(
            filterTitle(el.name) || crypto.randomUUID()
          )) ||
        `Sem Título (${
          el?.id ||
          (!(el instanceof HTMLCanvasElement) &&
            el?.name) ||
          el?.className ||
          el?.tagName
        }`;
      if (el instanceof HTMLOutputElement) {
        v = el.innerText || "Não preenchido";
        type = "s";
      } else if (
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement
      ) {
        v = el.value || "Não preenchido";
        type = "s";
      } else if (el instanceof HTMLInputElement) {
        if (el.type === "checkbox" || el.type === "radio") {
          type = "b";
          v = el.checked ? "Sim" : "Não";
        } else if (el.type === "number") {
          type = "n";
          if (v !== "Não preenchido") {
            v =
              v?.replace(/[^0-9]/g, "") ?? "Não preenchido";
            if (v !== "" && !Number.isFinite(Number(v)))
              v = "#ERRO -> Número inválido";
          }
        } else if (el.type === "file") {
          type = "i";
          const file = el.files?.[0];
          if (file) {
            const rd = new FileReader();
            rd.onload = (): string | ArrayBuffer | null =>
              (v = rd.result);
            rd.onerror = (): string => {
              toast?.error(
                flags.pt
                  ? `Erro carregando arquivos para a planilha`
                  : `Error loading files to the spreadsheet`
              );
              return (v = `#ERRO: ${
                rd.error?.name ?? "Nome indefinido"
              } — ${
                rd.error?.message ?? "mensagem indefinida"
              }`);
            };
            rd.onloadend = () => {
              toast?.success(
                flags.pt
                  ? `Sucesso carregando arquivos: ${file.name}`
                  : `Success loading files: ${file.name}`,
                { duration: 1000 }
              );
            };
            rd.readAsDataURL(file);
            imageEls[el.id] = el;
          } else v = "Não preenchido";
        } else if (el.type === "date") type = "d";
        else type = "s";
      } else if (el instanceof HTMLCanvasElement) {
        type = "i";
        v = el.toDataURL("image/png");
        imageEls[el.id] = el;
      }
      elsDefs[
        el.id ||
          (!(el instanceof HTMLCanvasElement) && el.name) ||
          el.dataset.title?.replace(/\s/g, "__") ||
          el.className.replace(/\s/g, "__") ||
          el.tagName
      ] = { title, v, type };
      acc += 1;
    }
    return { elsDefs, imageEls };
  }
  public processExportData(
    context: string = "undefined",
    scope: queryableNode = document,
    namer: HTMLElement | string | voidish = ""
  ): void {
    try {
      const wb = utils.book_new(),
        dataJSON = Object.entries(this.#data.elsDefs).map(
          ([k, v], i) => ({
            Campo:
              v.title ||
              k ||
              `#ERRO -> Chave Elemento ${i + 1}`,
            Valor:
              (!v.v
                ? "Não preenchido"
                : v.v && v.v.length > 1 && v.type !== "i"
                ? v.v === "avancado"
                  ? "Avançado"
                  : v.v?.includes("avaliacao")
                  ? v.v.replace(/avaliacao/gi, "Avaliação")
                  : `${StringHelper.capitalize(v.v)}`
                : v.v) ??
              `#ERRO -> Valor Elemento ${i + 1}`,
            Tipo: (() => {
              switch (v.type) {
                case "b":
                  return "Lógico";
                case "n":
                  return "Número";
                case "d":
                  return "Data";
                case "i":
                  return "Imagem";
                default:
                  return "Texto";
              }
            })(),
          })
        ),
        worksheet = utils.json_to_sheet(dataJSON, {
          dateNF: "dd/mm/yyyy",
          skipHeader: false,
          cellDates: true,
        }),
        maxLengths: { [k: string]: number } = {};
      Object.entries(worksheet).forEach(row => {
        row.forEach((c, i) => {
          const len = c?.toString().length;
          if (len)
            (!maxLengths[i] || maxLengths[i] < len) &&
              (maxLengths[i] = len);
        });
      });
      worksheet["!cols"] = Object.keys(maxLengths).map(
        i => {
          return { width: maxLengths[i] + 50 };
        }
      );
      for (
        let i = 0;
        i < Object.values(this.#data).length;
        i++
      ) {
        const cellAddress = utils.encode_cell({
          r: 0,
          c: i,
        });
        if (worksheet[cellAddress]?.s)
          worksheet[cellAddress].s = {
            font: { bold: true },
          };
      }
      utils.book_append_sheet(
        wb,
        worksheet,
        "Formulário Exportado",
        true
      );
      const date = new Date(),
        fullDate = `d${date.getDate()}m${
          date.getMonth() + 1
        }y${date.getFullYear()}`;
      if (namer) {
        const writeNamedFile = (
          namer: Element | string
        ): void => {
          if (
            namer instanceof HTMLInputElement ||
            namer instanceof HTMLSelectElement ||
            namer instanceof HTMLTextAreaElement
          )
            writeFile(
              wb,
              `data_${context}_${
                namer.value
                  .trim()
                  .replaceAll(/[ÁÀÄÂÃáàäâã]/g, "a")
                  .replaceAll(/[ÉÈËÊéèëê]/g, "e")
                  .replaceAll(/[ÓÒÖÔÕóòöôõ]/g, "o")
                  .replaceAll(/[ÚÙÜÛúùüû]/g, "u")
                  .toLowerCase() ?? "noName"
              }_form_${fullDate}.xlsx`,
              {
                bookType: "xlsx",
                bookSST: false,
                compression: false,
                cellStyles: true,
                type: "buffer",
              }
            );
          else if (namer instanceof HTMLOutputElement)
            writeFile(
              wb,
              `data_${context}_${
                namer.innerText
                  .trim()
                  .replaceAll(/[ÁÀÄÂÃáàäâã]/g, "a")
                  .replaceAll(/[ÉÈËÊéèëê]/g, "e")
                  .replaceAll(/[ÓÒÖÔÕóòöôõ]/g, "o")
                  .replaceAll(/[ÚÙÜÛúùüû]/g, "u")
                  .toLowerCase() ?? "noName"
              }_form_${fullDate}.xlsx`,
              {
                bookType: "xlsx",
                bookSST: false,
                compression: false,
                cellStyles: true,
                type: "buffer",
              }
            );
          else if (namer instanceof HTMLElement)
            writeFile(
              wb,
              `data_${context}_${
                namer.id?.trim() ||
                namer.dataset.xls?.replaceAll(
                  /\s/g,
                  "__"
                ) ||
                namer.dataset.title?.replaceAll(
                  /\s/g,
                  "__"
                ) ||
                namer.tagName
              }form_${fullDate}.xlsx`
            );
          else if (typeof namer === "string")
            writeFile(
              wb,
              `data_${context}_${namer
                .trim()
                .replace(
                  /\s/g,
                  "__"
                )}_form_${fullDate}.xlsx`
            );
        };
        if (typeof namer === "string") {
          if ((scope ?? document).querySelector(namer))
            writeNamedFile(
              (scope ?? document).querySelector(namer)!
            );
          else writeNamedFile(namer);
        }
        if (typeof namer === "object")
          writeNamedFile(namer);
      } else
        writeFile(
          wb,
          `data_${context}form_${fullDate}.xlsx`,
          {
            bookType: "xlsx",
            bookSST: false,
            compression: false,
            cellStyles: true,
            type: "buffer",
          }
        );
      Object.keys(this.#data.imageEls).length > 0 &&
        this.#processImages(this.#data.imageEls, context);
    } catch (error) {
      return;
    }
  }
  async #processImages(
    els: {
      [k: string]: HTMLCanvasElement | HTMLInputElement;
    },
    context: string = ""
  ) {
    let canvasBlobs: { [k: string]: Blob | null } = {};
    for (const el of Object.entries(els)) {
      try {
        if (el instanceof HTMLCanvasElement) {
          const res = await fetch(el.toDataURL());
          canvasBlobs[
            el.id ||
              el.className.replace(/\s/g, "__") ||
              el.tagName
          ] = await res.blob();
        } else if (
          el instanceof HTMLInputElement &&
          el.type === "file"
        ) {
          const file = el.files?.[0];
          if (file)
            canvasBlobs[
              el.id ||
                el.name ||
                el.className.replace(/\s/g, "__") ||
                el.tagName
            ] = file;
        }
      } catch (e) {
        return;
      }
    }
    const zip = new JSZip();
    for (const [idf, blob] of Object.entries(canvasBlobs)) {
      try {
        if (!blob) continue;
        const fileName = `image_${context || idf}.png`;
        zip.file(fileName, blob);
      } catch (e) {
        continue;
      }
    }
    try {
      const zipBlob = await zip.generateAsync({
        type: "blob",
      });
      const zipLink = document.createElement("a");
      zipLink.href = URL.createObjectURL(zipBlob);
      zipLink.download = `images_${context}.zip`;
      document.body.appendChild(zipLink);
      zipLink.click();
      document.body.removeChild(zipLink);
    } catch (e) {
      return;
    }
  }
}
