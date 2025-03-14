import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
export default class FormText extends Component {
  r = createRef<HTMLTextAreaElement>();
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
          Campo de Texto Longo:
        </label>
        <textarea
          ref={this.r}
          data-block={`block__${this.id}`}
          className="form-control"
          autoCapitalize="false"
          placeholder="Digite um texto aqui!"
          id={this.id}
          style={{
            width: "90%",
            backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%2216%22 height%3D%2216%22 fill%3D%22currentColor%22 class%3D%22bi bi-card-text%22 viewBox%3D%220 0 16 16%22%3E%3Cpath d%3D%22M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z%22/%3E%3Cpath d%3D%22M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8m0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5%22/%3E%3C/svg%3E');`,
            backgroundPosition: "100%",
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "content-box",
            backgroundAttachment: "local",
          }}
        ></textarea>
        <div className="form-text form-tip" id={`tip__${this.id}`} contentEditable>
          Insira aqui a sua dica ou remova o texto.
        </div>
      </>
    );
  }
}
