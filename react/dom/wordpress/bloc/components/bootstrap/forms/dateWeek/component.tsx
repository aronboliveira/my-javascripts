import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
export default class FormWeek extends Component<any, { value: string }> {
  r = createRef<HTMLInputElement>();
  l = createRef<HTMLLabelElement>();
  id: string;
  constructor(props: any) {
    super(props);
    this.id = ((): string => {
      if (!this.r.current)
        return `${new Date().getUTCMilliseconds()}-${new Date().getUTCMinutes()}-${new Date().getUTCHours()}-${new Date().getUTCDay()}-${new Date().getUTCMonth()}-${new Date().getUTCFullYear()}`;
      return fillIds(this.r.current);
    })();
    this.state = {
      value: "",
    };
  }
  public componentDidMount() {
    try {
      if (!this.r.current) return;
      gatherFormData(this.r.current, this.l.current);
    } catch (e) {
      console.error(`Error executing procedure to locate closest form:\n${(e as Error).message}`);
    }
  }
  public render(): JSX.Element {
    return (
      <>
        <label
          ref={this.l}
          data-block={`block__${this.id}`}
          id={`lab__${this.id}`}
          className="form-label"
          htmlFor={this.id}
          contentEditable
        >
          Campo de Semana Simples:
        </label>
        <input
          ref={this.r}
          data-block={`block__${this.id}`}
          className="form-control any-day-week"
          type="week"
          autoComplete="off"
          placeholder="Digite uma semana aqui!"
          id={this.id}
          value={this.state.value}
          onChange={ev => {
            const v = ev.currentTarget.value,
              [y, w] = v.split("-W").map(Number),
              ws = new Date(y, 0, (w - 1) * 7 + 1),
              wsd = ws.getDay(),
              m = ws.getMonth(),
              ms = new Date(y, m, 1).getDay(),
              diffs = (wsd === 0 ? 7 : wsd) - (ms === 0 ? 7 : ms),
              firstInMs = new Date(y, m, 1, 1).getDate(),
              lastInMs = new Date(y, m + 1, 0).getDate(),
              adjFirst = firstInMs + (diffs > 0 ? diffs : 0),
              adjLast = lastInMs - (6 - new Date(y, m, lastInMs).getDay()),
              wsdt = ws.getDate();
            let validDay = NaN;
            if (wsdt > adjLast && Number.isFinite(Math.floor(adjLast / 7)))
              validDay = Math.floor(adjLast / 7);
            else if (wsdt < adjFirst && Number.isFinite(Math.ceil(adjFirst / 7)))
              validDay = Math.floor(adjFirst / 7);
            else validDay = w;
            this.setState(prev => {
              value: Number.isFinite(validDay)
                ? `${y}-W${validDay.toString().padStart(2, "0")}`
                : prev;
            });
          }}
          style={{
            width: "90%",
          }}
        />
      </>
    );
  }
}
