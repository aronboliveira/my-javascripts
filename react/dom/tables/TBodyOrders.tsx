"use client";
import OrderRow from "./OrderRow";
import { useEffect, useRef } from "react";
import {
  htmlElementNotFound,
  parseFinite,
} from "../../lib/handlers/handlersErrors";
import { createRoot } from "react-dom/client";
import { TbodyProps } from "../../lib/declarations/interfaces";
import { ErrorBoundary } from "react-error-boundary";
import GenericErrorComponent from "../errors/GenericErrorComponent";
import { handleRemoveOrder } from "./OrderRemove";

export const tbodyProps: TbodyProps = {
  root: undefined,
  currentRef: undefined,
  primaryRowRoot: undefined,
  roots: {},
};
export default function TBodyOrders(): JSX.Element {
  const tbodyRef = useRef<HTMLTableSectionElement | null>(null);
  useEffect(() => {
    try {
      if (!(tbodyRef.current instanceof HTMLTableSectionElement))
        throw htmlElementNotFound(
          tbodyRef.current,
          `Reference of Table body for orders`,
          ["HTMLTableSectionElement"],
        );
      if (!tbodyProps.root || !tbodyProps.root._internalRoot)
        tbodyProps.root = createRoot(tbodyRef.current);
      tbodyProps.currentRef = tbodyRef.current;
      const tbodyInterv = setInterval(interv => {
        try {
          const tab =
            document.getElementById("productsTab") ??
            document.querySelector('table[id*="products"]') ??
            Array.from(document.querySelectorAll("table")).at(-1);
          if (!(tab instanceof HTMLTableElement))
            throw htmlElementNotFound(tab, `Validation of Table fetched`, [
              "HTMLTableElement",
            ]);
          const tbody =
            tab.querySelector("tbody") ??
            Array.from(document.querySelectorAll("tbody")).at(-1);
          if (!(tbody instanceof HTMLTableSectionElement))
            throw htmlElementNotFound(
              tbody,
              `Validation of Table Body fetched`,
              ["HTMLTableSectionElement"],
            );
          if (
            tbody.rows.length === 0 ||
            (tbody &&
              Array.from(tbody.rows).every(
                row =>
                  !row.querySelector("td") ||
                  parseFinite(
                    getComputedStyle(row).height.replace("px", "").trim(),
                  ) <= 0,
              ))
          ) {
            if (!tbodyProps.root || !tbodyProps.root._internalRoot)
              tbodyProps.root = createRoot(tbody);
            tbodyProps.root.render(<OrderRow id='order_ph' title='' />);
            setTimeout(() => {
              if (
                tbody.rows.length === 0 ||
                (tbody &&
                  Array.from(tbody.rows).every(
                    row =>
                      !row.querySelector("td") ||
                      parseFinite(
                        getComputedStyle(row).height.replace("px", "").trim(),
                      ) <= 0,
                  ))
              ) {
                if (!tbodyProps.root || !tbodyProps.root._internalRoot)
                  tbodyProps.root = createRoot(tbody);
                if (
                  tbodyProps.root &&
                  document.getElementById("tbodyOrders") &&
                  document.getElementById("tbodyOrders")!.querySelectorAll("tr")
                    .length > 0
                )
                  tbodyProps.root.unmount();
                if (!tab) {
                  clearInterval(interv);
                  return;
                }
                if (document.getElementById("tbodyOrders")) return;
                tbodyProps.root = undefined;
                const replaceTbody = document.createElement("tbody");
                replaceTbody.id = `tbodyOrders`;
                tab.append(replaceTbody);
                tbodyProps.ref = replaceTbody;
                tbodyProps.currentRef = replaceTbody;
                if (!tbodyProps.root || !tbodyProps.root._internalRoot)
                  tbodyProps.root = createRoot(replaceTbody);
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
              }
            }, 200);
            if (
              tbody.rows.length === 0 ||
              (tbody &&
                Array.from(tbody.rows).every(
                  row =>
                    !row.querySelector("td") ||
                    parseFinite(
                      getComputedStyle(row).height.replace("px", "").trim(),
                    ) <= 0,
                ))
            )
              return;
            if (document.getElementById("total"))
              document.getElementById("total")!.innerText = " R$ 0,00";
          }
          if (
            document
              .getElementById("tbodyOrders")
              ?.querySelector("#tr_order_ph") ||
            (Array.from(
              document
                .getElementById("tbodyOrders")
                ?.querySelectorAll(".celName") ?? [],
            ).every(
              cel => cel instanceof HTMLElement && cel.innerText === "",
            ) &&
              Array.from(
                document
                  .getElementById("tbodyOrders")
                  ?.querySelectorAll(".celQuant") ?? [],
              ).every(
                cel => cel instanceof HTMLElement && cel.innerText === "0",
              ) &&
              document.getElementById("total"))
          )
            document.getElementById("total")!.innerText = " R$ 0,00";
        } catch (e) {
          console.error(
            `Error executing interval in ${new Date().getTime()} for Products table:\n${
              (e as Error).message
            }`,
          );
          clearInterval(interv);
          interv && setTimeout(() => clearInterval(interv), 1000);
        }
      }, 200);
      const rowInterv = setInterval(interv => {
        try {
          const tab =
            document.getElementById("productsTab") ??
            document.querySelector('table[id*="products"]') ??
            Array.from(document.querySelectorAll("table")).at(-1);
          if (!(tab instanceof HTMLTableElement))
            throw htmlElementNotFound(tab, `Validation of Table fetched`, [
              "HTMLTableElement",
            ]);
          const tbody =
            tab.querySelector("tbody") ??
            Array.from(document.querySelectorAll("tbody")).at(-1);
          if (!(tbody instanceof HTMLTableSectionElement))
            throw htmlElementNotFound(
              tbody,
              `Validation of Table Body fetched`,
              ["HTMLTableSectionElement"],
            );
          Array.from(tbody.querySelectorAll("tr")).forEach((row, r) => {
            try {
              if (!(row instanceof HTMLTableRowElement))
                throw htmlElementNotFound(row, `Validation of row`, [
                  "HTMLTableRowElement",
                ]);
              if (
                row.innerHTML === "" ||
                parseFinite(
                  getComputedStyle(row).height.replace("px", "").trim(),
                ) <= 0
              ) {
                const celQuant = row.querySelector(".celQuant");
                const tabRemove = row.querySelector(".tabRemove");
                if (
                  celQuant instanceof HTMLElement &&
                  celQuant.innerText !== "0"
                )
                  tabRemove instanceof HTMLElement
                    ? handleRemoveOrder(tabRemove)
                    : handleRemoveOrder(celQuant);
                if (
                  !tbodyProps.roots[`${row.id}`] ||
                  !tbodyProps.roots[`${row.id}`]._internalRoot
                )
                  tbodyProps.roots[`${row.id}`] = createRoot(row);
                const rowId = row.id;
                tbodyProps.roots[`${row.id}`].unmount();
                setTimeout(() => {
                  if (
                    document.getElementById(`${rowId}`)?.innerHTML === "" ||
                    parseFinite(
                      getComputedStyle(row).height.replace("px", "").trim(),
                    ) <= 0
                  ) {
                    const retryRow = document.getElementById(`${rowId}`) ?? row;
                    tbodyProps.roots[`${rowId || retryRow.id}`] =
                      createRoot(retryRow);
                    tbodyProps.roots[`${rowId || retryRow.id}`].unmount();
                    document.getElementById(`${row.id}`)?.remove();
                  }
                }, 200);
              }
            } catch (e) {
              console.error(
                `Error executing iteration ${r} for checking tbody rows:\n${
                  (e as Error).message
                }`,
              );
            }
          });
        } catch (e) {
          console.error(
            `Error executing interval for rows:\n${(e as Error).message}`,
          );
          clearInterval(interv);
          interv && setTimeout(() => clearInterval(interv), 1000);
        }
      }, 2000);
      return () => {
        clearInterval(tbodyInterv);
        clearInterval(rowInterv);
      };
    } catch (e) {
      console.error(
        `Error executing useEffect for TableOrders: ${(e as Error).message}`,
      );
    }
  }, [tbodyRef]);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <GenericErrorComponent message='Error rendering Table body' />
      )}>
      <tbody ref={tbodyRef} id='tbodyOrders'>
        <OrderRow key={"order_ph"} id={"order_ph"} quantity={"0"} />
      </tbody>
    </ErrorBoundary>
  );
}
