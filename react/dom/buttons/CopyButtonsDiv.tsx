"use client";
import { useEffect } from "react";
import {
  concatProducts,
  switchAlertOp,
  syncAriaStates,
} from "../../lib/handlers/handlersCmn";
import ErrorMessageComponent from "../errors/ErrorMessageComponent";
import { ErrorBoundary } from "react-error-boundary";
import DirectCaller from "../callers/DirectCaller";
import { htmlElementNotFound } from "../../lib/handlers/handlersErrors";
export default function CopyButtonsDiv(): JSX.Element {
  useEffect(() => {
    syncAriaStates(document.getElementById("divBtns"));
  }, []);
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorMessageComponent message='Erro carregando botões para cópia' />
      )}>
      <div className='divMain' id='confirmDiv'>
        <button
          type='button'
          className='selectItemBtn btn btn-rounded btn-magenta'
          id='copyBtnInst'
          title='Clique aqui para copiar o texto em formatação padrão'
          onClick={ev => {
            try {
              const totalEl = document.getElementById("total");
              if (!(totalEl instanceof HTMLElement))
                throw htmlElementNotFound(
                  totalEl,
                  `HTMLElement for copying total price of message to clipboard`,
                  ["HTMLElement"],
                );
              const copyAlert = document.getElementById("copyAlert");
              const orderMsg = concatProducts(
                `Olá, Ana! 🖐 Gostaria de fazer um pedido:\nPreço total 💲:\n\t${
                  totalEl.innerText || "Não calculado"
                }.\nProdutos do pedido 🍰:`,
              );
              navigator.clipboard
                .writeText(orderMsg)
                .then(() => {
                  switchAlertOp(
                    copyAlert,
                    orderMsg,
                    "copying message for Default Pattern",
                  );
                })
                .catch(err =>
                  console.error(`Error copying message: ${err.message}`),
                );
            } catch (e) {
              console.error(
                `Error executing callback for ${
                  ev.currentTarget.id ||
                  ev.currentTarget.className ||
                  ev.currentTarget.tagName
                }:\n${(e as Error).message}`,
              );
            }
          }}>
          Copiar Texto Padrão
        </button>
      </div>
      <span id='copyAlert'>Texto copiado</span>
      <button
        className='copyBtn btn btn-success btn-rounded'
        id='copyBtnWp'
        title='Clique aqui para copiar o texto formatado para o WhatsApp'
        onClick={ev => {
          try {
            const totalEl = document.getElementById("total");
            if (!(totalEl instanceof HTMLElement))
              throw htmlElementNotFound(
                totalEl,
                `HTMLElement for copying total price of message to clipboard`,
                ["HTMLElement"],
              );
            const copyAlert = document.getElementById("copyAlert");
            const orderMsg = concatProducts(
              `_Olá, Ana_! 🖐 Gostaria de fazer um pedido:\n*Preço total 💲*:\n\t${
                totalEl.innerText || "Não calculado"
              }.\n*Produtos do pedido 🍰*:`,
            );
            navigator.clipboard
              .writeText(orderMsg)
              .then(() => {
                switchAlertOp(
                  copyAlert,
                  orderMsg,
                  "copying message for WhatsApp",
                );
              })
              .catch(err =>
                console.error(`Error copying message: ${err.message}`),
              );
          } catch (e) {
            console.error(
              `Error executing callback for ${
                ev.currentTarget.id ||
                ev.currentTarget.className ||
                ev.currentTarget.tagName
              }:\n${(e as Error).message}`,
            );
          }
        }}>
        Copiar Texto para o WhatsApp
      </button>
      <DirectCaller
        innerTextL='Chame no Whatsapp!'
        target='_blank'
        rel='noopener noreferrer nofollow contact'
        color='#ffff'
        href='https://whatsa.me/5521983022926/?t=Ol%C3%A1,+Ana!+*(Substitua+copiando+sua+mensagem+aqui+com+"_Colar_"*)+%E2%9C%89%F0%9F%8D%B0'
        hreflang='pt-BR'
        ComponentCase='whatsapp'
      />
    </ErrorBoundary>
  );
}
