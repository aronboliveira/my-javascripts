import ReactDOM from "react-dom";
import FormSelectWatcher from "./watcher";
addEventListener("DOMContentLoaded", () => {
  for (const el of document.querySelectorAll("input.form-control")) {
    if (!(el instanceof HTMLInputElement)) continue;
    try {
      const watcher = el.closest(".form-control-wrapper")?.querySelector(".formControlWatcher");
      if (!watcher) throw new Error(`Failed to locate form control watcher`);
      ReactDOM.render(<FormSelectWatcher />, watcher);
    } catch (e) {
      console.error(
        `Error executing procere for ${el.id || el.className || el.tagName}\n:${
          (e as Error).message
        }`,
      );
    }
  }
});
