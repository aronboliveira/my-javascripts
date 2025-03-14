import { syncAriaStates } from "../../src/lib/global/handlers/gHandlers";
import { createContext, useEffect, useRef, useState } from "react";
import UserProfileDropdown from "./UserProfileDropdown";
import { UserState } from "../../src/lib/locals/basePage/declarations/serverInterfaces";
import { User } from "../../src/lib/global/declarations/classes";
import { UserPanelCtxProps } from "../../src/lib/global/declarations/interfaces";
export const UserPanelCtx = createContext<UserPanelCtxProps>({
  setDropdown: null,
  shouldShowDropdown: false,
});
export default function UserProfilePanel({ user }: { user: UserState }): JSX.Element {
  const userPanelRef = useRef<HTMLSpanElement | null>(null),
    [shouldShowDropdown, setDropdown] = useState<boolean>(false),
    [userName, setName] = useState<string>("Geral"),
    [imageSrc, setSrc] = useState<string>("http://prossaude-ufrj.local/wp-content/uploads/2024/11/icon-psy.webp");
  useEffect(() => {
    if (userPanelRef.current instanceof HTMLElement) {
      syncAriaStates([...userPanelRef.current.querySelectorAll("*"), userPanelRef.current]);
      const loadedUser = Object.freeze(
          new User({
            name: user.loadedData.name,
            privilege: user.loadedData.privilege,
            area: user.loadedData.area,
            email: user.loadedData.email,
            telephone: user.loadedData.telephone,
          }),
        ),
        area = /psi/gi.test(loadedUser.userArea) ? "psi" : loadedUser.userArea;
      setName(user.loadedData.name);
      switch (area) {
        case "odontologia":
          setSrc("http://prossaude-ufrj.local/wp-content/uploads/2024/11/PROS_od_icon.webp");
          break;
        case "educação física":
          setSrc("http://prossaude-ufrj.local/wp-content/uploads/2024/11/PROS_edfis_icon.webp");
          break;
        case "nutrição":
          setSrc("http://prossaude-ufrj.local/wp-content/uploads/2024/11/PROS_nut_icon.webp");
          break;
        default:
          setSrc("http://prossaude-ufrj.local/wp-content/uploads/2024/11/icon-psy.webp");
      }
    }
  }, [user]);
  return (
    <UserPanelCtx.Provider value={{ setDropdown, shouldShowDropdown }}>
      <span className='posRl flexNoW flexNoW900Q cGap0_5v rGap1v900Q contFitW noInvert' ref={userPanelRef}>
        <output id='nameLogin' data-title='Usuário ativo'>
          {userName}
        </output>
        <span id='contProfileImg' className='profileIcon'>
          <img
            decoding='async'
            loading='lazy'
            src={imageSrc}
            className='profileIcon mg__03rb'
            id='profileIconImg'
            data-container='body'
            data-toggle='popover'
            title='Informações de Usuário'
            data-placement='bottom'
            onClick={() => setDropdown(!shouldShowDropdown)}
            alt='User img'
          />
        </span>
        {shouldShowDropdown && (
          <UserProfileDropdown user={user} setDropdown={setDropdown} shouldShowDropdown={shouldShowDropdown} />
        )}
      </span>
    </UserPanelCtx.Provider>
  );
}
