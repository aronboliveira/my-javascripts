import { RefObject } from "react";
import MathHandler from '../utils/MathHandler';
import StringHelper from "../utils/StringHelper";
import DOMValidator from "../dom/DOMValidator";
import ObjectHelper from '../utils/ObjectHelper';
export type nlInp = HTMLInputElement | null;
export default class DateMapper {
  ref: RefObject<nlInp>;
  constructor(_ref: RefObject<nlInp>) {
    this.ref = _ref;
  }
  public static getISOYearStartingReferences(y: number): {
    j4: Date;
    j4d: number;
    w1Md: Date;
  } {
    const j4 = new Date(Date.UTC(y, 0, 4)), j4d = j4.getUTCDay(), w1Md = new Date(j4);
    w1Md.setUTCDate(
      j4.getUTCDate() - 
      MathHandler.getByOffSet({
        ref: j4d,
        length: 7,
        offSet: 1,
      })
    );
    return { j4, j4d, w1Md };
  }
  public static getLastISOWeekNum(y: number): number {
    const dec31 = new Date(Date.UTC(y, 11, 31)), dec31Day = dec31.getUTCDay();
    return dec31Day === 4 || dec31Day === 3 ? 53 : 52;
  }
  public static getMonthForISOWeek(y: number, w: number): number {
    const { w1Md } = DateMapper.getISOYearStartingReferences(y), tMd = new Date(w1Md);
    tMd.setUTCDate(w1Md.getUTCDate() + (w - 1) * 7);
    const tThd = new Date(tMd);
    tThd.setUTCDate(tMd.getUTCDate() + 3);
    return tThd.getUTCMonth();
  }
  public static getISOWeeksForMonth(y: number, m: number): number[] {
    const { w1Md } = DateMapper.getISOYearStartingReferences(y), weeksInMonth: number[] = [];
    for (let w = 1; w <= DateMapper.getLastISOWeekNum(y); w++) {
      const weekMonday = new Date(w1Md);
      weekMonday.setUTCDate(w1Md.getUTCDate() + (w - 1) * 7);
      const weekThursday = new Date(weekMonday);
      weekThursday.setUTCDate(weekMonday.getUTCDate() + 3);
      if (weekThursday.getUTCMonth() === m - 1) weeksInMonth.push(w);
    }
    return weeksInMonth;
  }
  public static getMonthDays(year: number, month: number): number {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
  }
  limitByDate(): string {
    try {
      if (!this.ref.current) return "";
      const v = this.ref.current.value;
      
      switch (this.ref.current.type) {
        case "date":
          return this.#handleDateType(v);
        case "month":
          return this.#handleMonthType(v);
        case "week":
          return this.#handleWeekType(v);
        case "time":
          return this.#handleTimeType(v);
        case "datetime-local":
          return this.#handleDateTimeLocalType(v);
        default:
          return this.ref.current.value;
      }
    } catch (e) {
      return this.ref.current?.value || "";
    }
  }
  #handleDateType(v: string): string {
    let [y, m, d] = v.split("-");
    y = this.#limitByYear(y);
    m = this.#limitByMonth(m);
    d = this.#limitByWeekDay(y, m, this.#limitByMonthDay(y, m, d));
    return `${y}-${m}-${d}`;
  }
  #handleMonthType(v: string): string {
    let [y, m] = v.split("-");
    y = this.#limitByYear(y);
    m = this.#limitByMonth(m);
    return `${y}-${m}`;
  }
  #handleWeekType(v: string): string {
    let [y, w] = v.split("-");
    w = w.replace("W", "");
    y = this.#limitByYear(y);
    w = this.#limitByWeek(y, w);
    return `${y}-W${w.padStart(2, '0')}`;
  }
  #handleTimeType(v: string): string {
    let [h, m, s = "00"] = v.split(":");
    h = this.#limitByHour(h);
    m = this.#limitByMinute(m);
    const hasSeconds = this.ref.current?.step !== "60";
    return hasSeconds ? 
      `${h}:${m}:${this.#limitBySecond(s)}` : 
      `${h}:${m}`;
  }
  #handleDateTimeLocalType(v: string): string {
    const parts = v.split(/[\-\:T]/g);
    let [y, mon, d, h, min, sec = "00"] = parts;
    y = this.#limitByYear(y);
    mon = this.#limitByMonth(mon);
    d = this.#limitByWeekDay(y, mon, this.#limitByMonthDay(y, mon, d));
    h = this.#limitByHour(h);
    min = this.#limitByMinute(min);
    const hasSeconds = this.ref.current?.step !== "60";
    return hasSeconds ? 
      `${y}-${mon}-${d}T${h}:${min}:${this.#limitBySecond(sec)}` : 
      `${y}-${mon}-${d}T${h}:${min}`;
  }
  #limitByYear(y: string): string {
    if (!this.ref.current?.dataset.minyear && !this.ref.current?.dataset.maxyear) return y || "0001";
    const baseYear = new Date().getFullYear();
    let parsedYear = MathHandler.parseNotNaN(y, baseYear, "int") || 1;
    if (this.ref.current.dataset.minyear) {
      const minYear = MathHandler.parseNotNaN(this.ref.current.dataset.minyear, 1, "int") || 1;
      parsedYear = Math.max(parsedYear, minYear);
    }
    if (this.ref.current.dataset.maxyear) {
      const maxYear = MathHandler.parseNotNaN(this.ref.current.dataset.maxyear, 275760, "int") || 275760;
      parsedYear = Math.min(parsedYear, maxYear);
    }
    return this.#formatNumber(parsedYear, 4, DOMValidator.isYearInput(this.ref.current));
  }
  #limitByMonth(m: string): string {
    if (!this.ref.current?.dataset.minmonth && !this.ref.current?.dataset.maxmonth) return m || "01";
    const baseMonth = new Date().getMonth() + 1;
    let parsedMonth = MathHandler.parseNotNaN(m, baseMonth, "int") || 1;
    if (this.ref.current.dataset.minmonth) {
      const minMonth = MathHandler.parseNotNaN(this.ref.current.dataset.minmonth, 1, "int") || 1;
      parsedMonth = Math.max(parsedMonth, minMonth);
    }
    if (this.ref.current.dataset.maxmonth) {
      const maxMonth = MathHandler.parseNotNaN(this.ref.current.dataset.maxmonth, 12, "int") || 12;
      parsedMonth = Math.min(parsedMonth, maxMonth);
    }
    return this.#formatNumber(parsedMonth, 2, DOMValidator.isMonthInput(this.ref.current));
  }
  #limitByMonthDay(y: string, m: string, d: string): string {
    if (!this.ref.current?.dataset.minmonthday && !this.ref.current?.dataset.maxmonthday) return d || "01";
    const year = MathHandler.parseNotNaN(y, new Date().getFullYear(), "int") || 1, 
      month = MathHandler.parseNotNaN(m, 1, "int") || 1, 
      maxDays = DateMapper.getMonthDays(year, month);
    let parsedDay = MathHandler.parseNotNaN(d, new Date().getDate(), "int") || 1;
    parsedDay = Math.max(1, Math.min(parsedDay, maxDays));
    return this.#formatNumber(parsedDay, 2, DOMValidator.isDayInput(this.ref.current));
  }
  #limitByWeekDay(y: string, m: string, d: string): string {
    if (!this.ref.current?.dataset.minweekday && !this.ref.current?.dataset.maxweekday) return d;
    const year = MathHandler.parseNotNaN(y, new Date().getFullYear(), "int") || 1, 
      month = MathHandler.parseNotNaN(m, 1, "int") || 1, 
      day = MathHandler.parseNotNaN(d, 1, "int") || 1, 
      weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    let adjustedDay = day;
    if (this.ref.current.dataset.minweekday) {
      const minWeekday = MathHandler.parseNotNaN(this.ref.current.dataset.minweekday, 0, "int");
      adjustedDay += (minWeekday - weekday + 7) % 7;
    }
    if (this.ref.current.dataset.maxweekday) {
      const maxWeekday = MathHandler.parseNotNaN(this.ref.current.dataset.maxweekday, 6, "int");
      adjustedDay -= (weekday - maxWeekday + 7) % 7;
    }
    return this.#formatNumber(adjustedDay, 2, DOMValidator.isDayInput(this.ref.current));
  }
  #limitByWeek(y: string, w: string): string {
    if (!this.ref.current?.dataset.minweek && !this.ref.current?.dataset.maxweek &&
        !this.ref.current?.dataset.minmonth && !this.ref.current?.dataset.maxmonth) {
      return w || "01";
    }
    const year = MathHandler.parseNotNaN(y, new Date().getFullYear(), "int") || 1;
    let parsedWeek = MathHandler.parseNotNaN(w, 1, "int") || 1;
    const maxWeek = DateMapper.getLastISOWeekNum(year);
    parsedWeek = Math.max(1, Math.min(parsedWeek, maxWeek));
    if (this.ref.current.dataset.minmonth || this.ref.current.dataset.maxmonth) {
      const minMonth = MathHandler.parseNotNaN(this.ref.current.dataset.minmonth, 1, "int") || 1, 
        maxMonth = MathHandler.parseNotNaN(this.ref.current.dataset.maxmonth, 12, "int") || 12, 
        minWeek = DateMapper.getISOWeeksForMonth(year, minMonth)[0], 
        maxWeekForMonth = DateMapper.getISOWeeksForMonth(year, maxMonth), 
        maxValidWeek = maxWeekForMonth[maxWeekForMonth.length - 1];
      parsedWeek = Math.max(minWeek, Math.min(parsedWeek, maxValidWeek));
    }
    return this.#formatNumber(parsedWeek, 2, this.ref.current?.type === "week");
  }
  #limitByHour(h: string): string {
    return this.#limitTimeUnit(h, 'hour', 0, 23);
  }
  #limitByMinute(m: string): string {
    return this.#limitTimeUnit(m, 'minute', 0, 59);
  }
  #limitBySecond(s: string): string {
    return this.#limitTimeUnit(s, 'second', 0, 59);
  }
  #limitTimeUnit(value: string, type: 'hour'|'minute'|'second', min: number, max: number): string {
    if (!this.ref.current?.dataset[`min${type}`] && !this.ref.current?.dataset[`max${type}`])
      return value || "00";
    let parsed = MathHandler.parseNotNaN(value, min, "int") || min;
    parsed = Math.max(min, Math.min(parsed, max));
    return this.#formatNumber(parsed, 2, DOMValidator.isHourInput(this.ref.current));
  }
  #formatNumber(value: number, length: number, isDirectInput: boolean): string {
    let str = value.toString();
    if (!isDirectInput)
      str = str.slice(0, length).padStart(length, '0');
    return str.padStart(length, '0');
  }
}