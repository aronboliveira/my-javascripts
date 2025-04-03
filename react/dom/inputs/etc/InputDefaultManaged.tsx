import { JSX, useEffect, useState } from "react";
import useInput from "../../../lib/hooks/useInput";
import { baseProps } from "../baseProps";
import {
  defaultInputProps,
  fileInputProps,
  numericInputProps,
} from "../inputProps";
import { InputBaseProps } from "../../../lib/declarations/foundations";
export default function InputDefaultManaged(
  props: InputBaseProps
): JSX.Element {
  const { r } = useInput();
  const [isChecked, setIsChecked] = useState(
    props.type === "checkbox" || props.type === "radio"
      ? !!props.checked
      : false
  );
  const [v, setV] = useState<string>(
    props.type === "checkbox" || props.type === "radio"
      ? props.startValue || "on"
      : props.startValue || ""
  );
  useEffect(() => {
    if (!r.current) return;
    if (props.type === "checkbox" || props.type === "radio") {
      r.current.checked = isChecked;
    }
  }, [isChecked, props.type, r]);
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (props.type === "checkbox" || props.type === "radio") {
      setIsChecked(ev.currentTarget.checked);
    } else {
      setV(ev.currentTarget.value);
    }
  };
  return (
    <input
      ref={r}
      value={
        props.type === "checkbox" || props.type === "radio" ? undefined : v
      }
      checked={
        props.type === "checkbox" || props.type === "radio"
          ? isChecked
          : undefined
      }
      onChange={handleChange}
      className="managed"
      {...baseProps(props)}
      {...defaultInputProps(props)}
      {...(props.type === "number" || props.type === "range"
        ? numericInputProps(props)
        : null)}
      {...(props.type === "file" ? fileInputProps(props) : null)}
    />
  );
}
