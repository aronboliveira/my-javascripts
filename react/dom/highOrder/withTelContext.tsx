import { createContext } from "react";
import { ITelCtx } from "@/lib/definitions/client/interfaces/contexts";
export const TelCtx = createContext<ITelCtx>({
  required: false,
  label: "unique",
});
export default function withTelContext<T extends ITelCtx>(
  Wrapped: React.ComponentType<T>
) {
  return function Enhanced(props: T) {
    const label = (() => {
        switch (props.label) {
          case "prim":
            return "Telefone Primário";
          case "sec":
            return "Telefone Secundário";
          case "unique":
            return "Telefone";
          default:
            return props.label;
        }
      })(),
      newProps = {
        ...props,
        label,
      };
    return (
      <TelCtx.Provider
        value={{
          required: props.required ?? false,
          label: label ?? "Telefone",
        }}
      >
        <Wrapped {...newProps} />
      </TelCtx.Provider>
    );
  };
}
