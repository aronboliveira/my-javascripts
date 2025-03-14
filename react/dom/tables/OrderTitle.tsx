import { useRef } from "react";
import { OrderTitleProps } from "../../lib/declarations/interfaces";
import { nullishCel } from "../../lib/declarations/types";

export default function OrderTitle(props: OrderTitleProps): JSX.Element {
  const titleCelRef = useRef<nullishCel>(null);
  return (
    <td
      ref={titleCelRef}
      id={`titleCel_${props.id || "unfilled"}`}
      className='celName'>
      <output
        id={`titleOutp_${props.id || "unfilled"}`}
        className={`outp_orderTitle`}>
        {props.title}
      </output>
    </td>
  );
}
