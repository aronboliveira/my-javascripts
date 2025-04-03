export const defaultInputProps = (
  props: { startValue?: string } & Partial<typeof HTMLInputElement.prototype>
) => {
  const isWritable =
    props.type === "text" ||
    props.type === "number" ||
    props.type === "email" ||
    props.type === "password" ||
    props.type === "tel" ||
    props.type == "url" ||
    props.type === "search";
  return {
    type: props.type || "text",
    readOnly: props.readOnly || false,
    placeholder: isWritable ? props.placeholder || "Type here" : undefined,
    minLength: isWritable ? props.minLength || 0 : undefined,
    maxLength: isWritable
      ? props.maxLength || Number.MAX_SAFE_INTEGER
      : undefined,
    pattern: isWritable ? props.pattern || undefined : undefined,
    list: isWritable ? props.list?.id : undefined,
  };
};
export const numericInputProps = (
  props: { startValue?: string } & Partial<typeof HTMLInputElement.prototype>
) => {
  return {
    step:
      props.type === "number" || props.type === "range"
        ? props.step
        : undefined,
    min: props.type === "number" || props.type === "range" ? props.min : 0,
    max:
      props.type === "number" || props.type === "range"
        ? props.max
        : Number.MAX_SAFE_INTEGER,
  };
};
export const fileInputProps = (
  props: { startValue?: string } & Partial<typeof HTMLInputElement.prototype>
) => {
  return {
    accept: props.type === "file" ? props.accept || "*" : undefined,
    capture:
      props.type === "file"
        ? (props.capture as "user" | "environment") || "user"
        : undefined,
  };
};
export const checkInputProps = (
  props: { startValue?: string } & Partial<typeof HTMLInputElement.prototype>
) => {
  return {
    checked:
      props.type === "radio" || props.type === "checkbox"
        ? props.checked || false
        : undefined,
  };
};
