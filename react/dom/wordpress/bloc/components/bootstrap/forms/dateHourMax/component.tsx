import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
export default class FormDateHourMax extends Component {
  r = createRef<HTMLInputElement>();
  l = createRef<HTMLLabelElement>();
  id: string;
  constructor(props: any) {
    super(props);
    this.id = "";
  }
  public componentDidMount() {
    try {
      if (!this.r.current) return;
      this.id = fillIds(this.r.current);
      gatherFormData(this.r.current, this.l.current);
      this.forceUpdate();
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
          Campo de Data com Horário já Ocorrido:
        </label>
        <input
          ref={this.r}
          data-block={`block__${this.id}`}
          className="form-control any-day-hour-max"
          type="datetime-local"
          name={`datetime_max__${this.id}`}
          autoComplete="off"
          placeholder="Digite uma data e horário aqui!"
          id={this.id}
          style={{
            width: "90%",
          }}
          max={new Date().toISOString().slice(0, 16)}
        ></input>
      </>
    );
  }
}
