import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
export default class FormDate extends Component {
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
  }
  public componentDidMount() {
    try {
      if (!this.r.current) return;
      gatherFormData(this.r.current, this.l.current);
      setTimeout(() => {
        //@ts-ignore
        if (wp) console.log(wp.blocks.getBlockTypes());
      }, 1000);
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
          className="form-label"
          htmlFor={this.id}
          data-block={`block__${this.id}`}
          contentEditable
        >
          Campo de Data Simples:
        </label>
        <input
          ref={this.r}
          data-block={`block__${this.id}`}
          className="form-control any-day"
          type="date"
          name={`date__${this.id}`}
          autoComplete="off"
          placeholder="Digite uma data aqui!"
          id={this.id}
          style={{
            width: "90%",
          }}
        ></input>
      </>
    );
  }
}
