import { useEffect } from "react";
export default function Uf(): JSX.Element {
  useEffect(() => {
    const UFid = document.getElementById("UFid");
    if (UFid instanceof HTMLInputElement) UFid.value = "RJ";
  }, []);
  return (
    <select
      id='UFId'
      autoComplete='address-level1'
      className='form-select'
      data-title='uf'
      data-xls='Unidade Federativa'
      required>
      <optgroup label='Centro-Oeste'>
        <option className='optIdentif optUF' value='GO'>
          Goiás
        </option>
        <option className='optIdentif optUF' value='MT'>
          Mato Grosso
        </option>
        <option className='optIdentif optUF' value='MS'>
          Mato Grosso do Sul
        </option>
      </optgroup>
      <optgroup label='Nordeste'>
        <option className='optIdentif optUF' value='AL'>
          Alagoas
        </option>
        <option className='optIdentif optUF' value='BA'>
          Bahia
        </option>
        <option className='optIdentif optUF' value='CE'>
          Ceará
        </option>
        <option className='optIdentif optUF' value='MA'>
          Maranhão
        </option>
        <option className='optIdentif optUF' value='PB'>
          Paraíba
        </option>
        <option className='optIdentif optUF' value='PE'>
          Pernambuco
        </option>
        <option className='optIdentif optUF' value='PI'>
          Piauí
        </option>
        <option className='optIdentif optUF' value='RN'>
          Rio Grande do Norte
        </option>
        <option className='optIdentif optUF' value='SE'>
          Sergipe
        </option>
      </optgroup>
      <optgroup label='Norte'>
        <option className='optIdentif optUF' value='AC'>
          Acre
        </option>
        <option className='optIdentif optUF' value='AP'>
          Amapá
        </option>
        <option className='optIdentif optUF' value='AM'>
          Amazonas
        </option>
        <option className='optIdentif optUF' value='RO'>
          Rondônia
        </option>
        <option className='optIdentif optUF' value='RR'>
          Roraima
        </option>
        <option className='optIdentif optUF' value='TO'>
          Tocantins
        </option>
      </optgroup>
      <optgroup label='Sudeste'>
        <option className='optIdentif optUF' value='ES'>
          Espírito Santo
        </option>
        <option className='optIdentif optUF' value='MG'>
          Minas Gerais
        </option>
        <option className='optIdentif optUF' value='RJ'>
          Rio de Janeiro
        </option>
        <option className='optIdentif optUF' value='SP'>
          São Paulo
        </option>
      </optgroup>
      <optgroup label='Sul'>
        <option className='optIdentif optUF' value='PR'>
          Paraná
        </option>
        <option className='optIdentif optUF' value='RS'>
          Rio Grande do Sul
        </option>
        <option className='optIdentif optUF' value='SC'>
          Santa Catarina
        </option>
      </optgroup>
    </select>
  );
}
