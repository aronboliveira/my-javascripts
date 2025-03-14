import { UserProfileDropdownProps } from "../../src/lib/global/declarations/interfacesCons";
import { syncAriaStates } from "../../src/lib/global/handlers/gHandlers";
import { createContext, useEffect, useRef, useState } from "react";
import { User } from "../../src/lib/global/declarations/classes";
import { UserState, area, privilege } from "../../src/lib/locals/basePage/declarations/serverInterfaces";
import UserDlg from "./UserDlg";
import { UserProfileCtxProps } from "../../src/lib/global/declarations/interfaces";
import UserList from "./UserList";
import sUc from "../../src/styles/modules/userContStyles.module.scss";
export const UserProfileCtx = createContext<UserProfileCtxProps>({
  user: null,
  shouldDisplayPropDlg: false,
  shouldDisplayContact: false,
  setPropDlg: null,
  setContact: null,
});
export default function UserProfileDropdown({ user }: UserProfileDropdownProps): JSX.Element {
  const poRef = useRef<HTMLDivElement | null>(null),
    [shouldDisplayContact, setContact] = useState<boolean>(false),
    [shouldDisplayPropDlg, setPropDlg] = useState<boolean>(false),
    [shouldDisplayUserDlg, setUserDlg] = useState<boolean>(false),
    [, setUser] = useState<Readonly<User> | UserState | null>(user),
    [userClass, setClass] = useState<privilege>(user.loadedData.privilege),
    [userArea, setArea] = useState<area>(user.loadedData.area),
    [userEmail, setEmail] = useState<string>(user.loadedData.email),
    [userTel, setTel] = useState<string>(user.loadedData.telephone);
  useEffect(() => {
    if (poRef.current instanceof HTMLElement) {
      syncAriaStates([...poRef.current.querySelectorAll("*"), poRef.current]);
      const loadedUser = Object.freeze(
        new User({
          name: user.loadedData.name,
          privilege: user.loadedData.privilege,
          area: user.loadedData.area,
          email: user.loadedData.email,
          telephone: user.loadedData.telephone,
        }),
      );
      setUser(loadedUser);
      setClass(`${loadedUser.userClass.slice(0, 1).toUpperCase()}${loadedUser.userClass.slice(1)}` as privilege);
      setArea(`${loadedUser.userArea.slice(0, 1).toUpperCase()}${loadedUser.userArea.slice(1)}` as area);
      setEmail(loadedUser.userEmail);
      setTel(loadedUser.userTel);
    }
  }, [
    poRef,
    user.loadedData.area,
    user.loadedData.email,
    user.loadedData.name,
    user.loadedData.privilege,
    user.loadedData.telephone,
  ]);
  useEffect(() => {
    localStorage.setItem(
      "activeUser",
      JSON.stringify({
        loadedData: {
          ...user.loadedData,
          privilege: userClass.toLowerCase(),
          area: userArea.toLowerCase(),
          email: userEmail,
          telephone: userTel,
        },
      }),
    );
    Object.assign(user, {
      userClass,
      userArea,
      userEmail,
      userTel,
    });
  }, [userClass, userArea, userEmail, userTel, user]);
  return (
    <UserProfileCtx.Provider value={{ user, shouldDisplayContact, shouldDisplayPropDlg, setPropDlg, setContact }}>
      <div className={`po posAb ${sUc.po} ${sUc.lowPo} ${sUc.userPo}`} ref={poRef}>
        <div className={`hPo noInvert ${sUc.hPo}`}>
          <fieldset id='logoutDiv' className='flexJSt cGap1v mg__05b noInvert'>
            <button
              type='button'
              className='transparentEl__bg noInvert'
              id='modalBtn'
              onClick={() => setUserDlg(!shouldDisplayUserDlg)}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-window-stack htMax0_1r'
                viewBox='0 0 16 16'>
                <path d='M4.5 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M6 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0' />
                <path d='M12 1a2 2 0 0 1 2 2 2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zM2 12V5a2 2 0 0 1 2-2h9a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1m1-4v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8zm12-1V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2z' />
              </svg>
            </button>
            {shouldDisplayUserDlg && <UserDlg shouldDisplayUserDlg={shouldDisplayUserDlg} setUserDlg={setUserDlg} />}
          </fieldset>
          <h3 className={`noInvert d_ibl brd_nulled brd_b_no pd__no pd0 ${sUc.hPo}`}>Informações de Usuário</h3>
        </div>
        <div className={`bdPo noInvert ${sUc.bdPo}`}>
          <UserList />
        </div>
      </div>
    </UserProfileCtx.Provider>
  );
}
