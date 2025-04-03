import {
  FieldsetHTMLAttributes,
  JSX,
  LabelHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import { FieldType, InputBaseProps } from "../../lib/declarations/foundations";
import InputDefaultUnmanaged from "../inputs/unmanaged/InputDefaultUnmanaged";
import InputDefaultManaged from "../inputs/managed/InputDefaultManaged";
import SelectDefaultManaged from "../inputs/managed/SelectDefaultManaged";
import SelectDefaultUnmanaged from "../inputs/unmanaged/SelectDefaultUnmanaged";
import { fieldsetProps } from "../inputs/baseProps";
import styleClasses from "../../styles/classes";
export default function FieldsetDefault(
  props: Partial<FieldsetHTMLAttributes<HTMLFieldSetElement>> &
    Partial<LabelHTMLAttributes<HTMLLabelElement>> & {
      inputProps: InputBaseProps;
      idf?: string;
      fieldType?: FieldType;
      managed?: boolean;
      label?: string;
      children?: ReactNode;
      grandChildren?: ReactNode;
      note?: ReactElement;
      list?: ReactElement;
      listElement?: ReactElement;
    }
): JSX.Element {
  const baseClass = "fieldsetDefault";
  return (
    <fieldset
      className={`${baseClass} ${styleClasses.fieldsetDefault}`}
      {...Object.fromEntries(
        Object.entries(fieldsetProps(props)).filter(([k]) => k !== "id")
      )}
      id={props.idf ? `fs_${props.idf}` : undefined}
      name={props.idf ? `fs_${props.idf}` : undefined}
    >
      <label
        className={`label_${baseClass} ${styleClasses.labelDefault}`}
        id={props.idf ? `label_${props.idf}` : undefined}
        htmlFor={props.idf || `label_${props.name}`}
      >
        {props.label}
      </label>
      {(() => {
        const commonProps = props.inputProps,
          list = commonProps.list;
        delete commonProps.list;
        if (!commonProps.id) commonProps.id = props.idf;
        if (!commonProps.name) commonProps.name = props.idf;
        switch (props.fieldType) {
          case "select":
            return props.managed ? (
              <SelectDefaultManaged {...commonProps}>
                {props.grandChildren || <></>}
              </SelectDefaultManaged>
            ) : (
              <SelectDefaultUnmanaged {...commonProps}>
                {props.grandChildren || <></>}
              </SelectDefaultUnmanaged>
            );
          default:
            return props.managed ? (
              <InputDefaultManaged {...commonProps} list={list} />
            ) : (
              <InputDefaultUnmanaged {...commonProps} list={list} />
            );
        }
      })()}
      {props.listElement ? props.listElement : null}
      {props.note ? props.note : null}
      {props.children}
    </fieldset>
  );
}
