//@ts-ignore
import { registerBlockType } from "@wordpress/blocks";
//@ts-ignore
import { useBlockProps } from "@wordpress/block-editor";
import FormPDFFile from "./component";
registerBlockType("bootstrap/fpdf", {
  title: "Campo de PDF",
  icon: "media-document",
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
    description: "Preview do Campo de PDF",
    innerBlocks: [],
  },
  edit: ({ attributes }: { attributes: { [k: string]: any } }) => {
    return attributes.preview ? (
      <div>
        <video
          src="http://prossaude-ufrj-test.local/wp-content/uploads/2024/11/form_control.mp4"
          className="pdfPreview"
          autoPlay
          loop
          playsInline
          muted
          crossOrigin="anonymous"
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
      <fieldset {...useBlockProps()} style={{ border: "none" }} className="form-file-wrapper">
        <FormPDFFile />
      </fieldset>
    );
  },
  save: () => null,
});
