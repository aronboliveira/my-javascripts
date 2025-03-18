import {
  MinMaxed,
  PseudoNum,
} from "./foundations";
export type nlStr = string | null;
export type voidish = undefined | null;
export type nlEl = Element | null;
export type queryableNode =
  | Document
  | DocumentFragment
  | Element;
export type ArrayLikeNotIterable =
  | NamedNodeMap
  | DOMStringMap
  | TouchList;
export type Int8ArrayLike =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray;
export type Int16ArrayLike = Int16Array | Uint16Array;
export type Int32ArrayLike = Int32Array | Uint32Array;
export type FloatArrayLike = Float32Array | Float64Array;
export type TypedArray =
  | Int8ArrayLike
  | Int16ArrayLike
  | Int32ArrayLike
  | FloatArrayLike;
export type BaseArray = Array | TypedArray;
export type SizeableIterable = Map | Set;
export type SettableIterable =
  | SizeableIterable
  | TypedArray; /* eslint-disable */
export type BaseIterableNotIterator =
  | BaseArray
  | SizeableIterable
  | String;
/* eslint-enable */
export type BaseIterable =
  | BaseIterableNotIterator
  | Generator;
export type DOMIterable =
  | NodeList
  | HTMLCollection
  | DOMStringList
  | CSSRuleList
  | StyleSheetList;
export type IterableNotIterator =
  | BaseIterableNotIterator
  | DOMIterable;
export type SpecialHTMLCollection =
  | HTMLFormControlsCollection
  | HTMLOptionsCollection;
export type SpecialNodeList = RadioNodeList;
export type SpecialDOMCollection =
  | SpecialHTMLCollection
  | SpecialNodeList;
export type IterableIterator = Generator;
export type ArrayLike =
  | ArrayLikeNotIterable
  | IterableNotIterator
  | IterableIterator;
export type ForEachable =
  | BaseArray
  | SizeableIterable
  | DOMIterable;
export type nlQueryableNode = queryableNode | null;
export type nlHtEl = HTMLElement | null;
export type nlDiv = HTMLDivElement | null;
export type nlInp = HTMLInputElement | null;
export type nlSel = HTMLSelectElement | null;
export type nlTxtEl = nlInp | HTMLTextAreaElement;
export type nlBtn = HTMLButtonElement | null;
export type nlFm = HTMLFormElement | null;
export type nlFs = HTMLFieldSetElement | null;
export type nlDlg = HTMLDialogElement | null;
export type List<T> =
  | Array<T>
  | NodeListOf<T>
  | HTMLCollectionOf<T>;
export type nlRef<T> = React.RefObject<T> | null;
export type nlElRef = nlRef<nlEl>;
export type nlRDispatch<T> = React.Dispatch<
  React.SetStateAction<T>
> | null;
export type genericElement =
  | HTMLDivElement
  | HTMLSpanElement;
export type inputLikeElement =
  | HTMLInputElement
  | HTMLTextAreaElement;
export type entryElement =
  | inputLikeElement
  | HTMLSelectElement;
export type disableableElement =
  | entryElement
  | HTMLButtonElement;
export type pressableElement =
  | HTMLButtonElement
  | HTMLInputElement;
export type imageLikeElement =
  | HTMLImageElement
  | HTMLInputElement;
export type listElement =
  | HTMLUListElement
  | HTMLOListElement
  | HTMLMenuElement;
export type FormControl =
  | entryElement
  | HTMLButtonElement
  | HTMLOutputElement
  | HTMLFieldSetElement
  | HTMLObjectElement
  | HTMLOptionElement
  | HTMLOptGroupElement
  | HTMLDataListElement;
export type rMouseEvent = MouseEvent | React.MouseEvent;
export type rKbEv = KeyboardEvent | React.KeyboardEvent;
export type CSSDisplay =
  | "none"
  | "block"
  | "inline"
  | "inline-block"
  | "flex"
  | "inline-flex"
  | "grid"
  | "inline-grid"
  | "table"
  | "inline-table"
  | "table-row"
  | "table-cell"
  | "table-column"
  | "table-caption"
  | "table-row-group"
  | "table-header-group"
  | "table-footer-group"
  | "list-item"
  | "contents"
  | "ruby"
  | "ruby-base"
  | "ruby-text"
  | "ruby-base-container"
  | "ruby-text-container"
  | "initial"
  | "inherit"
  | "unset";
	export type TextualInputType =
  | "text"
  | "email"
  | "url"
  | "search"
  | "tel"
  | "password";
export type CalendarInputType =
  | "date"
  | "datetime-local"
  | "month"
  | "week"
  | "time";
export type EntryInputType =
  | "checkbox"
  | "color"
  | TextualInputType
  | CalendarInputType
  | "file"
  | "number"
  | "radio"
  | "range";
export type InputType =
  | "hidden"
  | "image"
  | "button"
  | "reset"
  | "submit"
  | EntryInputType;
export type SelectTypes = "one" | "multiple";
export type EntryTypes =
  | EntryInputType
  | SelectTypes
  | "textarea";
export type VerboseEntryTypes =
  | EntryInputType
  | "select-one"
  | "select-multiple"
  | "textarea";
export type yearLimit = "minyear" | "maxyear";
export type monthLimit = "minmonth" | "maxmonth";
export type weekLimit = "minweek" | "maxweek";
export type dayLimit = "minday" | "maxday";
export type calendarLimit =
  | yearLimit
  | monthLimit
  | dayLimit;
export type hourLimit = "minhour" | "maxhour";
export type minuteLimit = "minminute" | "maxminute";
export type secondLimit = "minsec" | "maxsec";
export type clockLimit =
  | hourLimit
  | minuteLimit
  | secondLimit;
export interface YearLimits {
  minYear: string;
  maxYear: string;
}
export interface MonthLimits {
  minMonth: string;
  maxMonth: string;
}
export interface WeekLimits {
  minWeek: string;
  maxWeek: string;
}
export interface DayLimits {
  minDay: string;
  maxDay: string;
}
export interface ClockLimits {
  minHour: string;
  maxHour: string;
  minMinute: string;
  maxMinute: string;
  minSecond?: string;
  maxSecond?: string;
}
export interface ClockedCalendarLimits {
  year?: Partial<MinMaxed>;
  month?: Partial<MinMaxed>;
  week?: Partial<MinMaxed>;
  day?: Partial<MinMaxed>;
  hour?: Partial<MinMaxed>;
  minute?: Partial<MinMaxed>;
  second?: Partial<MinMaxed>;
}
export interface DefaultFieldDescription {
  type: VerboseEntryTypes;
  required?: boolean;
}
export interface TextFieldDescription
  extends DefaultFieldDescription {
  type:
    | TextualInputType
    | "textarea"
    | "number"
    | "range"
    | "color"
    | "file";
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  spellCheck?: boolean;
  writingSuggestions?: boolean;
}
export interface OptionFieldDescription
  extends DefaultFieldDescription {
  type:
    | "radio"
    | "checkbox"
    | "toggle"
    | "select-one"
    | "select-multiple";
  options?: string[];
}
export interface TimeFieldDescription
  extends DefaultFieldDescription,
    Partial<ClockedCalendarLimits> {
  type: CalendarInputType;
  step?: PseudoNum;
}