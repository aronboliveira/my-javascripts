import { Component, createRef } from "react";
import {
  fillIds,
  gatherFormData,
  pushSelectOpts,
} from "../../../../lib/global/handlers/blockHandlers";
import { rc } from "../../../../vars";
export default class FormSelectMultiple extends Component {
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
          Campo de Selação Múltipla
        </label>
        <select
          className="form-select"
          multiple
          id={this.id}
          name={`select_multiple__${this.id}`}
          data-block={`block__${this.id}`}
          style={{
            width: "90%",
            minHeight: "2.5rem",
          }}
          onClick={ev => {
            let targ = ev.currentTarget;
            if (!(targ instanceof HTMLSelectElement || (targ as any) instanceof HTMLOptionElement))
              return;
            const updateOpts = (targ: HTMLSelectElement): void => {
              const clickEl = document.elementFromPoint(ev.clientX, ev.clientY);
              try {
                if (clickEl instanceof HTMLOptionElement) {
                  if (!clickEl.classList.contains("selected")) clickEl.selected = false;
                  if (!rc[targ.id]) rc[targ.id] = {};
                  if (!Array.isArray(rc[targ.id]?.lastOpts)) rc[targ.id].lastOpts = [];
                  if (!Array.isArray(rc[targ.id]?.lastOpts))
                    console.warn(`Failed to fetch recent last options for the <select>`);
                  else {
                    for (const o of Object.values(rc[targ.id].lastOpts)) {
                      const sOp = Array.from(targ.options).find(op => op.value === o);
                      if (sOp && o !== clickEl.value) {
                        sOp.selected = true;
                        sOp.ariaSelected = "true";
                      }
                    }
                  }
                  pushSelectOpts(targ, targ.id, Array.from(targ.selectedOptions));
                }
              } catch (e) {
                console.error(`Error executing updateOpts:\n${(e as Error).message}`);
              }
            };
            if (targ instanceof HTMLSelectElement) updateOpts(targ);
            else {
              targ = (targ as HTMLOptionElement).closest("select") as any;
              if (!(targ instanceof HTMLSelectElement)) {
                console.warn(`Failed to fetch parent select`);
                return;
              }
              updateOpts(targ);
            }
          }}
          onMouseDown={ev => {
            try {
              const clickEl = document.elementFromPoint(ev.clientX, ev.clientY);
              if (clickEl instanceof HTMLOptionElement) clickEl.classList.toggle("selected");
            } catch (e) {
              console.error(`Error executing toggleOption:\n${(e as Error).message}`);
            }
          }}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <option data-block={`block__${this.id}`} value={`opcao_${i + 1}`}>
              Opção {i + 1}
            </option>
          ))}
        </select>
        <div
          className="form-text"
          id={`tip__${this.id}`}
          contentEditable
          data-block={`block__${this.id}`}
        >
          Escreva uma dica aqui ou remova o texto.
        </div>
      </>
    );
  }
}
