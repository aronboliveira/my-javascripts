import { OrderProps } from "../../lib/declarations/interfaces";
import {
  baseFestValues,
  baseMappedValues,
  baseValues,
  factorFestValues,
  factorMaps,
  roundToTenth,
} from "../../lib/handlers/handlersCmn";
import {
  elementNotFound,
  htmlElementNotFound,
  parseFinite,
} from "../../lib/handlers/handlersErrors";
import { createRoot } from "react-dom/client";
import { tbodyProps } from "./TBodyOrders";
import OrderRow from "./OrderRow";

export default function OrderRemove(props: OrderProps): JSX.Element {
  return (
    <td className='celRemove' style={{ paddingRight: "3.2rem" }}>
      <button
        type='button'
        className='biBtn opBtn opBtnRemove tabRemove'
        id={`btnTabSubt__${document.querySelectorAll(".tabRemove").length}-${
          props.id
        }`}
        aria-hidden='false'
        onClick={ev => handleRemoveOrder(ev.currentTarget)}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          className='bi bi-dash-square-fill'
          viewBox='0 0 16 16'>
          <path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1'></path>
        </svg>
      </button>
    </td>
  );
}

export function handleRemoveOrder(ref: HTMLElement): void {
  try {
    const total = document.getElementById("total");
    if (!(total instanceof HTMLElement))
      throw elementNotFound(total, `validation of Total Price Element`, [
        "HTMLElement",
      ]);
    const iniPrice = total.innerText;
    const relTbody = ref.closest("tbody");
    if (!(relTbody instanceof HTMLTableSectionElement))
      throw elementNotFound(relTbody, `Validation of Related Table Body`, [
        "HTMLTableSectionElement",
      ]);
    if (relTbody.rows.length === 1 && relTbody.rows[0].id === "tr_order_ph") {
      const phTitle = relTbody.rows[0].querySelector(".outp_orderTitle");
      if (phTitle instanceof HTMLElement) phTitle.innerText = "";
      total.innerText = "R$ 0,00";
      tbodyProps.root.render(<OrderRow id='order_ph' title='' />);
      setTimeout(() => {
        if (!document.getElementById("tr_order_ph")) {
          const tab =
            document.getElementById("productsTab") ??
            document.querySelector('table[id*="products"]') ??
            Array.from(document.querySelectorAll("table")).at(-1);
          if (!(tab instanceof HTMLTableElement))
            throw htmlElementNotFound(tab, `Validation of Table fetched`, [
              "HTMLTableElement",
            ]);
          tbodyProps.root = undefined;
          const replaceTbody = document.createElement("tbody");
          replaceTbody.id = `tbodyOrders`;
          tab.append(replaceTbody);
          tbodyProps.ref = replaceTbody;
          tbodyProps.currentRef = replaceTbody;
          if (!tbodyProps.root || !tbodyProps.root._internalRoot)
            tbodyProps.root = createRoot(replaceTbody);
          tbodyProps.root.render(<OrderRow id='order_ph' title='' />);
        }
      }, 500);
      return;
    }
    for (const row of relTbody.rows) {
      try {
        const celQuant = row.querySelector(".celQuant");
        const celName = row.querySelector(".celName");
        if (!(celQuant instanceof HTMLElement))
          throw elementNotFound(
            celQuant,
            `validation of Relative Cell for Quantity`,
            ["HTMLElement"],
          );
        if (!(celName instanceof HTMLElement))
          throw elementNotFound(
            celName,
            `Validation of Relative Cell for Name`,
            ["HTMLElement"],
          );
        if (
          celQuant.querySelector("output")?.innerText === "0" ||
          celQuant.innerText === "0" ||
          (relTbody.rows.length === 1 &&
            relTbody.rows[0].querySelector(".outp_orderTitle") instanceof
              HTMLElement &&
            (relTbody.rows[0].querySelector(".outp_orderTitle") as HTMLElement)
              .innerText !== "" &&
            relTbody.rows[0].querySelector(".outp_orderQuant") instanceof
              HTMLElement &&
            (relTbody.rows[0].querySelector(".outp_orderQuant") as HTMLElement)
              .innerText === "0" &&
            total.innerText.trim() === "R$ 0,00")
        ) {
          if (row === relTbody.rows[0] && relTbody.rows.length === 1) {
            if (!tbodyProps.root || !tbodyProps.root._internalRoot)
              tbodyProps.root = createRoot(relTbody);
            tbodyProps.root.render(<OrderRow id='order_ph' title='' />);
            setTimeout(() => {
              if (!document.getElementById("tr_order_ph")) {
                const tab =
                  document.getElementById("productsTab") ??
                  document.querySelector('table[id*="products"]') ??
                  Array.from(document.querySelectorAll("table")).at(-1);
                if (!(tab instanceof HTMLTableElement))
                  throw htmlElementNotFound(
                    tab,
                    `Validation of Table fetched`,
                    ["HTMLTableElement"],
                  );
                tbodyProps.root = undefined;
                const replaceTbody = document.createElement("tbody");
                replaceTbody.id = `tbodyOrders`;
                tab.append(replaceTbody);
                tbodyProps.ref = replaceTbody;
                tbodyProps.currentRef = replaceTbody;
                if (!tbodyProps.root || !tbodyProps.root._internalRoot)
                  tbodyProps.root = createRoot(replaceTbody);
                tbodyProps.root.render(<OrderRow id='order_ph' title='' />);
              }
            }, 500);
            return;
          } else {
            if (
              !tbodyProps.roots[`${row.id}`] ||
              !tbodyProps.roots[`${row.id}`]._internalRoot
            )
              tbodyProps.roots[`${row.id}`] = createRoot(row);
            tbodyProps.roots[`${row.id}`].unmount();
            setTimeout(() => {
              if (
                row.innerHTML === "" ||
                row.querySelector(".outp_orderQuant")?.innerHTML === "0" ||
                parseFinite(
                  getComputedStyle(row).height.replace("px", "").trim(),
                ) <= 0
              ) {
                tbodyProps.roots[`${row.id}`] = undefined;
                tbodyProps.roots[`${row.id}`] = createRoot(row);
                tbodyProps.roots[`${row.id}`].unmount();
                document.getElementById(`${row.id}`)?.remove();
              }
            }, 200);
          }
        }
        if (celName.innerText === "" && celQuant.innerText !== "0") {
          console.warn(`Failed to form name. Trying recovery...`);
          if (!(/li-/gi.test(row.id) && /__/gi.test(row.id)))
            throw new Error(`Failed to validated product name in row id`);
          const productIdx = row.id.slice(
            row.id.indexOf("__") + 2,
            row.id.indexOf("__") + 4,
          );
          const mainMenu = document.getElementById("mainMenu");
          if (
            !(
              mainMenu instanceof HTMLMenuElement ||
              mainMenu instanceof HTMLOListElement ||
              mainMenu instanceof HTMLUListElement ||
              mainMenu instanceof HTMLDListElement
            )
          )
            throw elementNotFound(
              mainMenu,
              `Validation of Main Menu instance`,
              [
                "HTMLMenuElement | HTMLOListElement | HTMLUListElement | HTMLDListElement",
              ],
            );
          const recoveredItem = Array.from(mainMenu.querySelectorAll("li"))
            .filter(
              item =>
                item instanceof HTMLLIElement &&
                item.classList.contains("divProduct") &&
                /__[0-9]/g.test(item.id),
            )
            .find(item => {
              return (
                productIdx ===
                item.id.slice(
                  item.id.indexOf("__") + 2,
                  item.id.indexOf("__") + 4,
                )
              );
            });
          if (!recoveredItem)
            throw new Error(
              `Failed to recover name when trying to fetch item element.`,
            );
          let itemName = "",
            opt = "";
          const itemNameEl = recoveredItem.querySelector(".divProductName");
          if (itemNameEl instanceof HTMLElement) {
            const strongItemNameEl = itemNameEl.querySelector("strong");
            if (strongItemNameEl instanceof HTMLElement)
              itemName = strongItemNameEl.innerText;
            else
              itemName = itemNameEl.innerText
                .trim()
                .replaceAll(/[\r\n\t]/g, "");
          } else {
            console.warn(`Failed to fetch Product Name Element`);
            itemName = recoveredItem.id
              .replaceAll("div-", "")
              .slice(0, recoveredItem.id.indexOf("__"))
              .replaceAll("-", "");
          }
          if (/li-/gi.test(row.id) && /__/gi.test(row.id))
            opt = celName.id.slice(
              celName.id.indexOf("li-") + 3,
              celName.id.indexOf("__"),
            );
          else
            console.warn(
              `Failed to read option for product using cell for name id.`,
            );
          if (itemName !== "") {
            const replaceOutp = document.createElement("output");
            replaceOutp.classList.add("outp_orderTitle");
            replaceOutp.id = `titleOutp_${celName.id.slice(
              celName.id.indexOf("li-" + 3),
            )}`;
            replaceOutp.innerText = `${itemName} ${opt}`;
            celName.innerHTML = ``;
            celName.append(replaceOutp);
          } else
            console.error(
              `Failed to recover name after item element data check.`,
            );
        }
      } catch (e) {
        console.error(
          `Error executing 0 check for ${
            row.id || row.classList.toString() || row.tagName
          }:${(e as Error).message}`,
        );
      }
    }
    const relTr = ref.closest("tr");
    if (!(relTr instanceof HTMLTableRowElement))
      throw elementNotFound(relTr, `Validation of Related Table Row`, [
        "HTMLTableRowElement",
      ]);
    const relQuant = relTr.querySelector(".outp_orderQuant");
    if (!(relQuant instanceof HTMLElement))
      throw elementNotFound(
        relQuant,
        `Validation of related Quantity Output Element`,
        ["HTMLElement"],
      );
    const relOutp = relTr.querySelector(".outp_orderTitle");
    if (!(relOutp instanceof HTMLElement))
      throw elementNotFound(
        relOutp,
        `Validation of Related Title Output Element`,
        ["HTMLElement"],
      );
    if (relOutp.innerText === "") {
      console.warn(
        `No product name in output. Aborting procedure for callback in ${
          ref.id ||
          (ref instanceof HTMLButtonElement && ref.name) ||
          ref.tagName
        }`,
      );
      return;
    }
    const normText = relOutp.innerText.trim().toLowerCase();
    let subopt = "",
      product = "",
      productMainPart = "",
      opt = "",
      productValue: number | undefined = 0,
      diffPrice = 0,
      factor: number | undefined = 1,
      correctionFactor = 1;
    if (/\(/g.test(normText) && /\)/g.test(normText)) {
      subopt = normText.slice(normText.indexOf("(") + 1, normText.indexOf(")"));
      if (subopt === "média") subopt = "médio";
      if (subopt === "pequena") subopt = "pequeno";
      product = normText.slice(0, normText.indexOf("(")).trim();
    } else product = normText;
    if (/bolo caseiro/gi.test(product)) productMainPart = "bolo caseiro";
    else if (/bolo de festa/gi.test(product)) productMainPart = "bolo de festa";
    else if (/bolo de pote/gi.test(product)) productMainPart = "bolo de pote";
    else if (/brownie recheado/gi.test(product)) {
      if (/mini/gi.test(product)) productMainPart = "mini brownie recheado";
      else productMainPart = "brownie recheado";
    } else if (/brownie simples/gi.test(product))
      productMainPart = "brownie simples";
    else if (/cookie recheado/gi.test(product))
      productMainPart = "cookie recheado";
    else if (/copo da felicidade/gi.test(product))
      productMainPart = "copo da felicidade";
    else if (/mini cookie/gi.test(product)) productMainPart = "mini cookie";
    else if (/geleia artesanal/gi.test(product))
      productMainPart = "geleia artesanal";
    else if (/palha/gi.test(product)) productMainPart = "palha italiana";
    else if (/pav[eê] de pote/gi.test(product))
      productMainPart = "pave de pote";
    else if (/torta gelada/gi.test(product)) productMainPart = "torta";
    else if (/taça recheada/gi.test(product)) productMainPart = "taça recheada";
    else if (/travessa recheada/gi.test(product))
      productMainPart = "travessa recheada";
    opt = product
      .replace(productMainPart.replace("pave", "pavê"), "")
      .replace("de ", "")
      .trim();
    if (productMainPart === "bolo de festa") {
      productValue = baseFestValues.get(opt);
      if (!productValue && /ê/gi.test(opt))
        productValue = baseFestValues.get(opt.replaceAll("ê", "e"));
      if (!productValue)
        throw new Error(`Failed to fetch product value in map`);
      if (/ fit|fit /gi.test(opt)) productValue *= 1.1;
      const factorMap = factorFestValues.get(subopt);
      if (!factorMap)
        throw new Error(`Failed to fetch factor map for bolo de festa product`);
      factor = factorMap.get(opt);
      if (!factor)
        throw new Error(`Failed to get factor for product with options`);
      diffPrice =
        parseFinite(
          `${total.innerText
            .replace("R$", "")
            .replaceAll(" ", "")
            .slice(0, -3)}.${total.innerText.slice(-2)}`.replaceAll(",", ""),
        ) -
        productValue * factor;
      if (diffPrice <= 0 || !Number.isFinite(diffPrice)) {
        console.warn(
          `Failed to calculate Price after difference. Defaulting value.`,
        );
        diffPrice = 0;
      }
      total.innerText = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2,
      }).format(Math.floor(parseFinite(roundToTenth(diffPrice, 1, 2, true))));
    } else {
      if (productMainPart === "bolo caseiro") {
        switch (subopt) {
          case "grande":
            correctionFactor = 0.75;
            break;
          default:
            correctionFactor = 1;
        }
        if (/red velvet/gi.test(opt)) {
          switch (subopt) {
            case "grande":
              correctionFactor = 1;
              break;
            default:
              correctionFactor = 1.335;
          }
        }
      }
      productValue = baseValues.get(productMainPart);
      if (!productValue && /ê/gi.test(productMainPart))
        productValue = baseValues.get(productMainPart.replaceAll("ê", "e"));
      if (!productValue)
        throw new Error(`Failed to fetch product value in map`);
      if (productValue > 0) {
        if (subopt) {
          factor = factorMaps.get(subopt);
          if (!factor)
            throw new Error(`Failed to get factor for product with options`);
        }
        if (/ fit|fit /gi.test(opt)) productValue *= 1.1;
        diffPrice =
          parseFinite(
            `${total.innerText
              .replace("R$", "")
              .replaceAll(" ", "")
              .slice(0, -3)}.${total.innerText.slice(-2)}`.replaceAll(",", ""),
          ) -
          productValue * factor * correctionFactor;
        if (diffPrice <= 0 || !Number.isFinite(diffPrice)) {
          console.warn(
            `Failed to calculate Price after difference. Defaulting value.`,
          );
          diffPrice = 0;
        }
        total.innerText = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          maximumFractionDigits: 2,
        }).format(Math.floor(parseFinite(roundToTenth(diffPrice, 1, 2, true))));
      } else if (productValue <= 0) {
        if (subopt) {
          factor = factorMaps.get(subopt);
          if (!factor)
            throw new Error(`Failed to get factor for product with options`);
        }
        let mappedProductValue = baseMappedValues.get(productMainPart);
        if (!mappedProductValue && /ê/gi.test(productMainPart))
          mappedProductValue = baseMappedValues.get(
            productMainPart.replaceAll("ê", "e"),
          );
        if (!mappedProductValue)
          throw new Error(`Failed to fetch Mapped Product value`);
        if (opt === "")
          throw new Error(
            `Failed to assign option string for ${productMainPart}. Mapped products need to have an option value for mapping.`,
          );
        let optValue = mappedProductValue.get(opt);
        if (!optValue) throw new Error(`Failed to fetch Option value.`);
        if (/ fit|fit /gi.test(opt)) optValue *= 1.1;
        diffPrice =
          parseFinite(
            `${total.innerText
              .replace("R$", "")
              .replaceAll(" ", "")
              .slice(0, -3)}.${total.innerText.slice(-2)}`.replaceAll(",", ""),
          ) -
          optValue * factor;
        if (diffPrice <= 0 || !Number.isFinite(diffPrice)) {
          console.warn(
            `Failed to calculate Price after difference. Defaulting value.`,
          );
          diffPrice = 0;
        }
        total.innerText = Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          maximumFractionDigits: 2,
        }).format(Math.floor(parseFinite(roundToTenth(diffPrice, 1, 2, true))));
      }
    }
    if (
      /NaN/gi.test(total.innerText) ||
      /infinity/gi.test(total.innerText) ||
      /-/g.test(total.innerText) ||
      parseFinite(
        `${total.innerText
          .replace("R$", "")
          .trim()
          .slice(0, -3)}.${total.innerText.slice(-2).trim()}`,
      ) >=
        parseFinite(
          `${iniPrice.replace("R$", "").trim().slice(0, -3)}.${iniPrice
            .slice(-2)
            .trim()}`,
        )
    ) {
      console.warn(
        `Invalid value given to Total Price Element inner text. Returning to previous value and aborting process.`,
      );
      total.innerText = iniPrice;
      const tbody = document.getElementById("tbodyOrders");
      if (total.innerText.trim() === "R$ 0,00" && tbody) {
        if (!tbodyProps.root || !tbodyProps.root._internalRoot)
          tbodyProps.root = createRoot(tbody);
        tbodyProps.root.render(<OrderRow id='order_ph' title='' />);
        setTimeout(() => {
          if (!document.getElementById("tr_order_ph")) {
            const tab =
              document.getElementById("productsTab") ??
              document.querySelector('table[id*="products"]') ??
              Array.from(document.querySelectorAll("table")).at(-1);
            if (!(tab instanceof HTMLTableElement))
              throw htmlElementNotFound(tab, `Validation of Table fetched`, [
                "HTMLTableElement",
              ]);
            tbodyProps.root = undefined;
            const replaceTbody = document.createElement("tbody");
            replaceTbody.id = `tbodyOrders`;
            tab.append(replaceTbody);
            tbodyProps.ref = replaceTbody;
            tbodyProps.currentRef = replaceTbody;
            if (!tbodyProps.root || !tbodyProps.root._internalRoot)
              tbodyProps.root = createRoot(replaceTbody);
            tbodyProps.root.render(<OrderRow id='order_ph' title='' />);
          }
        }, 500);
      }
      return;
    }
    const quant = parseFinite(
      relQuant.innerText.replaceAll(/[^0-9]/g, ""),
      "int",
    );
    if (!Number.isFinite(quant)) {
      total.innerText = iniPrice;
      throw new Error(
        `Quantity number not finite. Reverting and aborting process.`,
      );
    }
    if (quant <= 1) {
      relQuant.innerText = `0`;
      if (relTr === relTbody.rows[0] && relTbody.rows.length === 1) {
        if (!tbodyProps.root || !tbodyProps.root._internalRoot)
          tbodyProps.root = createRoot(relTbody);
        tbodyProps.root.render(<OrderRow id='order_ph' title='' />);
        setTimeout(() => {
          if (!document.getElementById("tr_order_ph")) {
            const tab =
              document.getElementById("productsTab") ??
              document.querySelector('table[id*="products"]') ??
              Array.from(document.querySelectorAll("table")).at(-1);
            if (!(tab instanceof HTMLTableElement))
              throw htmlElementNotFound(tab, `Validation of Table fetched`, [
                "HTMLTableElement",
              ]);
            tbodyProps.root = undefined;
            const replaceTbody = document.createElement("tbody");
            replaceTbody.id = `tbodyOrders`;
            tab.append(replaceTbody);
            tbodyProps.ref = replaceTbody;
            tbodyProps.currentRef = replaceTbody;
            if (!tbodyProps.root || !tbodyProps.root._internalRoot)
              tbodyProps.root = createRoot(replaceTbody);
            tbodyProps.root.render(<OrderRow id='order_ph' title='' />);
          }
        }, 500);
        return;
      } else {
        if (
          !tbodyProps.roots[`${relTr.id}`] ||
          !tbodyProps.roots[`${relTr.id}`]._internalRoot
        )
          tbodyProps.roots[`${relTr.id}`] = createRoot(relTr);
        tbodyProps.roots[`${relTr.id}`].unmount();
        setTimeout(() => {
          if (
            relTr.innerHTML === "" ||
            parseFinite(
              getComputedStyle(relTr).height.replace("px", "").trim(),
            ) <= 0
          ) {
            tbodyProps.roots[`${relTr.id}`] = undefined;
            tbodyProps.roots[`${relTr.id}`] = createRoot(relTr);
            tbodyProps.roots[`${relTr.id}`].unmount();
            relTr.id !== "" &&
              document.getElementById(relTr.id) &&
              relTr.remove();
          }
        }, 200);
      }
    } else relQuant.innerText = `${quant - 1}`;
    for (const row of relTbody.rows) {
      try {
        const celQuant = row.querySelector(".celQuant");
        const celName = row.querySelector(".celName");
        if (!(celQuant instanceof HTMLElement)) {
          if (document.getElementById(`${row.id}`)) {
            console.warn(`Failed to fetch cel for quantity.`);
            return;
          } else return;
        }
        if (!(celName instanceof HTMLElement)) {
          if (document.getElementById(`${row.id}`))
            throw elementNotFound(
              celName,
              `Validation of Relative Cell for Name`,
              ["HTMLElement"],
            );
          else return;
        }
        if (celQuant.innerText === "0") {
          if (row === relTbody.rows[0] && relTbody.rows.length === 1) {
            if (!tbodyProps.root || !tbodyProps.root._internalRoot)
              tbodyProps.root = createRoot(relTbody);
            tbodyProps.root.render(<OrderRow id='order_ph' title='' />);
            setTimeout(() => {
              if (!document.getElementById("tr_order_ph")) {
                const tab =
                  document.getElementById("productsTab") ??
                  document.querySelector('table[id*="products"]') ??
                  Array.from(document.querySelectorAll("table")).at(-1);
                if (!(tab instanceof HTMLTableElement))
                  throw htmlElementNotFound(
                    tab,
                    `Validation of Table fetched`,
                    ["HTMLTableElement"],
                  );
                tbodyProps.root = undefined;
                const replaceTbody = document.createElement("tbody");
                replaceTbody.id = `tbodyOrders`;
                tab.append(replaceTbody);
                tbodyProps.ref = replaceTbody;
                tbodyProps.currentRef = replaceTbody;
                if (!tbodyProps.root || !tbodyProps.root._internalRoot)
                  tbodyProps.root = createRoot(replaceTbody);
                tbodyProps.root.render(<OrderRow id='order_ph' title='' />);
              }
            }, 500);
            return;
          } else {
            if (
              !tbodyProps.roots[`${relTr.id}`] ||
              !tbodyProps.roots[`${relTr.id}`]._internalRoot
            )
              tbodyProps.roots[`${relTr.id}`] = createRoot(relTr);
            tbodyProps.roots[`${relTr.id}`].unmount();
            setTimeout(() => {
              if (
                relTr.innerHTML === "" ||
                parseFinite(
                  getComputedStyle(relTr).height.replace("px", "").trim(),
                ) <= 0
              ) {
                tbodyProps.roots[`${relTr.id}`] = undefined;
                tbodyProps.roots[`${relTr.id}`] = createRoot(relTr);
                tbodyProps.roots[`${relTr.id}`].unmount();
              }
            }, 200);
          }
        }
        if (celName.innerText === "" && celQuant.innerText !== "0") {
          console.warn(`Failed to form name. Trying recovery...`);
          if (!(/li-/gi.test(row.id) && /__/gi.test(row.id)))
            throw new Error(`Failed to validated product name in row id`);
          const productIdx = row.id.slice(
            row.id.indexOf("__") + 2,
            row.id.indexOf("__") + 4,
          );
          const mainMenu = document.getElementById("mainMenu");
          if (
            !(
              mainMenu instanceof HTMLMenuElement ||
              mainMenu instanceof HTMLOListElement ||
              mainMenu instanceof HTMLUListElement ||
              mainMenu instanceof HTMLDListElement
            )
          )
            throw elementNotFound(
              mainMenu,
              `Validation of Main Menu instance`,
              [
                "HTMLMenuElement | HTMLOListElement | HTMLUListElement | HTMLDListElement",
              ],
            );
          const recoveredItem = Array.from(mainMenu.querySelectorAll("li"))
            .filter(
              item =>
                item instanceof HTMLLIElement &&
                item.classList.contains("divProduct") &&
                /__[0-9]/g.test(item.id),
            )
            .find(item => {
              return (
                productIdx ===
                item.id.slice(
                  item.id.indexOf("__") + 2,
                  item.id.indexOf("__") + 4,
                )
              );
            });
          if (!recoveredItem)
            throw new Error(
              `Failed to recover name when trying to fetch item element.`,
            );
          let itemName = "";
          const itemNameEl = recoveredItem.querySelector(".divProductName");
          if (itemNameEl instanceof HTMLElement) {
            const strongItemNameEl = itemNameEl.querySelector("strong");
            if (strongItemNameEl instanceof HTMLElement)
              itemName = strongItemNameEl.innerText;
            else
              itemName = itemNameEl.innerText
                .trim()
                .replaceAll(/[\r\n\t]/g, "");
          } else {
            console.warn(`Failed to fetch Product Name Element`);
            itemName = recoveredItem.id
              .replaceAll("div-", "")
              .slice(0, recoveredItem.id.indexOf("__"))
              .replaceAll("-", "");
          }
          if (itemName !== "") {
            const replaceOutp = document.createElement("output");
            replaceOutp.classList.add("outp_orderTitle");
            replaceOutp.id = `titleOutp_${celName.id.slice(
              celName.id.indexOf("li-" + 3),
            )}`;
            replaceOutp.innerText = `${itemName} ${opt}`;
            celName.innerHTML = ``;
            celName.append(replaceOutp);
          } else
            console.error(
              `Failed to recover name after item element data check.`,
            );
        }
      } catch (e) {
        setTimeout(() => {
          document.getElementById(`${row.id}`) &&
            console.error(
              `Error executing check for ${
                row.id || row.classList.toString() || row.tagName
              }:${(e as Error).message}`,
            );
        }, 500);
      }
    }
  } catch (e) {
    console.error(
      `Error executing callback for ${
        ref.id || ref.classList.toString() || ref.tagName
      }:${(e as Error).message}`,
    );
  }
}
