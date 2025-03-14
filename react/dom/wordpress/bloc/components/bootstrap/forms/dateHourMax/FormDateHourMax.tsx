//@ts-ignore
import { registerBlockType } from "@wordpress/blocks";
//@ts-ignore
import { useBlockProps } from "@wordpress/block-editor";
import FormDateHourMax from "./component";
registerBlockType("bootstrap/datehourmax", {
  title: "Campo de Data com Horário Simples já Ocorrido",
  icon: `backup`,
  category: "bootstrap_ui",
  attributes: {
    preview: {
      type: "boolean",
      default: false,
    },
  },
  example: {
    attributes: {
      preview: true,
    },
    description: "Preview do Campo de Data com Horário já Ocorrido",
    innerBlocks: [],
  },
  edit: ({ attributes }: { attributes: { [k: string]: any } }) => {
    return attributes.preview ? (
      <div>
        <video
          src="http://prossaude-ufrj-test.local/wp-content/uploads/2024/11/form_control.mp4"
          autoPlay
          loop
          playsInline
          muted
          crossOrigin="anonymous"
          className="dateHourMaxPreview"
          disablePictureInPicture
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
          }}
        ></video>
      </div>
    ) : (
      <fieldset {...useBlockProps()} style={{ border: "none" }} className="form-control-wrapper">
        <FormDateHourMax />
      </fieldset>
    );
  },
  save: () => null,
});
