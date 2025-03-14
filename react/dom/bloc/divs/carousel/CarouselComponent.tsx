import { useEffect, useRef, useState } from "react";
import { htmlElementNotFound } from "src/lib/handlers/handlersErrors";
import {
  adjustCarouselDot,
  capitalizeFirstLetter,
  generateCarousel,
} from "src/lib/handlers/handlersStyles";
import { CarouselProps } from "src/lib/declarations/interfaces";
import { nullishDiv } from "src/lib/declarations/types";
import { ErrorBoundary } from "react-error-boundary";
// import LoginMainBody from "./LoginMainBody";
import CarouselImg from "./CarouselImg";
import { parseFinite } from "src/lib/handlers/handlersMath";
// import { formatForBst } from "src/lib/handlersFormatFill";
// import { roots } from "src/lib/controller";
import GenericErrorComponent from "../errors/ErrorComponentGeneric";

export default function CarouselComponent({
  ParentComponentName,
  // root,
  imgNames,
}: CarouselProps): JSX.Element {
  // console.log("!CAROUSEL: 3.1. Reached Component call");
  const [imageList, setImageList] = useState<string[]>(imgNames);
  const [loaded, setLoaded] = useState<boolean>(false);
  const mainRef = useRef<nullishDiv>(null);
  const carouselRef = useRef<nullishDiv>(null);
  const divImgRef = useRef<nullishDiv>(null);
  const dotsRef = useRef<nullishDiv>(null);
  useEffect(() => {
    // console.log("!CAROUSEL: 4.1. Reached carouselRef useEffect");
    try {
      if (!(mainRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          mainRef.current,
          `Main Reference in ${ParentComponentName}`,
          ["HTMLElement"]
        );
      if (!(carouselRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          carouselRef.current,
          `Carouself Reference in ${ParentComponentName}`,
          ["HTMLElement"]
        );
      // console.log("!CAROUSEL: 4.2. useEffect for carouselRef try succesful");
      generateCarousel(true, carouselRef.current);
      try {
        const bootstrap = require("bootstrap");
        const carouselInstance = new bootstrap.Carousel(carouselRef.current!);
        console.log(carouselInstance);
      } catch (e) {
        console.error(
          `Error executing routine for classifying bootstrap in Carousel:\n${
            (e as Error).message
          }`
        );
      }
      const footer = document.querySelector("footer");
      try {
        if (!(footer instanceof HTMLElement && footer.tagName === "FOOTER"))
          throw htmlElementNotFound(footer, `validation of footer element`, [
            "<footer>",
          ]);
        const headerElFooter = document.querySelector(".headerElFooter");
        if (!(headerElFooter instanceof HTMLElement))
          throw htmlElementNotFound(
            headerElFooter,
            `validation of Header Element in Footer`,
            ["HTMLElement"]
          );
        const difBottomFooterSects = Math.max(
          parseFinite(getComputedStyle(headerElFooter).paddingBottom) || 0,
          Array.from(footer.children).reduce((acc, child) => {
            return acc <= 0
              ? 0
              : Math.abs(acc - child.getBoundingClientRect().bottom);
          }, 0)
        );
        // console.log(difBottomFooterSects);
        if (
          Number.isFinite(difBottomFooterSects) &&
          difBottomFooterSects >= 0
        ) {
          carouselRef.current!.style.transform = `translate(0, -${
            (parseFinite(getComputedStyle(carouselRef.current).height) +
              difBottomFooterSects) /
            20
          }px)`;
        } else {
          console.warn(`Error reading difference between Sections of Footer:
          Is Finite: ${Number.isFinite(difBottomFooterSects)};
          Is positive: ${difBottomFooterSects >= 0}`);
        }
      } catch (e) {
        console.error(
          `Error executing routine for equalizing Carousel with Footter:\n${
            (e as Error).message
          }`
        );
      }
    } catch (e) {
      console.error(
        `Error executing useEffect for carouselRef:\n${(e as Error).message}`
      );
    }
  }, []);
  useEffect(() => {
    // console.log("!CAROUSEL: 5.1. Reached divImgRef useEffect");
    try {
      if (!(divImgRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          divImgRef.current,
          `Div for Image content in <main>`,
          ["HTMLElement"]
        );
      // console.log("!Carousel: 5.2. useEffect for divImgRef sucessful");
      setLoaded(true);
    } catch (e) {
      console.error(
        `Error executing useEffect for divImgRef:${(e as Error).message}`
      );
    }
  }, [divImgRef, imageList]);
  useEffect(() => {
    // console.log("!CAROUSEL: 6.0. Reached loaded useEffect");
    loaded && setImageList(checkImgNames());
  }, [loaded]);
  useEffect(() => {
    // console.log("!CAROUSEL: 7.1. Reached useEffect for dotsRef");
    try {
      if (!(carouselRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          carouselRef.current,
          `validation of Carousel Reference`,
          ["HTMLElement"]
        );
      if (!(dotsRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          dotsRef.current,
          `validation of Dots container reference`,
          ["HTMLElement"]
        );
      // console.log("!CAROUSEL: 7.2. useEffect for dotsRef was Succesfull");
      adjustCarouselDot(
        Array.from(carouselRef.current.querySelectorAll(".dot")),
        carouselRef.current
      );
    } catch (e) {
      console.error(
        `Error executing useEffect for Carousel Dots:\n${(e as Error).message}`
      );
    }
  }, [dotsRef, loaded, imageList]);
  const checkImgNames = (): string[] => {
    if (imgNames.length === 0) console.warn(`No image names available`);
    if (imgNames.some(imgName => imgName === "")) {
      imgNames.forEach((imgName, i) => {
        imgName === "" && console.warn(`imgName ${i} is a empty string`);
      });
    }
    return Array.from(new Set(imgNames));
  };
  const renderImgs = (): JSX.Element[] => {
    // console.log("!CAROUSEL: 8. Reached renderImgs");
    // console.log(imageList);
    // console.log("!loaded " + loaded);
    return imageList.map((img, i) => {
      // if (i + 1 === imageList.length)
      // console.log(
      //   `!CAROUSEL: 8.${i}. Rendering CarouselImg, length ${imageList.length}`
      // );
      return (
        <CarouselImg
          key={`carouselImg-${carouselRef.current!.id || `brk`}${i}`}
          subDir={"img/campaigns/"}
          fullName={img}
        />
      );
    });
  };
  const renderIndicators = (): JSX.Element[] => {
    const dotBtns = imageList.map((img, i) => {
      // console.log(`RENDERING INDICATOR ${i}`);
      return (
        <button
          key={`carouselIndicator-${i}`}
          id={`indicator${capitalizeFirstLetter(img)}`}
          className={`dot dot${
            capitalizeFirstLetter(carouselRef.current?.id || "unidentified") ||
            "Unidentified"
          }`}
        ></button>
      );
    });
    return dotBtns;
  };
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <GenericErrorComponent message="Error rendering Carousel Container!"></GenericErrorComponent>
      )}
    >
      <div className="carouselParent" ref={mainRef}>
        <div ref={carouselRef} className="carousel">
          {imageList && (
            <ErrorBoundary FallbackComponent={() => <></>}>
              <div className="divCarouselDots" ref={dotsRef}>
                <ErrorBoundary FallbackComponent={() => <></>}>
                  {loaded && renderIndicators()}
                </ErrorBoundary>
              </div>
              <div id="mainCarousel" ref={divImgRef}>
                <ErrorBoundary FallbackComponent={() => <></>}>
                  {loaded && renderImgs()}
                </ErrorBoundary>
              </div>
              <button></button>
              <button></button>
            </ErrorBoundary>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
