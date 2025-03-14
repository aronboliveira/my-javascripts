import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
export default class FormSearch extends Component {
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
          Campo de Pesquisa Simples:
        </label>
        <input
          ref={this.r}
          data-block={`block__${this.id}`}
          className="form-control inpSearch"
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder="Digite uma pesquisa aqui!"
          maxLength={536870911}
          autoCapitalize="false"
          id={this.id}
          style={{
            width: "90%",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(23, 23, 23, 0.7)' class='bi bi-search' viewBox='0 0 16 24'%3E%3Cg transform='translate(0, 5)'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundPosition: "100%",
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "content-box",
            backgroundAttachment: "local",
          }}
        ></input>
      </>
    );
  }
}
