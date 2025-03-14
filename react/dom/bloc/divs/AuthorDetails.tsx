import { htmlElementNotFound } from "../../lib/handlers/handlersErrors";
import { useEffect, useRef } from "react";
import { AuthorTextProps } from "../../lib/declarations/interfaces";
import { nullishDetail } from "../../lib/declarations/types";
import {
  adjustIdentifiers,
  normalizeSpacing,
  syncAriaStates,
} from "../../lib/handlers/handlersCmn";
import AuthorText from "./AuthorText";

export default function AuthorDetails(props: AuthorTextProps): JSX.Element {
  const normalizedId = normalizeSpacing(props.authorTitle);
  const detailRef = useRef<nullishDetail>(null);
  useEffect(() => {
    try {
      if (!(detailRef.current instanceof HTMLDetailsElement))
        throw htmlElementNotFound(
          detailRef.current,
          `validation of Details Reference instance`,
          ["HTMLDetailsElement"],
        );
      syncAriaStates(detailRef.current);
      adjustIdentifiers(detailRef.current);
      setTimeout(() => {
        if (!detailRef.current) return;
        if (new RegExp(detailRef.current.id, "gi").test(location.href))
          detailRef.current.open = true;
      }, 300);
    } catch (e) {
      console.error(
        `Error executing useEffect for detailsRef:\n${(e as Error).message}`,
      );
    }
  }, [detailRef]);
  return (
    <details
      className='authorCoprDetails'
      id={normalizedId}
      ref={detailRef}
      onToggle={ev => {
        const prevHistory = location.href;
        try {
          if (ev.currentTarget.id !== "" && ev.currentTarget.open) {
            !new RegExp(ev.currentTarget.id, "gi").test(location.href) &&
              history.pushState(
                {},
                "",
                `${location.href}&${ev.currentTarget.id}`,
              );
          } else
            history.pushState(
              {},
              "",
              `${location.href.replace(`&${ev.currentTarget.id}`, "")}`,
            );
        } catch (e) {
          console.error(
            `Error executing callback for ${ev.type} in ${
              ev.currentTarget.id || ev.currentTarget.tagName
            }:${(e as Error).message}`,
          );
          history.pushState({}, "", prevHistory);
        }
      }}>
      <summary
        style={{ color: "#000" }}
        className='authorCoprSummary'
        id={`summary-${normalizedId}`}>
        {props.authorTitle}
      </summary>
      <AuthorText
        authorTitle={props.authorTitle}
        authorName={props.authorName}
        authorDetails={props.authorDetails}
        links={props.links}
      />
    </details>
  );
}
