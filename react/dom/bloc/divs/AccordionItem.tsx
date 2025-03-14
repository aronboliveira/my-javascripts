import { ErrorBoundary } from "react-error-boundary";
import { AccordItemProps } from "../../lib/declarations/interfaces";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { useRef, useEffect } from "react";
import {
  nullishBtn,
  nullishDiv,
  nullishHeading,
} from "../../lib/declarations/types";
import { htmlElementNotFound } from "../../lib/handlers/handlersErrors";
import {
  adjustHeadings,
  adjustIdentifiers,
  capitalizeFirstLetter,
  syncAriaStates,
} from "../../lib/handlers/handlersCmn";
import { basePath } from "../../gVariables";

export default function AccordionItem({
  parentId,
  baseId,
  headerText,
  innerText,
  defShow = false,
  lastItem = false,
}: AccordItemProps): JSX.Element {
  const mainRef = useRef<nullishDiv>(null);
  const headingRef = useRef<nullishHeading>(null);
  const btnRef = useRef<nullishBtn>(null);
  const collapseRef = useRef<nullishDiv>(null);
  useEffect(() => {
    try {
      if (!(mainRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          mainRef.current,
          `Validation of Main Reference instance`,
        );
      syncAriaStates(mainRef.current);
      adjustIdentifiers(mainRef.current);
      mainRef.current.closest(".accordion") &&
        mainRef.current
          .closest(".accordion")!
          .querySelector(".accordion-item") &&
        mainRef.current
          .closest(".accordion")!
          .querySelector(".accordion-item")!
          .classList.add(`first-accordion-item`);
      lastItem && mainRef.current.classList.add("last-accordion-item");
    } catch (e) {
      console.error(
        `Error executing useEffect for mainRef in Accordion for ${
          baseId || "undefined"
        }:\n${(e as Error).message}`,
      );
    }
  }, [mainRef, baseId, lastItem]);
  useEffect(() => {
    adjustHeadings(headingRef.current);
  }, [headingRef]);
  useEffect(() => {
    try {
      if (!(btnRef.current instanceof HTMLButtonElement))
        throw htmlElementNotFound(
          btnRef.current,
          `validation of Button Reference in accordion item`,
          ["HTMLButtonElement"],
        );
      if (!(collapseRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          collapseRef.current,
          `validation of accordion collapsable in accordion item`,
        );
    } catch (e) {
      console.error(
        `Error executing procedure for rotuing in accordion item:\n${
          (e as Error).message
        }`,
      );
    }
  }, [btnRef, collapseRef]);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message='Erro carregando item do acordeão' />
      )}>
      <div
        className='accordion-item'
        id={`item${capitalizeFirstLetter(baseId)}`}
        ref={mainRef}>
        <h3
          className='accordion-header'
          id={`header${capitalizeFirstLetter(baseId)}`}
          ref={headingRef}>
          <button
            ref={btnRef}
            className={`accordion-button ${!defShow && "collapsed"}`}
            type='button'
            id={`btn${capitalizeFirstLetter(baseId)}`}
            data-bs-toggle='collapse'
            data-bs-target={`#${baseId}`}
            aria-expanded={!defShow ? false : true}
            aria-controls={`${baseId}`}
            onClick={ev => {
              const activeQuery = /\?q=/g.test(location.href)
                ? `${location.href.slice(
                    location.href.indexOf("?q="),
                    location.href.indexOf("?&"),
                  )}`
                : "";
              history.pushState({}, "", `${basePath}${activeQuery}?&info`);
              if (!ev.currentTarget.classList.contains("collapsed") || defShow)
                history.pushState({}, "", `${location.href}&${baseId}`);
              else history.pushState({}, "", `${basePath}${activeQuery}?&info`);
            }}>
            {headerText}
          </button>
        </h3>
        <div
          ref={collapseRef}
          id={`${baseId}`}
          className={`accordion-collapse collapse ${defShow && "show"}`}
          data-bs-parent={`#${parentId}`}>
          <div
            className='accordion-body'
            id={`body${capitalizeFirstLetter(baseId)}`}>
            {innerText}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
