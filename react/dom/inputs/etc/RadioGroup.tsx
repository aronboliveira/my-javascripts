import { JSX, useEffect, useRef } from "react";
import {
  FieldsetProps,
  InputBaseProps,
} from "../../../lib/declarations/foundations";
import styleClasses from "../../../styles/classes";
import { fieldsetProps } from "../baseProps";

export default function RadioGroup(
  props: FieldsetProps & {
    inputProps: InputBaseProps;
    choices: Array<{ value: string; label: string }>;
    legend: string;
  }
): JSX.Element {
  const baseClass = "fsRadioGroup";
  delete props.inputProps.id;
  delete props.inputProps.name;
  const r = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    if (!r.current || !props.inputProps.startValue) return;
    const iniRadio = r.current.querySelector(
      `[name="${props.inputProps.startValue}"]`
    );
    if (!(iniRadio instanceof HTMLInputElement && iniRadio.type === "radio"))
      return;
    iniRadio.click();
    iniRadio.dispatchEvent(new Event("change"));
  }, [r]);
  return (
    <fieldset
      ref={r}
      role="radiogroup"
      className={`${baseClass} ${styleClasses.fieldsetDefault}`}
      {...Object.fromEntries(
        Object.entries(fieldsetProps(props)).filter(([k]) => k !== "id")
      )}
      id={props.inputProps.id ? `fs_${props.inputProps.id}` : undefined}
      name={props.inputProps.id ? `fs_${props.inputProps.id}` : undefined}
    >
      <legend
        className={`legRadioGroup`}
        id={props.inputProps.id ? `leg_${props.inputProps.id}` : undefined}
        data-htmlfor={
          props.inputProps.id ? `fs_${props.inputProps.id}` : undefined
        }
      >
        {props.legend}
      </legend>
      {props.choices?.map(({ value, label }, i) => (
        <div
          className={`divRadio_RadioGroup`}
          id={`divRadio_RadioGroup_${value}`}
          key={`divRadio_RadioGroup_${value}_${i}`}
        >
          <label
            className={`label_${baseClass} ${styleClasses.labelDefault}`}
            id={`label_${value}`}
            htmlFor={`${value}`}
          >
            {label}
          </label>
          <input
            id={value}
            value={value}
            name={value}
            type="radio"
            {...props.inputProps}
          />
        </div>
      ))}
    </fieldset>
  );
}
