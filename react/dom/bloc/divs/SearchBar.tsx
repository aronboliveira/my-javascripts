import SearchIcon from "../../icons/SearchIcon";
import { FormEvent, useEffect, useRef, useState } from "react";
import { nullishDiv, nullishInp } from "../../lib/declarations/types";
import { htmlElementNotFound } from "../../lib/handlers/handlersErrors";
import {
  capitalizeFirstLetter,
  handleSearchFilter,
  normalizeSpacing,
  textTransformPascal,
} from "../../lib/handlers/handlersCmn";
import { SearchBarProps } from "../../lib/declarations/interfaces";

export default function SearchBar(props: SearchBarProps): JSX.Element {
  const searchRef = useRef<nullishDiv>(null);
  const searchInpRef = useRef<nullishInp>(null);
  const setSearch = useState("")[1];
  useEffect(() => {
    try {
      if (!(searchRef.current instanceof HTMLElement))
        throw htmlElementNotFound(
          searchRef.current,
          `validation of Search Element Reference`,
        );
      if (searchRef.current.parentElement) {
        const numSearchs = searchRef.current.parentElement.querySelectorAll(
          'input[type="search"]',
        ).length;
        const tempSearch = `${numSearchs}${
          capitalizeFirstLetter(searchRef.current.parentElement.id) ||
          capitalizeFirstLetter(
            normalizeSpacing(
              searchRef.current.parentElement!.classList.toString(),
            ),
          ) ||
          textTransformPascal(searchRef.current.parentElement!.tagName)
        }${
          document.querySelectorAll(
            `${searchRef.current.parentElement!.tagName.toLowerCase()}`,
          ).length
        }`;
        if (searchRef.current.id === "")
          searchRef.current.id = `searchBarDiv${tempSearch}`;
        if (!(searchInpRef.current instanceof HTMLElement))
          throw htmlElementNotFound(
            searchInpRef.current,
            `validation of Search Bar Input Reference`,
          );
        if (searchInpRef.current.id === "")
          searchInpRef.current.id = `searchBarInp${tempSearch}`;
      }
    } catch (e) {
      console.error(
        `Error executing useEffect for SearchBar:\n${(e as Error).message}`,
      );
    }
  }, [searchInpRef]);
  useEffect(() => {
    try {
      if (
        !(
          searchInpRef.current instanceof HTMLInputElement &&
          (searchInpRef.current.type === "search" ||
            searchInpRef.current.type === "text")
        )
      )
        throw htmlElementNotFound(
          searchInpRef.current,
          `validation of Search Input Reference`,
          ['<input type="search"> || <input type="text">'],
        );
      let queryRef = location.href.indexOf("?q=");
      if (queryRef > 0) queryRef = queryRef + 3;
      if (
        searchInpRef.current ===
          document.querySelector('input[type="search"]') ||
        searchInpRef.current ===
          document.querySelector('input[id*="searchBarInp"]')
      ) {
        searchInpRef.current.value = location.href.slice(queryRef);
        if (searchInpRef.current.value.match(/\?/g))
          searchInpRef.current.value = searchInpRef.current.value.slice(
            0,
            searchInpRef.current.value.indexOf("?"),
          );
        if (
          searchInpRef.current.value === "?" ||
          searchInpRef.current.value === "l"
        )
          searchInpRef.current.value = "";
        setTimeout(() => {
          searchInpRef.current &&
            handleSearchFilter(
              searchInpRef.current,
              searchInpRef.current.closest("menu") ||
                searchInpRef.current.closest("ul") ||
                searchInpRef.current.closest("ol") ||
                searchInpRef.current.closest("dl"),
              searchInpRef.current.value,
              "li",
            );
        }, 1000);
        setTimeout(() => {
          searchInpRef.current &&
            searchInpRef.current.value === "" &&
            handleSearchFilter(
              searchInpRef.current,
              searchInpRef.current.closest("menu") ||
                searchInpRef.current.closest("ul") ||
                searchInpRef.current.closest("ol") ||
                searchInpRef.current.closest("dl"),
              searchInpRef.current.value,
              "li",
            );
        }, 1000);
      }
    } catch (e) {
      console.error(
        `Error executing useEffect for searchInpRef:\n${(e as Error).message}`,
      );
    }
  }, [searchInpRef]);
  const handleChange = (ev: FormEvent<HTMLElement>) => {
    try {
      if (
        !(
          ev.currentTarget instanceof HTMLElement &&
          ev.currentTarget instanceof HTMLInputElement
        )
      ) {
        if (ev.currentTarget instanceof HTMLElement)
          throw htmlElementNotFound(
            ev.currentTarget,
            `validation of Event Target`,
            ["HTMLInputElement"],
          );
        else throw new Error(`Error validating Event Target instance`);
      }
      handleSearchFilter(
        ev.currentTarget,
        ev.currentTarget.closest("menu") ||
          ev.currentTarget.closest("ul") ||
          ev.currentTarget.closest("ol") ||
          ev.currentTarget.closest("dl"),
        ev.currentTarget.value,
        "li",
      );
      if (props.searchParams && props.setSearchParams && props.navigate) {
        const params = new URLSearchParams(location.search);
        ev.currentTarget.value !== ""
          ? params.set("q", ev.currentTarget.value)
          : params.delete("q");
        setSearch(ev.currentTarget.value);
        props.setSearchParams(params);
        const qParams = `?${params.toString()}`;
        history.pushState({}, "", `${location.pathname}${qParams}`);
        if (location.href.endsWith("?"))
          history.pushState(
            {},
            "",
            `${location.pathname.slice(0, location.href.indexOf("?"))}`,
          );
      }
    } catch (e) {
      ev.currentTarget instanceof Element
        ? console.error(
            `Error executing callback triggered by ${ev.type} during ${
              ev.timeStamp
            } for ${
              ev.currentTarget?.id ||
              ev.currentTarget.classList.toString() ||
              ev.currentTarget.tagName
            }:${(e as Error).message}`,
          )
        : console.error(
            `Error executing callback triggered by ${ev.type} during ${
              ev.timeStamp
            } for ${ev.currentTarget}:${(e as Error).message}`,
          );
    }
  };
  useEffect(() => {
    if (
      !/\?q=/g.test(location.href) &&
      document.querySelector(".searchBarInp") instanceof HTMLInputElement
    )
      (document.querySelector(".searchBarInp") as HTMLInputElement).value = "";
  }, []);
  return (
    <div className='form-control searchBarDiv' ref={searchRef}>
      <input
        className='searchBarInp'
        type='search'
        ref={searchInpRef}
        onInput={ev => {
          handleChange(ev);
        }}
        onChange={ev => {
          handleChange(ev);
        }}
      />
      <SearchIcon />
    </div>
  );
}
