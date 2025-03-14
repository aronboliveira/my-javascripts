import UserPropsDlg from "./UserPropsDlg";
import { useContext } from "react";
import { UserProfileCtxProps } from "../../src/lib/global/declarations/interfaces";
import { UserProfileCtx } from "./UserProfileDropdown";
import ContactDlg from "./ContactDlg";
import { execLogout } from "../../src/lib/global/auth";
import { capitalizeFirstLetter } from "../../src/lib/global/gModel";
import { ErrorBoundary } from "react-error-boundary";
import GenericErrorComponent from "../error/GenericErrorComponent";
import { useNavigate } from "react-router-dom";
export default function UserList({ end = "" }: { end?: string }): JSX.Element {
  const {
      user,
      shouldDisplayContact,
      shouldDisplayPropDlg,
      setContact,
      setPropDlg,
    } = useContext<UserProfileCtxProps>(UserProfileCtx),
    navigate = useNavigate();
  return (
    <ErrorBoundary
      fallback={
        <GenericErrorComponent message="Erro carregando lista de dados de usuário" />
      }
    >
      <dl className="mg__0b">
        <dt>Classe:</dt>
        <dd id={`classLogin${end}`} data-title="Classe de Usuário ativo">
          {capitalizeFirstLetter(user.userClass)}
        </dd>
        <dt>Área:</dt>
        <dd>{capitalizeFirstLetter(user.userArea)}</dd>
        <dt>E-mail:</dt>
        <dd>{user.userEmail}</dd>
        <dt>Telefone:</dt>
        <dd>{user.userTel}</dd>
      </dl>
      <fieldset
        id={`alterUserPropDiv${end}`}
        className="flexJSt cGap1v mg__1_3b"
      >
        <span className="bolded mg__04t">Alteração</span>
        <button
          type="button"
          className="transparentEl__bg"
          id={`alterUserPropBtn${end}`}
          onClick={() => setPropDlg(!shouldDisplayPropDlg)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-gear widMax_5r htMax0_3r"
            viewBox="0 0 16 16"
          >
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
          </svg>
        </button>
        {shouldDisplayPropDlg && (
          <UserPropsDlg
            setPropDlg={setPropDlg}
            shouldDisplayPropDlg={shouldDisplayPropDlg}
          />
        )}
      </fieldset>
      <fieldset id={`logoutDiv${end}`} className="flexJSt cGap1v noInvert">
        <span className="bolded mg__04t noInvert">Logout</span>
        <button
          type="button"
          className="transparentEl__bg noInvert"
          id={`logoutBtn${end}`}
          style={{ position: "relative" }}
        >
          <a
            id={`logoutAnchor${end}`}
            target="_self"
            rel="nofollow"
            style={{
              zIndex: "10",
              position: "absolute",
              color: "transparent",
            }}
            href={`${location.href.replace(location.pathname, "")}/login`}
            onClick={() => execLogout(navigate)}
          >
            LOGIN
          </a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-door-open widMax_5r"
            viewBox="0 0 16 16"
          >
            <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1" />
            <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117M11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5M4 1.934V15h6V1.077z" />
          </svg>
        </button>
      </fieldset>
      <fieldset
        id={`logoutDiv${end}`}
        className="flexJSt cGap1v mg__1t noInvert"
      >
        <span className="bolded noInvert">Contato</span>
        <button
          type="button"
          className="transparentEl__bg noInvert"
          id={`contactBtn${end}`}
          onClick={() => setContact(!shouldDisplayContact)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-info-circle htMax0_1r"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
          </svg>
        </button>
      </fieldset>
      {shouldDisplayContact && (
        <ContactDlg
          setContact={setContact}
          shouldDisplayContact={shouldDisplayContact}
        />
      )}
    </ErrorBoundary>
  );
}
