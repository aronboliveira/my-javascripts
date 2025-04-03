import { JSX } from "react";
import useSelect from "../../../lib/hooks/useSelect";
import { baseProps } from "../baseProps";
import { InputBaseProps } from "../../../lib/declarations/foundations";
export default function SelectDefaultManaged(
  props: InputBaseProps
): JSX.Element {
  const { r } = useSelect();
  return (
    <select
      ref={r}
      data-type={props.type || "select-one"}
      {...baseProps(props)}
      className="managed"
    >
      {props.children}
    </select>
  );
}
