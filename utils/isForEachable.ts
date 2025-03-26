export function isForEachable(e: any): boolean {
  return (
    Array.isArray(e) ||
    e instanceof Map ||
    e instanceof Set ||
    e instanceof NodeList ||
    e instanceof DOMTokenList ||
    e instanceof URLSearchParams ||
    e instanceof Headers ||
    e instanceof CSSTransformValue ||
    e instanceof CSSUnparsedValue ||
    e instanceof FontFaceSet ||
    e instanceof MediaKeyStatusMap ||
    e instanceof StylePropertyMapReadOnly ||
    e instanceof RTCStatsReport ||
		//@ts-ignore
    e instanceof XRInputSourceArray ||
		//@ts-ignore
    e instanceof KeyboardLayoutMap ||
		//@ts-ignore
    e instanceof CustomStateSet ||
		//@ts-ignore
    e instanceof Highlight ||
		//@ts-ignore
    e instanceof HighlightRegistry
  );
}
