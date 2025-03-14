import ReactSpinner from "./ReactSpinner";
export default function ReactBrand(): JSX.Element {
  return (
    <div
      className='react-wrapper'
      style={{
        display: "flex",
        flexFlow: "column wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
        paddingBottom: "5rem",
      }}>
      <h2
        style={{
          fontSize: "1.2rem",
          textAlign: "center",
        }}>
        Built with{" "}
        <a
          style={{
            backgroundClip: "text",
            textShadow: "1px 0 2px #323231, 1px 0 2px rgba(128, 128, 128, 0.7), 1px 0 2px rgba(0, 0, 0, 0.5)",
            color: "#323231",
          }}
          href='https://react.dev/'
          target='_blank'
          rel='noopener noreferrer'
          id='nextjs_open'>
          React.js
        </a>
      </h2>
      <ReactSpinner scale={1} width={50} height={50} />
    </div>
  );
}
