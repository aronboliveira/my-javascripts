import React from "react";
export default function GenericErrorComponent({
  message,
  lib = "bs",
}: {
  message: string;
  lib: "bs" | "mui";
}) {
  if (!message) message = "Erro indefinido";
  const inlineStyle = { fontSize: "0.8rem", marginBlock: "1rem" },
    muiButton = {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: "bold",
      fontSize: "0.875rem",
      lineHeight: 1.75,
      letterSpacing: "0.02857em",
      textTransform: "uppercase",
      minWidth: "64px",
      padding: "6px 16px",
      borderRadius: "4px",
      transition:
        "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      cursor: "pointer",
      border: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      userSelect: "none",
      verticalAlign: "middle",
      WebkitTapHighlightColor: "transparent",
      boxShadow:
        "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
      backgroundColor: "#1976d2",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#1565c0",
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
        textDecoration: "none",
      },
      "&:active": {
        boxShadow:
          "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)",
      },
      "&:focus": {
        outline: "none",
        boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.5)",
      },
      "&:disabled": {
        backgroundColor: "rgba(0, 0, 0, 0.12)",
        color: "rgba(0, 0, 0, 0.26)",
        boxShadow: "none",
        cursor: "not-allowed",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        borderRadius: "50%",
        transform: "scale(0)",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        transition: "transform 0.3s ease-out",
      },
      "&:active::after": {
        transform: "scale(2)",
        opacity: "0",
      },
    },
    muiClasses =
      "MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary",
    bsButton = "btn btn-info";
  return (
    <article
      style={{
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        width: "100vw",
        height: "100vh",
        maxWidth: "100%",
        minWidth: "100%",
        paddingInline: "10vw",
        backgroundColor: "#afa3a396",
      }}
    >
      <h2 className="mg__2bv widHalf">
        <strong style={{ marginTop: "0.25rem" }}>
          Oops, algo deu errado!&nbsp;
          <span role="img" aria-label="scared">
            😨
          </span>
        </strong>
      </h2>
      <h4 style={{ fontSize: "0.8rem", marginBlock: "1rem", color: "red" }}>
        {message}
      </h4>
      <fieldset
        id="errorBoundaryHandlingCta"
        style={{
          display: "flex",
          columnGap: "1rem",
          flexWrap: "wrap",
          border: "none",
        }}
      >
        <button
          style={{ ...inlineStyle, ...(lib === "mui" ? muiButton : {}) }}
          type="button"
          className={lib === "mui" ? muiClasses : bsButton}
          onClick={() => window.open(window.location.href, "_self")}
        >
          <span className={lib === "mui" && "MuiButton-label"}>
            Recarregar página
          </span>
          {lib === "mui" && <span className="MuiTouchRipple-root"></span>}
        </button>
        <button
          style={{ ...inlineStyle, ...(lib === "mui" ? muiButton : {}) }}
          type="button"
          className={lib === "mui" ? muiClasses : bsButton}
          onClick={() => window.open(window.location.origin, "_self")}
        >
          <span className={lib === "mui" && "MuiButton-label"}>
            Retornar para a página inicial
          </span>
          {lib === "mui" && <span className="MuiTouchRipple-root"></span>}
        </button>
      </fieldset>
    </article>
  );
}
