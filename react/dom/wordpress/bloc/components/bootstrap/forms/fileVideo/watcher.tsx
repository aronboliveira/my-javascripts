import { Component, createRef } from "react";
import { syncAriaStates } from "../../../../lib/global/handlers/gHandlers";
export default class FormVideoWatcher extends Component {
  r = createRef<HTMLSpanElement>();
  public componentDidMount(): void {
    syncAriaStates(
      (
        this.r.current?.closest(".form-file-wrapper") ??
        this.r.current?.closest("fieldset") ??
        document
      ).querySelectorAll("*")
    );
  }
  public render(): JSX.Element {
    return (
      <span
        ref={this.r}
        className="form-file-watcher"
        style={{ display: "none" }}
      ></span>
    );
  }
}
