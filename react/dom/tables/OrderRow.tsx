import { OrderProps } from "../../lib/declarations/interfaces";
import { ErrorBoundary } from "react-error-boundary";
import OrderTitle from "./OrderTitle";
import OrderQuantity from "./OrderQuantity";
import OrderRemove from "./OrderRemove";
import GenericErrorComponent from "../errors/GenericErrorComponent";

export default function OrderRow(props: OrderProps): JSX.Element {
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <tr>
          <td>
            <GenericErrorComponent
              message={`Erro criando linha para ${props.title ?? ""}`}
            />
          </td>
          <td></td>
          <td></td>
        </tr>
      )}>
      <tr id={`tr_${props.id || "unfilled"}`}>
        <OrderTitle title={props.title ?? ""} id={props.id || "unfilled"} />
        <OrderQuantity
          quantity={props.quantity ?? "0"}
          id={props.id || "unfilled"}
        />
        <OrderRemove title={props.title ?? ""} id={props.id || "unfilled"} />
      </tr>
    </ErrorBoundary>
  );
}
