//@ts-ignore
import { registerBlockType } from "@wordpress/blocks";
//@ts-ignore
import { useBlockProps } from "@wordpress/block-editor";
import { useEffect, useRef, useState } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
import { nlInp, nlLab } from "../../../../lib/global/declarations/types";

registerBlockType("bootstrap/control", {
  title: "Campo de Controle",
  icon: "button",
  category: "bootstrap_ui",
  attributes: {
    // preview: {
    //   type: "boolean",
    //   default: false,
    // },
  },
  supports: {
    // inserter: true,
    // align: true,
  },
  // example: {
  //   attributes: {
  //     preview: true,
  //   },
  //   description: "Preview do Campo de Controle",
  //   innerBlocks: [],
  // },
  edit: () =>
    // { attributes }: { attributes: { [k: string]: any } }
    {
      // const inputRef = useRef<nlInp>(null),
      //   labelRef = useRef<nlLab>(null),
      //   [id, setId] = useState<string>("");
      // useEffect(() => {
      //   if (inputRef.current) {
      //     const generatedId = fillIds(inputRef.current);
      //     setId(generatedId);
      //     gatherFormData(inputRef.current, labelRef.current);
      //   }
      // }, [inputRef, labelRef]);
      return <div>This is just a test!</div>;
      // attributes.preview ? (
      //   <div>
      //     <video
      //       src="http://prossaude-ufrj-test.local/wp-content/uploads/2024/11/form_control.mp4"
      //       autoPlay
      //       loop
      //       playsInline
      //       muted
      //       crossOrigin="anonymous"
      //       className="controlPreview"
      //       disablePictureInPicture
      //       style={{
      //         maxWidth: "100%",
      //         maxHeight: "100%",
      //         width: "auto",
      //         height: "auto",
      //         objectFit: "contain",
      //       }}
      //     ></video>
      //   </div>
      // ) : (
      //   <fieldset {...useBlockProps()} style={{ border: "none" }} className="form-control-wrapper">
      //     <label
      //       ref={labelRef}
      //       id={`lab__${id}`}
      //       className="form-label"
      //       htmlFor={id}
      //       data-block={`block__${id}`}
      //       contentEditable
      //     >
      //       Campo de Texto Simples:
      //     </label>
      //     <input
      //       ref={inputRef}
      //       data-block={`block__${id}`}
      //       className="form-control"
      //       type="text"
      //       maxLength={536870911}
      //       autoCapitalize="false"
      //       autoComplete="off"
      //       placeholder="Digite algo aqui!"
      //       id={id}
      //       name={`control__${id}`}
      //       style={{
      //         width: "90%",
      //         backgroundImage:
      //           "url('data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2216%22 height%3D%2216%22 fill%3D%22rgba(23%2C%2023%2C%2023%2C%200.7)%22 class%3D%22bi bi-textarea-t%22 viewBox%3D%220 0 16 16%22%3E%3Cpath d%3D%22M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v3.563a2 2 0 0 1 0 3.874V13.5A1.5 1.5 0 0 1 13 15H3a1.5 1.5 0 0 1-1.5-1.5V9.937a2 2 0 0 1 0-3.874zm1 3.563a2 2 0 0 1 0 3.874V13.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V9.937a2 2 0 0 1 0-3.874V2.5A.5.5 0 0 0 13 2H3a.5.5 0 0 0-.5.5zM2 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2m12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2%22%2F%3E%3Cpath d%3D%22M11.434 4H4.566L4.5 5.994h.386c.21-1.252.612-1.446 2.173-1.495l.343-.011v6.343c0 .537-.116.665-1.049.748V12h3.294v-.421c-.938-.083-1.054-.21-1.054-.748V4.488l.348.01c1.56.05 1.963.244 2.173 1.496h.386z%22%2F%3E%3C%2Fsvg%3E')",
      //         backgroundPosition: "100%",
      //         backgroundRepeat: "no-repeat",
      //         backgroundOrigin: "content-box",
      //         backgroundAttachment: "local",
      //       }}
      //     />
      //   </fieldset>
      // );
    },
  save: () => null,
});
