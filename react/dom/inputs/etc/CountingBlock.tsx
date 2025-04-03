import { JSX, useEffect, useReducer, useState } from "react";
import FieldsetDefault from "../../bloc/fs/FieldsetDefault";
import { FieldsetProps } from "../../lib/declarations/foundations";
import StringHelper from "../../lib/helpers/StringHelper";
import BsPlusIcon from "../icons/BsPlusIcon";
import BsDashIcon from "../icons/BsDashIcon";
export const prevCounters: Record<string, number> = {};
export default function CountingBlock(
  props: {
    title?: string;
  } & FieldsetProps
): JSX.Element {
  const idf =
      props.id ||
      props.name ||
      StringHelper.sanitizePropertyName(crypto.randomUUID()),
    baseClass = StringHelper.uncapitalize(CountingBlock.name),
    start = 1,
    [acc, dispatch] = useReducer<number, [action: "INCREMENT" | "DECREMENT"]>(
      (state: number, action: "INCREMENT" | "DECREMENT"): number => {
        prevCounters[idf] = state;
        switch (action) {
          case "INCREMENT":
            return state + 1;
          case "DECREMENT":
            return state === 1 ? state : state - 1;
          default:
            return state;
        }
      },
      start
    ),
    [list, setList] = useState<JSX.Element[]>([
      <li
        className={`countingLi`}
        key={`li_${idf}__${start}`}
        id={`li_${idf}__${start}`}
        data-acc={start}
      >
        <FieldsetDefault
          inputProps={{
            className: "form-control",
            data: { listed: "true" },
          }}
        />
      </li>,
    ]);
  useEffect(() => {
    try {
      if (acc < 1) return;
      if (!prevCounters[idf] || typeof prevCounters[idf] !== "number") return;
      if (prevCounters[idf] < acc)
        setList((prev) => [
          ...prev,
          <li
            className={`countingLi`}
            key={`li_${idf}__${acc}`}
            id={`li_${idf}__${acc}`}
            data-acc={1}
          >
            <FieldsetDefault
              inputProps={{
                className: "form-control",
                data: { listed: "true" },
              }}
            />
          </li>,
        ]);
      else if (prevCounters[idf] > acc) setList((prev) => prev.slice(0, -1));
    } catch (e) {
      console.warn(
        `Failed to modify counter: ${(e as Error).name} — ${
          (e as Error).message
        }`
      );
    }
  }, [acc]);
  return (
    <fieldset
      id={idf}
      name={props.name || idf}
      disabled={props.disabled}
      className={`${baseClass}`}
    >
      <div id={`div_${idf}`} className={`div_${baseClass}`}>
        <legend
          id={`leg_${idf}`}
          className={`leg_${baseClass}`}
          data-htmlfor={idf}
        >
          {props.title}
        </legend>
        <fieldset
          className={`fsBtns fsBtns_${baseClass}`}
          id={`fsBtns_${idf}`}
          name={props.name ? `fsBtns_${props.name || idf}` : undefined}
          disabled={props.disabled}
        >
          <button
            className={`countingBtn addBtn_${baseClass}`}
            id={`addBtn_${idf}`}
            onClick={() => dispatch("INCREMENT")}
          >
            <BsPlusIcon />
          </button>
          <button
            className={`countingBtn removeBtn_${baseClass}`}
            id={`removeBtn_${idf}`}
            onClick={() => dispatch("DECREMENT")}
          >
            <BsDashIcon />
          </button>
        </fieldset>
      </div>
      <ul className={`countingBlockList`} id={`ul_${idf}`}>
        {list}
      </ul>
    </fieldset>
  );
}
