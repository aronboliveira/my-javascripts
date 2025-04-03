import { InputBaseProps } from "../../lib/declarations/foundations";
export const fieldsetProps = (
  props:
    | Partial<typeof HTMLFieldSetElement.prototype>
    | Partial<React.FieldsetHTMLAttributes<HTMLFieldSetElement>>
) => {
  return {
    id: props.id,
    name: props.name,
    disabled: props.disabled || false,
    className: props.className || "",
  };
};
export const baseProps = (props: InputBaseProps) => {
  const isAutoWritable = (): boolean =>
    props.type === "text" ||
    props.type === "passowrd" ||
    props.type === "search" ||
    props.type === "tel" ||
    props.type === "url" ||
    props.type === "email";
  return {
    ...fieldsetProps(props as any),
    required: props.required || false,
    multiple: props.type === "file" ? props.multiple || false : undefined,
    dir: props.dir,
    autoComplete: isAutoWritable() ? props.autoComplete || "off" : undefined,
    autoCapitalize: isAutoWritable()
      ? props.autoCapitalize || "off"
      : undefined,
    autoCorrect: isAutoWritable() ? props.autoCorrect || "off" : undefined,
    autoFocus: props.autofocus ? true : undefined,
    popoverTarget: (props as any).popoverTargetElement,
    popoverTargetAction: (props as any).popoverTargetAction,
    dataset: props.dataset
      ? Object.fromEntries(
          Object.entries(props.dataset).map(([k, v]) => [`data-${k}`, v])
        )
      : null,
  };
};
