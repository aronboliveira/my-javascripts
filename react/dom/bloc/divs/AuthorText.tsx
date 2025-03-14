import { useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AuthorTextProps } from "../../lib/declarations/interfaces";
import { nullishDiv, nullishHeading } from "../../lib/declarations/types";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import {
  adjustIdentifiers,
  capitalizeFirstLetter,
  syncAriaStates,
} from "../../lib/handlers/handlersCmn";
import { htmlElementNotFound } from "../../lib/handlers/handlersErrors";
import { createRoot } from "react-dom/client";
import BehanceIcon from "../../icons/BehanceIcon";
import GithubIcon from "../../icons/GitHubIcon";
import LinkedinIcon from "../../icons/LinkedinIcon";
export default function AuthorText(props: AuthorTextProps): JSX.Element {
  const mainRef = useRef<nullishDiv>(null);
  const headingRef = useRef<nullishHeading>(null);
  useEffect(() => {
    try {
      if (!(mainRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          mainRef.current,
          `validation of Main Refenrece for ${
            props.authorName || "undefined Author Name"
          }`,
        );
      syncAriaStates(mainRef.current);
      adjustIdentifiers(mainRef.current);
      mainRef.current.querySelectorAll("a").forEach((a, i) => {
        try {
          if (/behance/gis.test(a.href)) createRoot(a).render(<BehanceIcon />);
          else if (/github/gis.test(a.href))
            createRoot(a).render(<GithubIcon />);
          else if (/linkedin/gis.test(a.href))
            createRoot(a).render(<LinkedinIcon />);
        } catch (e) {
          console.error(
            `Error executing iteration ${i} of anchor effects:\n${
              (e as Error).message
            }`,
          );
        }
      });
    } catch (e) {
      console.error(
        `Error executing useEffect for Main Reference:\n${
          (e as Error).message
        }`,
      );
    }
  }, [mainRef, props.authorName]);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message='Erro gerando descrição para autor!' />
      )}>
      <div
        ref={mainRef}
        id={`divAuthorCopr${capitalizeFirstLetter(props.authorName)}`}
        className='authorCoprDiv'>
        <h4 ref={headingRef}>{props.authorName}</h4>
        <p>{props.authorDetails}</p>
        {props.links && (
          <nav
            className='authorSocialLinks'
            id={`socialLinks${capitalizeFirstLetter(props.authorName)}`}>
            {props.links.map((link, i) => (
              <a
                href={link}
                id={`linkAuthorCopr${capitalizeFirstLetter(
                  props.authorName,
                )}${i}`}
                target='_blank'
                className='linkAuthorCopr'
                key={`linkAuthorCopr${i}`}
                rel='noreferrer'>
                <code>{link}</code>
              </a>
            ))}
          </nav>
        )}
      </div>
    </ErrorBoundary>
  );
}
