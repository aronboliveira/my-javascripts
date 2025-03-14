import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
import { addEmailExtension } from "../../../../lib/global/gModel";
import { handleCondtReq } from "../../../../lib/global/handlers/gHandlers";
export default class FormEmail extends Component {
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
          Campo de E-mail Simples:
        </label>
        <input
          ref={this.r}
          data-block={`block__${this.id}`}
          className="form-control inpEmail"
          type="email"
          name={`email__${this.id}`}
          inputMode="numeric"
          autoComplete="email"
          maxLength={536870911}
          placeholder="Digite um e-mail aqui!"
          pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          autoCapitalize="false"
          id={this.id}
          style={{
            width: "90%",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(23, 23, 23, 0.7)' class='bi bi-envelope-at-fill' viewBox='0 0 16 16'%3E%3Cg transform='translate(8, 4) scale(0.5)'%3E%3Cpath d='M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 9.671V4.697l-5.803 3.546.338.208A4.5 4.5 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671'%3E%3C/path%3E%3Cpath d='M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`,
            backgroundPosition: "100%",
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "content-box",
            backgroundAttachment: "local",
          }}
          onInput={ev => {
            addEmailExtension(ev.currentTarget);
            handleCondtReq(ev.currentTarget, {
              min: 6,
              pattern: ["@", "g"],
            });
          }}
          onClick={ev => addEmailExtension(ev.currentTarget)}
        ></input>
      </>
    );
  }
}
