import { useEffect, useRef } from "react";
import { htmlElementNotFound } from "../../lib/handlers/handlersErrors";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { AuthorCardProps } from "../../lib/declarations/interfaces";
import {
  adjustIdentifiers,
  normalizeSpacing,
  syncAriaStates,
} from "../../lib/handlers/handlersCmn";
import { nullishDiv } from "../../lib/declarations/types";

export default function AuthorCard({
  authorName,
  authorDetails,
  imgSrc,
}: AuthorCardProps): JSX.Element {
  const normalizedAuthorName = normalizeSpacing(authorName);
  const mainRef = useRef<nullishDiv>(null);
  useEffect(() => {
    try {
      if (!(mainRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          mainRef.current,
          `Validation of Author card for ${
            authorName || "unidentified author"
          } Main Reference`,
        );
      syncAriaStates(mainRef.current);
      adjustIdentifiers(mainRef.current);
      const closestLi = mainRef.current.closest("li");
      if (closestLi instanceof HTMLElement && closestLi.id === "") {
        closestLi.id = `${normalizedAuthorName}Item`;
      }
    } catch (e) {
      console.error(
        `Error executing useEffect for AuthorCard:${(e as Error).message}`,
      );
    }
  }, [authorName, normalizedAuthorName]);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message='Erro carregando card de autor!' />
      )}>
      <div className='form-control authorMainDiv' ref={mainRef}>
        <figure className='authorFig' id={`${normalizedAuthorName}Fig`}>
          <img
            className='authorImg'
            loading='lazy'
            src={`${imgSrc}`}
            alt='Imagem de Autor'
            id={`${normalizedAuthorName}Img`}
          />
        </figure>
        <div className='authorDesc' id={`${normalizedAuthorName}Desc`}>
          <h3 className='authorName' id={`${normalizedAuthorName}Name`}>
            {authorName || "Anônimo"}
          </h3>
          <p className='authorDetails' id={`${normalizedAuthorName}Details`}>
            {authorDetails || "Não descrito"}
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
}
