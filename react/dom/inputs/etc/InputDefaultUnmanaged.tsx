import { JSX, useEffect } from "react";
import useInput from "../../../lib/hooks/useInput";
import { baseProps } from "../baseProps";
import {
  defaultInputProps,
  fileInputProps,
  numericInputProps,
} from "../inputProps";
import { InputBaseProps } from "../../../lib/declarations/foundations";
import DOMValidator from "../../../lib/validators/DOMValidator";
export default function InputDefaultUnmanaged(
  props: InputBaseProps
): JSX.Element {
  const { r } = useInput();
  useEffect(() => {
    if (!r.current) return;
    if (DOMValidator.isDefaultWritableInput(r.current)) {
      r.current.value = props.startValue || "";
      r.current.dispatchEvent(new Event("change", { bubbles: false }));
    }
  }, []);
  return (
    <input
      ref={r}
      defaultChecked={
        (props.type === "checkbox" || props.type === "radio") && props.checked
          ? true
          : undefined
      }
      {...baseProps(props)}
      {...defaultInputProps(props)}
      {...(props.type === "number" || props.type === "range"
        ? numericInputProps(props)
        : null)}
      {...(props.type === "file" ? fileInputProps(props) : null)}
    />
  );
}
