import { exeAutoFill } from "../../../../src/lib/locals/edFisNutPage/edFisNutHandler";
import { handleEventReq } from "../../../../src/lib/global/handlers/gHandlers";
import { looseNum, nlInp } from "../../../../src/lib/global/declarations/types";
import { person, tabProps, timers } from "../../../../src/vars";
import { useState, useEffect, Dispatch, SetStateAction, MutableRefObject, useCallback, useRef } from "react";
import { applyFieldConstraints, parseNotNaN } from "../../../../src/lib/global/gModel";
import { PseudoNum } from "../../../../src/lib/global/declarations/testVars";
export default function AgeElement({
  onSetAge,
  inpRef,
  ageRef,
}: {
  onSetAge?: Dispatch<SetStateAction<looseNum>>;
  inpRef?: MutableRefObject<nlInp>;
  ageRef?: MutableRefObject<number>;
}): JSX.Element {
  const [age, setAge] = useState<PseudoNum | "">("30"),
    trusted = useRef<boolean>(false),
    evaluateNum = useCallback((a: string): PseudoNum => {
      if (a.startsWith("0") && a.length > 1) a = parseNotNaN(a, 0, "int").toString();
      if (a.length > 3) a = a.slice(0, 4);
      const numValue = parseNotNaN(a, 0, "int");
      if (!Number.isFinite(numValue)) a = "";
      if (numValue > 127) a = "127";
      return a as PseudoNum;
    }, []);
  useEffect(() => {
    try {
      if (!(inpRef?.current instanceof HTMLInputElement) || !/edfis/gi.test(location.pathname.toLowerCase())) return;
      person.age = parseNotNaN(inpRef.current.value, 0, "int");
      setAge(person.age.toString() as PseudoNum);
      if (ageRef) ageRef.current = person.age;
      onSetAge && onSetAge(evaluateNum(person.age.toString()) as PseudoNum);
    } catch (e) {
      return;
    }
  }, [setAge, onSetAge, inpRef, ageRef, evaluateNum, trusted]);
  useEffect(() => {
    try {
      if (!trusted.current) return;
      if (!(inpRef?.current && inpRef.current instanceof HTMLElement))
        throw new Error(`Failed to validate instance of input`);
      handleEventReq(inpRef.current);
      if (!/edfis/gi.test(location.pathname.toLowerCase())) return;
      const evaluatedNum = parseNotNaN(evaluateNum(age) || "0", 0, "int");
      person.age = Number.isFinite(evaluatedNum) ? evaluatedNum : 0;
      if (ageRef) ageRef.current = person.age;
      tabProps.isAutoFillActive && exeAutoFill(inpRef.current, "cons");
      if (ageRef) ageRef.current = person.age;
    } catch (e) {
      return;
    }
  }, [age, ageRef, inpRef, evaluateNum, trusted]);
  useEffect(() => {
    setTimeout(() => {
      try {
        person.age =
          parseNotNaN(inpRef?.current?.value || "0", 0, "int") ||
          parseNotNaN(
            (document.getElementById("ageId") instanceof HTMLInputElement &&
              (document.getElementById("ageId") as HTMLInputElement).value) ||
              "0",
            0,
            "int",
          ) ||
          0;
      } catch (e) {
        return;
      }
    }, timers.personENTimer * 0.75);
  }, [inpRef]);
  return (
    <input
      value={age}
      ref={inpRef}
      type='number'
      name='age'
      id='ageId'
      className='form-control noInvert inpIdentif minText maxText minNum maxNum patternText'
      min='0'
      max='127'
      required
      data-title='Idade'
      data-reqlength='1'
      data-maxlength='4'
      data-minnum='0'
      data-maxnum='127'
      data-pattern='^[\d,.]+$'
      onInput={ev => {
        if (ev.isTrusted) trusted.current = true;
        if (!trusted.current) return;
        try {
          let newValue = ev.currentTarget.value.replace(/[^0-9]/g, "").trim();
          applyFieldConstraints(ev.currentTarget);
          if (newValue === "") {
            setAge(() => newValue as PseudoNum);
            onSetAge && onSetAge(() => evaluateNum(newValue) as PseudoNum);
            return;
          }
          setAge(() => evaluateNum(newValue) as PseudoNum);
          onSetAge && onSetAge(() => evaluateNum(newValue) as PseudoNum);
        } catch (e) {
          return;
        }
      }}
    />
  );
}
