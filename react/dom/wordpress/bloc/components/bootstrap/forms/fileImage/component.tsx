import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
export default class FormImageFile extends Component {
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
          Campo de Imagem:
        </label>
        <input
          ref={this.r}
          data-block={`block__${this.id}`}
          className="form-control inpFileImage"
          type="file"
          id={this.id}
          accept="image/*"
          capture="environment"
          style={{
            width: "90%",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='rgba(23, 23, 23, 0.7)' class='bi bi-file-earmark-image' viewBox='0 0 16 16'%3E%3Cpath d='M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3'/%3E%3Cpath d='M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1z'/%3E%3C/svg%3E")`,
            backgroundAttachment: "local",
            backgroundOrigin: "content-box",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "100%",
          }}
        ></input>
      </>
    );
  }
}
