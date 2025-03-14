import { useEffect, useState } from "react";
import { UserState } from "../../src/lib/locals/basePage/declarations/serverInterfaces";
import { defUser } from "../../src/redux/slices/userSlice";
export default function withUserData(
  Wrapped: React.ComponentType<{ user: UserState; router: any }>,
): (props: any) => JSX.Element {
  return function UserDataHOC(props: any): JSX.Element {
    const [user, setUser] = useState<UserState>(defUser);
    useEffect(
      () =>
        setUser(
          localStorage.getItem("activeUser") ? JSON.parse(localStorage.getItem("activeUser")!) : defUser.loadedData,
        ),
      [],
    );
    return <Wrapped user={user} {...props} />;
  };
}
