import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
export default class FormRange extends Component {
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
          id={`lab__${this.id}`}
          data-block={`block__${this.id}`}
          className="form-label"
          htmlFor={this.id}
          contentEditable
        >
          Campo de Variação Simples:
        </label>
        <input
          ref={this.r}
          data-block={`block__${this.id}`}
          className="form-range horizontal-range"
          type="range"
          min={0}
          max={100}
          id={this.id}
          name={`range__${this.id}`}
          style={{
            width: "90%",
          }}
        />
        <div className="form-text">Insira aqui uma dica ou remova o texto.</div>
      </>
    );
  }
}
