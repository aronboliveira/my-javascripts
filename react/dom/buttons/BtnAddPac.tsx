"use client";
import { syncAriaStates } from "../../src/lib/global/handlers/gHandlers";
import { useEffect, useState } from "react";
import FormDlg from "./FormDlg";
export default function BtnAddPac(): JSX.Element {
  const [pressState, setTogglePress] = useState<boolean>(false);
  const toggleForm = (): void => setTogglePress(() => !pressState);
  useEffect(() => {
    /new-cons=open/gi.test(location.search) && setTogglePress(true);
  }, []);
  useEffect(() => {
    const aptBtn = document.getElementById("addAppointBtn");
    aptBtn instanceof HTMLElement
      ? syncAriaStates([aptBtn])
      : setTimeout(() => {
          const aptBtn = document.getElementById("addAppointBtn");
          aptBtn instanceof HTMLElement && syncAriaStates([aptBtn]);
        }, 2000);
  }, [pressState]);
  return (
    <>
      <button
        type='button'
        className='btn btn-success widFull900Q widQ460MinFull htMaxBSControl forceInvert bolded'
        id='addAppointBtn'
        onClick={toggleForm}
        title='Preencha um formulário para gerar a ficha de uma nova consulta'>
        Adicionar Consulta
      </button>
      {pressState ? <FormDlg onClose={toggleForm} /> : <></>}
    </>
  );
}
