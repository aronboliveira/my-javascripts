import { RefObject, useRef, useEffect } from "react";
export default function useInput(): { r: RefObject<HTMLInputElement | null> } {
  const r = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!r.current) return;
    r.current.labels?.forEach((l) => {
      if (!r.current) return;
      if (l.htmlFor !== r.current.id) l.htmlFor = r.current.id;
    });
  }, [r]);
  useEffect(() => {
    if (!r.current) return;
    if (!r.current.dataset.form)
      r.current.dataset.form =
        (r.current.form || r.current.closest("form"))?.id || "";
  }, [r]);
  useEffect(() => {
    if (!r.current) return;
    const cli = r.current.closest(".countingLi");
    if (cli) {
      r.current.dataset.listed = "true";
      r.current.classList.add(`${cli.id}_input`);
    }
  }, []);
  return { r };
}
