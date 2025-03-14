import { formatCPF } from "../../../src/lib/global/gModel";
import { handleCondtReq } from "../../../src/lib/global/handlers/gHandlers";
export default function CPFElement(): JSX.Element {
  return (
    <input
      type="text"
      id="inpCPF"
      maxLength={16}
      pattern="^\d{3}\.\d{3}\.\d{3}-\d{2}$"
      className="form-control noInvert"
      placeholder="Preencha com o CPF"
      autoComplete="username"
      data-title="CPF"
      onInput={(ev) => {
        formatCPF(ev.currentTarget);
        handleCondtReq(ev.currentTarget, {
          min: 1,
          max: 16,
          pattern: ["\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$", ""],
        });
      }}
    />
  );
}
export function formatCPF(CPFInp: targEl): string {
  if (
    CPFInp instanceof HTMLInputElement ||
    CPFInp instanceof HTMLTextAreaElement
  ) {
    CPFInp.value = CPFInp.value
      .replaceAll(/[^0-9.-]/g, "")
      .replaceAll(/[-]{2,}/g, "-")
      .replaceAll(/\.{2,}/g, ".");
    if (
      CPFInp.value.length === 4 &&
      !CPFInp.value.match(/^[0-9]{3,}\.$/) &&
      CPFInp.value.match(/^[0-9]{4,}$/)
    ) {
      const _1checkCPF = CPFInp.value;
      CPFInp.value = `${_1checkCPF.slice(0, 3)}.${_1checkCPF.slice(3, 4)}`;
    }
    if (
      CPFInp.value.length === 8 &&
      !CPFInp.value.match(/^[0-9]{3,}\.[0-9]{3,}\.$/) &&
      CPFInp.value.match(/^[0-9]{3,}\.[0-9]{4,}$/)
    )
      CPFInp.value = `${CPFInp.value.slice(0, 7)}.${CPFInp.value.slice(7, 8)}`;
    if (
      CPFInp.value.length === 12 &&
      !CPFInp.value.match(/^[0-9]{3,}\.[0-9]{3,}\.[0-9]{3,}[-]}$/) &&
      CPFInp.value.match(/^[0-9]{3,}\.[0-9]{3,}\.[0-9]{4,}$/)
    ) {
      CPFInp.value = `${CPFInp.value.slice(0, 11)}-${CPFInp.value.slice(
        11,
        12
      )}`;
    }
    CPFInp.value.length > 14 &&
      (CPFInp.value = CPFInp.value.substring(0, 14))
        .replaceAll(/[-]{2,}/g, "-")
        .replaceAll(/\.{2,}/g, ".");
  }
  return (CPFInp as entryEl)?.value ?? "";
}
