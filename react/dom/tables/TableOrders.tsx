import ResetTabBtn from "../buttons/ResetTabBtn";
import TBodyOrders from "./TBodyOrders";
export default function TableOrders(): JSX.Element {
  return (
    <table className='table table-bordered table-hover' id='productsTab'>
      <caption id='productsTabCapt'>
        <div id='productsTabTitle'>
          <h3 className='bolded' id='ordersCaption'>
            Pedido
          </h3>
          <ResetTabBtn />
        </div>
      </caption>
      <colgroup>
        <col />
        <col style={{ minWidth: "1ch" }} />
        <col style={{ minWidth: "1ch" }} />
      </colgroup>
      <thead id='productsThead'>
        <tr>
          <th
            scope='col'
            className='tabOrdersCel tabOrdersTh'
            id='productsCell'>
            <span className='tabCelSpan'>Produtos</span>
          </th>
          <th
            scope='col'
            className='tabOrdersCel tabOrdersTh'
            id='quantityCell'>
            <span className='tabCelSpan'>Quantidades</span>
          </th>
          <th scope='col' className='tabOrdersCel tabOrdersTh' id='removeCell'>
            <span className='tabCelSpan'>Remoções</span>
          </th>
        </tr>
      </thead>
      <TBodyOrders />
    </table>
  );
}
