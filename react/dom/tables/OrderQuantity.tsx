import { OrderQuant } from "../../lib/declarations/interfaces";
import { useRef, useEffect } from "react";
import { nullishCel, nullishOutp } from "../../lib/declarations/types";
import { htmlElementNotFound } from "../../lib/handlers/handlersErrors";

export default function OrderQuantity(props: OrderQuant): JSX.Element {
  const quantCelRef = useRef<nullishCel>(null);
  const quantRef = useRef<nullishOutp>(null);
  useEffect(() => {
    try {
      if (!(quantRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          quantRef.current,
          `Reference for quantity Element`,
          ["HTMLElement"],
        );
      if (
        !Number.isFinite(parseInt(quantRef.current.innerText)) ||
        parseInt(quantRef.current.innerText) < 0
      )
        quantRef.current.innerText = "0";
    } catch (e) {
      console.error(
        `Error validating quantRef.current:${(e as Error).message}`,
      );
    }
  }, [quantRef]);
  return (
    <td
      ref={quantCelRef}
      id={`quantCel_${props.id || "unfilled"}`}
      className='celQuant'>
      <output
        id={`quantOutp_${props.id || "unfilled"}`}
        className={`outp_orderQuant`}
        ref={quantRef}>
        {props.quantity}
      </output>
    </td>
  );
}
