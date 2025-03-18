import { RefObject } from "react";
import MathHandler from "../handlers/MathHandler";
import StringHelper from "@/lib/helpers/StringHelper";
import DOMValidator from "../validators/DOMValidator";
export type nlInp = HTMLInputElement | null;
export const MonthDays = ObjectHelper.deepFreeze({
  _01: 31,
  _02: ((): number => {
    const y = new Date().getFullYear();
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28;
  })(),
  _03: 31,
  _04: 30,
  _05: 31,
  _06: 30,
  _07: 31,
  _08: 31,
  _09: 30,
  _10: 31,
  _11: 30,
  _12: 31,
});
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
    const j4 = new Date(y, 0, 4),
      j4d = j4.getDay();
    const w1Md = new Date(j4);
    // ((x + (list.length - offSet)) % list.length)
    w1Md.setDate(
      j4.getDate() -
        MathHandler.getByOffSet({
          ref: j4d,
          length: 7,
          offSet: 1,
        })
    );
    return { j4, j4d, w1Md };
  }
  public static getLastISOWeekNum(y: number): number {
    return new Date(y, 11, 31).getDay() < 4 ? 52 : 53;
  }
  public static getMonthForISOWeek(
    y: number,
    w: number
  ): number {
    const { w1Md } =
      DateMapper.getISOYearStartingReferences(y);
    const tMd = new Date(w1Md);
    tMd.setDate(w1Md.getDate() + (w - 1) * 7);
    const tThd = new Date(tMd);
    tThd.setDate(tMd.getDate() + 3);
    return tThd.getMonth();
  }
  public static getISOWeeksForMonth(
    y: number,
    m: number
  ): number[] {
    const { w1Md } =
        DateMapper.getISOYearStartingReferences(y),
      lastWNum = DateMapper.getLastISOWeekNum(y),
      weeksInMonth: number[] = [];
    for (let w = 1; w <= lastWNum; w++) {
      const weekMonday = new Date(w1Md);
      weekMonday.setDate(w1Md.getDate() + (w - 1) * 7);
      const weekThursday = new Date(weekMonday);
      weekThursday.setDate(weekMonday.getDate() + 3);
      weekThursday.getMonth() + 1 === m &&
        weeksInMonth.push(w);
    }
    return weeksInMonth;
  }
  limitByDate(): string {
    try {
      if (!this.ref.current) return "";
      let v = this.ref.current.value;
      switch (this.ref.current.type) {
        case "date": {
          let [y, m, d] = v.split("-");
          y = this.#limitByYear(y);
          m = this.#limitByMonth(m);
          d = this.#limitByWeekDay(
            y,
            m,
            this.#limitByMonthDay(m, d)
          );
          return `${y}-${m}-${d}`;
        }
        case "month": {
          let [y, m] = v.split("-");
          y = this.#limitByYear(y);
          m = this.#limitByMonth(m);
          return `${y}-${m}`;
        }
        case "week": {
          let [y, w] = v.split("-");
          w = w.replace("W", "");
          y = this.#limitByYear(y);
          w = this.#limitByWeek(y, w);
          return `${y}-W${w}`;
        }
        case "time": {
          let [h, m, s = "00"] = v.split(":");
          h = this.#limitByHour(h);
          m = this.#limitByMinute(m);
          const hasSeconds = this.ref.current.step !== "60";
          if (hasSeconds) s = this.#limitBySecond(s);
          return !hasSeconds
            ? `${h}:${m}`
            : `${h}:${m}:${s}`;
        }
        case "datetime-local": {
          let [y, mon, d, h, min, sec = "00"] =
            v.split(/[\-\:T]/g);
          y = this.#limitByYear(y);
          mon = this.#limitByMonth(mon);
          d = this.#limitByWeekDay(
            y,
            mon,
            this.#limitByMonthDay(mon, d)
          );
          h = this.#limitByHour(h);
          min = this.#limitByMinute(min);
          const hasSeconds = this.ref.current.step !== "60";
          if (hasSeconds) sec = this.#limitBySecond(sec);
          return !hasSeconds
            ? `${y}-${mon}-${d}T${h}:${min}`
            : `${y}-${mon}-${d}T${h}:${min}:${sec}`;
        }
        default:
          return this.ref.current.value;
      }
    } catch (e) {
      return this.ref.current?.value || "";
    }
  }
  #limitByYear(y: string): string {
    if (
      !this.ref.current?.dataset.minyear &&
      !this.ref.current?.dataset.maxyear
    )
      return y ?? "0001";
    const base = new Date().getFullYear(),
      rx = /\d{4}/;
    let ny = MathHandler.parseNotNaN(y, base, "int") || 1;
    const checkPattern = (): void => {
      let sny = ny.toString();
      if (!this.ref.current) return;
      if (!DOMValidator.isYearInput(this.ref.current)) {
        if (sny.length > 4) sny = sny.slice(0, 4);
        if (sny.length < 4)
          sny = StringHelper.padToISO(sny, 4);
      }
      if (rx.test(sny)) y = sny;
    };
    if (this.ref.current.dataset.minyear) {
      const min =
        MathHandler.parseNotNaN(
          this.ref.current.dataset.minyear,
          base,
          "int"
        ) || 1;
      if (
        ny < min &&
        ny.toString().length === min.toString().length
      )
        ny = min;
      checkPattern();
    }
    if (this.ref.current.dataset.maxyear) {
      const max =
        MathHandler.parseNotNaN(
          this.ref.current.dataset.maxyear,
          base + 1,
          "int"
        ) || 1;
      if (ny > max) ny = max;
      checkPattern();
    }
    return y;
  }
  #limitByMonth(m: string): string {
    if (
      !this.ref.current?.dataset.minmonth &&
      !this.ref.current?.dataset.maxmonth
    )
      return m ?? "01";
    const base = new Date().getMonth() + 1,
      rx = /\d{2}/;
    let nm = MathHandler.parseNotNaN(m, base, "int") || 1;
    const checkPattern = (
      limit: number,
      max: boolean = false
    ): void => {
      if (limit < 1) limit = 1;
      if (limit > 12) limit = 12;
      if (max && nm > limit) nm = limit;
      else if (!max && nm < limit) nm = limit;
      let snm = nm.toString();
      if (!this.ref.current) return;
      if (!DOMValidator.isMonthInput(this.ref.current)) {
        if (snm.length > 2) snm = snm.slice(0, 2);
        if (snm.length < 2)
          snm = StringHelper.padToISO(snm);
      }
      if (rx.test(snm)) m = snm;
    };
    if (this.ref.current.dataset.minmonth)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.minmonth,
          base,
          "int"
        ) || 1
      );
    if (this.ref.current.dataset.maxmonth)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.maxmonth,
          base + 1,
          "int"
        ) || 1,
        true
      );
    return m;
  }
  #limitByMonthDay(m: string, d: string): string {
    if (
      !this.ref.current?.dataset.minmonthday &&
      !this.ref.current?.dataset.minmaxday
    )
      return d ?? "01";
    const base = new Date().getDate(),
      rx = /\d{2}/;
    let nd = MathHandler.parseNotNaN(d, base, "int") || 1;
    const checkPattern = (
      limit: number,
      max: boolean = false
    ): void => {
      if (limit < 1) limit = 1;
      const maxLimit =
        MonthDays[
          `_${StringHelper.padToISO(
            m
          )}` as keyof typeof MonthDays
        ] || 28;
      if (limit > maxLimit) limit = maxLimit;
      if (max && nd > limit) nd = limit;
      else if (!max && nd < limit) nd = limit;
      let snd = nd.toString();
      if (!this.ref.current) return;
      if (!DOMValidator.isDayInput(this.ref.current)) {
        if (snd.length > 2) snd = snd.slice(0, 2);
        if (snd.length < 2)
          snd = StringHelper.padToISO(snd);
      }
      if (rx.test(snd)) d = snd;
    };
    if (this.ref.current.dataset.minmonthday)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.minmonthday,
          base,
          "int"
        ) || 1
      );
    if (this.ref.current.dataset.maxmonthday)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.maxmonthday,
          base,
          "int"
        ) || 1,
        true
      );
    return d;
  }
  #limitByWeekDay(y: string, m: string, d: string): string {
    if (
      !this.ref.current?.dataset.minweekday &&
      !this.ref.current?.dataset.maxweekday
    )
      return d ?? "01";
    y = this.#limitByYear(y);
    m = this.#limitByMonth(m);
    d = this.#limitByMonthDay(m, d);
    const currDate = new Date(),
      base = 1,
      rx = /\d{2}/,
      ny =
        MathHandler.parseNotNaN(
          y,
          currDate.getFullYear(),
          "int"
        ) || 1,
      nm =
        MathHandler.parseNotNaN(
          m,
          currDate.getMonth() + 1,
          "int"
        ) || 1,
      nd =
        MathHandler.parseNotNaN(
          d,
          currDate.getDate(),
          "int"
        ) || 1;
    let wd = new Date(ny, nm - 1, nd).getDay();
    const checkPattern = (limit: number): void => {
      const correctedWk = nd - (wd - limit);
      let snwd = correctedWk.toString();
      if (!this.ref.current) return;
      if (!DOMValidator.isDayInput(this.ref.current)) {
        if (snwd.length > 2) snwd = snwd.slice(0, 2);
        if (snwd.length < 2)
          snwd = StringHelper.padToISO(snwd);
      }
      if (rx.test(snwd)) d = snwd;
    };
    if (this.ref.current.dataset.minweekday)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.minweekday,
          base,
          "int"
        ) || 1
      );
    if (this.ref.current.dataset.maxweekday)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.maxweekday,
          base,
          "int"
        ) || 1
      );
    return d;
  }
  #limitByWeek(y: string, w: string): string {
    if (
      !this.ref.current?.dataset.minweek &&
      !this.ref.current?.dataset.maxweek &&
      !this.ref.current?.dataset.minmonth &&
      !this.ref.current?.dataset.maxmonth
    )
      return w ?? "01";
    const currY = new Date().getFullYear(),
      ny = MathHandler.parseNotNaN(y, currY, "int") || 1;
    let nw = MathHandler.parseNotNaN(w, 1, "int") || 1;
    const base = 1,
      rx = /\d{2}/;
    if (
      !this.ref.current.dataset.minweek &&
      this.ref.current.dataset.minmonth
    ) {
      this.ref.current.dataset.minweek =
        StringHelper.padToISO(
          DateMapper.getISOWeeksForMonth(
            ny,
            MathHandler.parseNotNaN(
              this.ref.current.dataset.minmonth,
              1,
              "int"
            ) || 1
          )[0]
        );
      this.ref.current.dataset.minweek =
        StringHelper.padToISO(
          this.ref.current.dataset.minweek,
          2
        );
    }
    if (
      this.ref.current.dataset.minweek &&
      !this.ref.current.dataset.minmonth
    ) {
      const minWeek =
        MathHandler.parseNotNaN(
          this.ref.current.dataset.minweek,
          1,
          "int"
        ) || 1;
      this.ref.current.dataset.minmonth =
        StringHelper.padToISO(
          DateMapper.getMonthForISOWeek(ny, minWeek) + 1
        );
      this.ref.current.dataset.minmonth =
        StringHelper.padToISO(
          this.ref.current.dataset.minmonth,
          2
        );
    }
    if (
      !this.ref.current.dataset.maxweek &&
      this.ref.current.dataset.maxmonth
    ) {
      const maxWeeks = DateMapper.getISOWeeksForMonth(
        ny,
        MathHandler.parseNotNaN(
          this.ref.current.dataset.maxmonth,
          1,
          "int"
        ) || 1
      );
      this.ref.current.dataset.maxweek =
        StringHelper.padToISO(
          maxWeeks[maxWeeks.length - 1]
        );
      this.ref.current.dataset.maxweek =
        StringHelper.padToISO(
          this.ref.current.dataset.maxweek,
          2
        );
    }
    if (
      this.ref.current.dataset.maxweek &&
      !this.ref.current.dataset.maxmonth
    ) {
      const maxWeek =
        MathHandler.parseNotNaN(
          this.ref.current.dataset.maxweek,
          53,
          "int"
        ) || 1;
      this.ref.current.dataset.maxmonth =
        StringHelper.padToISO(
          DateMapper.getMonthForISOWeek(ny, maxWeek) + 1
        );
      this.ref.current.dataset.maxmonth =
        StringHelper.padToISO(
          this.ref.current.dataset.maxmonth,
          2
        );
    }
    const checkPattern = (
      limit: number,
      isMax: boolean = false
    ): void => {
      const lastWNum = DateMapper.getLastISOWeekNum(ny);
      if (limit < 1) limit = 1;
      if (limit > lastWNum) limit = lastWNum;
      if (isMax && nw > limit) nw = limit;
      else if (!isMax && nw < limit) nw = limit;
      let snw = nw.toString();
      if (!this.ref.current) return;
      if (this.ref.current.type !== "week") {
        if (snw.length > 2) snw = snw.slice(0, 2);
        if (snw.length < 2)
          snw = StringHelper.padToISO(snw);
      }
      if (rx.test(snw)) w = snw;
    };
    if (this.ref.current.dataset.minweek)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.minweek,
          base,
          "int"
        ) || 1
      );
    if (this.ref.current.dataset.maxweek)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.maxweek,
          53,
          "int"
        ) || 1,
        true
      );
    let minMonth = 1,
      maxMonth = 12;
    const validWeeksForMinMonth: number[] = [],
      validWeeksForMaxMonth: number[] = [];
    if (this.ref.current.dataset.minmonth) {
      minMonth =
        MathHandler.parseNotNaN(
          this.ref.current.dataset.minmonth,
          1,
          "int"
        ) || 1;
      DateMapper.getISOWeeksForMonth(ny, minMonth).forEach(
        w => validWeeksForMinMonth.push(w)
      );
    }
    if (this.ref.current.dataset.maxmonth) {
      maxMonth =
        MathHandler.parseNotNaN(
          this.ref.current.dataset.maxmonth,
          12,
          "int"
        ) || 1;
      DateMapper.getISOWeeksForMonth(ny, maxMonth).forEach(
        w => validWeeksForMaxMonth.push(w)
      );
    }
    if (
      validWeeksForMinMonth.length > 0 &&
      nw < validWeeksForMinMonth[0]
    )
      nw = validWeeksForMinMonth[0];
    const lastW =
      validWeeksForMaxMonth[
        validWeeksForMaxMonth.length - 1
      ];
    if (validWeeksForMaxMonth.length > 0 && nw > lastW)
      nw = lastW;
    return StringHelper.padToISO(nw);
  }
  #limitByHour(h: string): string {
    if (
      !this.ref.current?.dataset.minhour &&
      !this.ref.current?.dataset.maxhour
    )
      return h ?? "01";
    const base = 0,
      rx = /\d{2}/;
    let nh = MathHandler.parseNotNaN(h, base, "int") || 1;
    const checkPattern = (
      limit: number,
      isMax: boolean = false
    ): void => {
      if (limit < 0) limit = 0;
      if (limit > 23) limit = 23;
      if (isMax && nh > limit) nh = limit;
      else if (!isMax && nh < limit) nh = limit;
      let snh = nh.toString();
      if (!this.ref.current) return;
      if (!DOMValidator.isHourInput(this.ref.current)) {
        if (snh.length > 2) snh = snh.slice(0, 2);
        if (snh.length < 2)
          snh = StringHelper.padToISO(snh);
      }
      if (rx.test(snh)) h = snh;
    };
    if (this.ref.current.dataset.minhour)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.minhour,
          base,
          "int"
        ) || 1
      );
    if (this.ref.current.dataset.maxhour)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.maxhour,
          24,
          "int"
        ) || 1,
        true
      );
    return h;
  }
  #limitByMinute(m: string): string {
    if (
      !this.ref.current?.dataset.minminute &&
      !this.ref.current?.dataset.maxminute
    )
      return m ?? "01";
    const base = 0,
      rx = /\d{2}/;
    let nm = MathHandler.parseNotNaN(m, base, "int") || 1;
    const checkPattern = (
      limit: number,
      isMax: boolean = false
    ): void => {
      if (limit < 0) limit = 0;
      if (limit > 59) limit = 59;
      if (isMax && nm > limit) nm = limit;
      else if (!isMax && nm < limit) nm = limit;
      let snm = nm.toString();
      if (!this.ref.current) return;
      if (!DOMValidator.isHourInput(this.ref.current)) {
        if (snm.length > 2) snm = snm.slice(0, 2);
        if (snm.length < 2)
          snm = StringHelper.padToISO(snm);
      }
      if (rx.test(snm)) m = snm;
    };
    if (this.ref.current.dataset.minminute)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.minminute,
          base,
          "int"
        ) || 1
      );
    if (this.ref.current.dataset.maxminute)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.maxminute,
          60,
          "int"
        ) || 1,
        true
      );
    return m;
  }
  #limitBySecond(s: string): string {
    if (
      !this.ref.current?.dataset.minsec &&
      !this.ref.current?.dataset.maxsec
    )
      return s ?? "01";
    const base = 0,
      rx = /\d{2}/;
    let ns = MathHandler.parseNotNaN(s, base, "int") || 1;
    const checkPattern = (
      limit: number,
      isMax: boolean = false
    ): void => {
      if (limit < 0) limit = 0;
      if (limit > 59) limit = 59;
      if (isMax && ns > limit) ns = limit;
      else if (!isMax && ns < limit) ns = limit;
      let sns = ns.toString();
      if (!this.ref.current) return;
      if (!DOMValidator.isHourInput(this.ref.current)) {
        if (sns.length > 2) sns = sns.slice(0, 2);
        if (sns.length < 2)
          sns = StringHelper.padToISO(sns);
      }
      if (rx.test(sns)) s = sns;
    };
    if (this.ref.current.dataset.minsec)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.minsec,
          base,
          "int"
        ) || 1
      );
    if (this.ref.current.dataset.maxsec)
      checkPattern(
        MathHandler.parseNotNaN(
          this.ref.current.dataset.maxsec,
          60,
          "int"
        ) || 1,
        true
      );
    return s;
  }
}
