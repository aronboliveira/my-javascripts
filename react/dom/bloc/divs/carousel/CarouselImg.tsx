import { ErrorBoundary } from "react-error-boundary";
import GenericErrorComponent from "../errors/ErrorComponentGeneric";
import { CarouselImgProps } from "src/lib/declarations/interfaces";
import { useRef, useEffect } from "react";
import { nullishDiv, nullishImg } from "src/lib/declarations/types";
import {
  htmlElementNotFound,
  markWithCommentary,
  stringError,
} from "src/lib/handlers/handlersErrors";
import {
  capitalizeFirstLetter,
  textTransformPascal,
} from "src/lib/handlers/handlersStyles";

export default function CarouselImg(props: CarouselImgProps): JSX.Element {
  // console.log("!CAROUSEL: 9. Reached CarouselImg call");
  const itemRef = useRef<nullishDiv>(null);
  const imgRef = useRef<nullishImg>(null);
  useEffect(() => {
    // console.log("!CAROUSEL: 10.1. Reached useEffect for CarouselImg");
    try {
      if (!(imgRef.current instanceof HTMLImageElement))
        throw htmlElementNotFound(
          imgRef.current,
          `validation of image for carousel ${
            (imgRef.current as any)?.closest(".carousel") || "unidentified"
          }`,
          ["HTMLImageElement"]
        );
      if (
        !props.subDir ||
        props.subDir === "" ||
        !props.fullName ||
        props.fullName === ""
      )
        console.warn(`!CAROUSEL: Error forming string for src`);
      if (!props.subDir || props.subDir === "")
        throw stringError(props.subDir, "any string");
      if (!props.fullName || props.fullName === "")
        throw stringError(props.fullName, "any string");
      const relCarousel = imgRef.current.closest(".carousel");
      if (!(relCarousel instanceof HTMLElement))
        console.warn(`Error checking Related Carousel`);
      else {
        // console.log(
        //   "!Carousel: 10.2. useEffect for CarouselImg was successful"
        // );
        const firstImg = relCarousel.querySelector("img");
        const currImgs = relCarousel.querySelectorAll("img");
        const currNImgs = currImgs.length;
        // console.log("NUMBER OF IMAGES");
        // console.log(currNImgs);
        if (imgRef.current.id === "")
          imgRef.current.id = `carouselImg${currNImgs}${
            capitalizeFirstLetter(relCarousel.parentElement!.id) ||
            textTransformPascal(relCarousel.parentElement!.tagName)
          }`;
        imgRef.current.classList.add(
          `carouselImg`,
          `carouselImg${
            capitalizeFirstLetter(relCarousel.parentElement!.id) ||
            textTransformPascal(relCarousel.parentElement!.tagName)
          }`
        );
        if (imgRef.current === firstImg || currNImgs === 1) {
          if (
            getComputedStyle(imgRef.current.parentElement!).position !==
            "relative"
          )
            imgRef.current.parentElement!.style.position === "relative";
          try {
            if (!(itemRef.current instanceof HTMLElement))
              throw htmlElementNotFound(
                itemRef.current,
                `validation of carousel-item`,
                ["HTMLElement"]
              );
            itemRef.current.classList.add("active");
          } catch (e) {
            console.error(
              `Error executing routine for adding active class to item:${
                (e as Error).message
              }`
            );
          }
        } else {
          const firstImage = imgRef.current.parentElement!.querySelector("img");
          try {
            if (
              !(imgRef.current.parentElement instanceof HTMLElement) ||
              !(firstImage instanceof HTMLImageElement)
            )
              throw htmlElementNotFound(
                firstImage,
                `validation of firstImage in carousel ${
                  relCarousel.id || "unidentified"
                }`,
                ["HTMLImageElement"]
              );
            imgRef.current.style.top = imgRef.current.parentElement.style.top;
            imgRef.current.style.left = imgRef.current.parentElement.style.left;
          } catch (e) {
            markWithCommentary(
              firstImage,
              `validation of First Image in Carousel`
            );
            console.error(
              `Error executing routine for placeholding image:\n${
                (e as Error).message
              }`
            );
          }
          try {
            if (!(itemRef.current instanceof HTMLElement))
              throw htmlElementNotFound(
                itemRef.current,
                `validation of carousel-item`,
                ["HTMLElement"]
              );
            if (itemRef.current.classList.contains("active"))
              itemRef.current.classList.remove("active");
          } catch (e) {
            console.error(
              `Error executing routine for adding active class to item:${
                (e as Error).message
              }`
            );
          }
        }
      }
      imgRef.current.classList.add(`carouselImg`);
    } catch (e) {
      console.error(
        `Error executing useEffect for Carousel Image:\n${(e as Error).message}`
      );
    }
  }, [imgRef]);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <GenericErrorComponent message="Error loading Carousel Image 👾" />
      )}
    >
      <div className="carousel-item" ref={itemRef}>
        <img
          ref={imgRef}
          className="caroulselImg"
          src={`${props.subDir}${props.fullName}`}
          alt={`${props.fullName.slice(0, props.fullName.lastIndexOf("."))}`}
          loading="lazy"
        ></img>
      </div>
    </ErrorBoundary>
  );
}
