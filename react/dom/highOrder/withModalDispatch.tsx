import { DlgProps } from "@/lib/definitions/client/interfaces/components";
import React, { useState } from "react";
export default function withModalDispatch<T extends DlgProps>(
  Wrapped: React.ComponentType<T>
) {
  return function Enhanced(
    props: Omit<T, "state" | "dispatch" | "id"> = {} as T
  ) {
    const [state, dispatch] = useState<boolean>(true);
    return <Wrapped {...(props as T)} state={state} dispatch={dispatch} />;
  };
}
