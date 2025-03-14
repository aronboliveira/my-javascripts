"use client";

import {
  elementNotFound,
  htmlElementNotFound,
} from "../../lib/handlers/handlersErrors";
import { createRoot } from "react-dom/client";
import { tbodyProps } from "../tables/TBodyOrders";
import OrderRow from "../tables/OrderRow";

export default function ResetTabBtn(): JSX.Element {
  return (
    <button
      id="resetTabBtn"
      className="btn btn-secondary btn-rounded"
      onClick={(ev) => {
        try {
          const tBody =
            document.getElementById("tbodyOrder") ??
            ev.currentTarget.closest("table")?.querySelector("tbody");
          if (!(tBody instanceof HTMLTableSectionElement))
            throw elementNotFound(
              tBody,
              `Validation of Table Body for Products`,
              ["HTMLTableSectionElement"]
            );
          tbodyProps.root && tbodyProps.root.unmount();
          tbodyProps.root = undefined;
          for (const innerRoot of Object.keys(tbodyProps.roots)) {
            tbodyProps.roots[innerRoot] &&
              tbodyProps.roots[innerRoot].unmount();
            tbodyProps.roots[innerRoot] = undefined;
          }
          if (!tbodyProps.root || !tbodyProps.root._internalRoot)
            tbodyProps.root = createRoot(tBody);
          tbodyProps.root.render(
            <OrderRow key={"order_ph"} id={"order_ph"} quantity={"0"} />
          );
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
              tbodyProps.root.render(<OrderRow id="order_ph" title="" />);
            }
          }, 500);
          const total = document.getElementById("total");
          if (!(total instanceof HTMLElement))
            throw elementNotFound(total, `validation of Total element`, [
              "HTMLElement",
            ]);
          total.innerText = ` R$ 0,00`;
        } catch (e) {
          console.error(
            `Error executing callback for ${ev.currentTarget.id}:\n${
              (e as Error).message
            }`
          );
        }
      }}
    >
      Limpar Tabela
    </button>
  );
}
