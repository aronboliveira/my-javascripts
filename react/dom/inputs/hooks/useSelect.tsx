import { RefObject, useRef, useEffect } from "react";
export default function useSelect(): {
  r: RefObject<HTMLSelectElement | null>;
} {
  const r = useRef<HTMLSelectElement | null>(null);
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
  return { r };
}
