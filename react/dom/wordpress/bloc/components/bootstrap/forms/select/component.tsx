import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
export default class FormSelect extends Component {
  r = createRef<HTMLSelectElement>();
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
          className="form-label"
          htmlFor={this.id}
          contentEditable
          id={`lab__${this.id}`}
          data-block={`block__${this.id}`}
        >
          Campo de Selação
        </label>
        <select
          className="form-select"
          id={this.id}
          name={`select_one__${this.id}`}
          data-block={`block__${this.id}`}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <option data-block={`block__${this.id}`} value={`opcao_${i + 1}`}>
              Opção {i + 1}
            </option>
          ))}
        </select>
        <div
          className="form-text"
          id={`tip__${`tip__${this.id}`}`}
          contentEditable
          data-block={`block__${this.id}`}
        >
          Escreva uma dica aqui ou remova o texto.
        </div>
      </>
    );
  }
}
