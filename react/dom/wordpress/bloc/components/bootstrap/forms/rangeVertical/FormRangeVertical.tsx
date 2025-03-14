//@ts-ignore
import { registerBlockType } from "@wordpress/blocks";
//@ts-ignore
import { useBlockProps } from "@wordpress/block-editor";
import FormRangeVertical from "./component";
registerBlockType("bootstrap/rangevertical", {
  title: "Campo de Variação Vertical",
  icon: "image-flip-vertical",
  category: "bootstrap_ui",
  attributes: {
    preview: {
      type: "boolean",
      default: false,
    },
  },
  supports: {
    inserter: true,
    align: true,
    innerBlocks: true,
  },
  example: {
    attributes: {
      preview: true,
    },
    description: "Preview do Campo de Variação Vertical",
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
          className="rangePreview"
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
      <fieldset
        {...useBlockProps()}
        style={{ border: "none", display: "inline-flex", placeItems: "flex-end" }}
        className="form-control-wrapper"
      >
        <FormRangeVertical />
      </fieldset>
    );
  },
  save: () => null,
});
