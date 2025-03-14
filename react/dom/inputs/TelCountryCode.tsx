"use client";
import { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import IOHandler from "@/lib/client/handlers/IOHandler";
import { TelFragmentOptInput } from "@/lib/definitions/client/interfaces/components";
import { classes } from "@/lib/client/vars";
import "react-phone-input-2/lib/style.css";
import StringHelper from "@/lib/helpers/StringHelper";
import {
  nlDiv,
  nlHtEl,
  nlInp,
} from "@/lib/definitions/client/helpers";
import StyleHandler from "@/lib/client/handlers/StyleHandler";
export default function TelCountryCode({
  required,
  id,
}: TelFragmentOptInput) {
  id ||= "countryCode";
  const [v, setV] = useState<string>(""),
    dr = useRef<nlDiv>(null),
    r = useRef<nlHtEl>(null),
    linkedTo = useRef<nlHtEl>(null);
  useEffect(() => {
    if (!id || !dr.current) return;
    r.current = document.querySelector(".cc");
    if (!(r.current instanceof HTMLInputElement)) return;
    linkedTo.current =
      r.current
        .closest(".telBlock")
        ?.querySelector(".ddd") ??
      document.getElementById(
        r.current.id.replace("cc", "ddd")
      );
    if (
      !(
        linkedTo.current instanceof HTMLInputElement ||
        linkedTo.current instanceof HTMLTextAreaElement
      )
    )
      return;
    if (r.current.value.length > 3) {
      IOHandler.moveCursorFocus(
        r.current,
        linkedTo.current,
        4
      );
      r.current.blur();
      dr.current.click();
      linkedTo.current.focus();
    }
    IOHandler.syncLabel(r.current as nlInp);
    required && StyleHandler.alarmBorder(r.current);
  }, [r, v]);
  return (
    <div
      ref={dr}
      className={`${classes.inpDivClasses} countryCodeBlock`}
    >
      <label className={classes.inpLabClasses} htmlFor={id}>
        Código
      </label>
      <PhoneInput
        value={v}
        country='br'
        inputClass={classes.ccClasses}
        buttonClass='button-secondary'
        searchClass='search'
        searchPlaceholder='Pesquise aqui'
        searchNotFound='Sem resultados!'
        defaultErrorMessage='Houve algum erro!'
        defaultMask='+.. (Exemplo: +55)'
        inputProps={{
          name: StringHelper.camelToSnake(id),
          id: id,
          required,
          autoComplete: "tel-country-code",
          minLength: 1,
          maxLength: 4,
          pattern: "^\\+[0-9]{2,4}s?$",
          "data-fixed": "true",
        }}
        containerStyle={{
          width: "6rem",
          fontSize: "1rem",
          marginTop: "0",
        }}
        searchStyle={{
          backgroundColor: "var(--bs-body-bg)",
          color: "var(--bs-body-color)",
        }}
        autocompleteSearch={true}
        autoFormat={false}
        enableSearch={true}
        countryCodeEditable={true}
        disableDropdown={false}
        onChange={val =>
          setV(IOHandler.adjustTelCountryCode(val))
        }
      />
    </div>
  );
}
