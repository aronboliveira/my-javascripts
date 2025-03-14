import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
import { formatTel } from "../../../../lib/global/gModel";
export default class FormTel extends Component {
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
          Campo de Telefone Simples:
        </label>
        <input
          ref={this.r}
          data-block={`block__${this.id}`}
          className="form-control inpTel"
          type="tel"
          inputMode="tel"
          minLength={8}
          maxLength={13}
          data-reqlength="8"
          data-maxlength="13"
          data-pattern="\d{1,2}\s?9?\d{4}-\d{4}"
          placeholder="Digite um telefone aqui!"
          id={this.id}
          style={{
            width: "90%",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(23, 23, 23, 0.7)' class='bi bi-telephone' viewBox='0 0 16 24'%3E%3Cg transform='translate(0, 5)'%3E%3Cpath d='M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58z'/%3E%3C/g%3E%3C/svg%3E");`,
            backgroundPosition: "100%",
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "content-box",
            backgroundAttachment: "local",
          }}
          onInput={ev => {
            formatTel(ev.currentTarget, false);
          }}
        ></input>
      </>
    );
  }
}
