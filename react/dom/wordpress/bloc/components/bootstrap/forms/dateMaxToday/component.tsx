import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
export default class FormMaxData extends Component {
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
          Campo de Data a Ocorrer:
        </label>
        <input
          ref={this.r}
          data-block={`block__${this.id}`}
          className="form-control max-curr-day"
          type="date"
          autoComplete="off"
          placeholder="Digite uma data aqui!"
          name={`date_max__${this.id}`}
          id={this.id}
          style={{
            width: "90%",
          }}
          max={new Date().toISOString().split("T")[0]}
        ></input>
      </>
    );
  }
}
