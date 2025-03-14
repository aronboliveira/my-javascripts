import InstIcon from "../../icons/InstIcon";
import WpIcon from "../../icons/WpIcon";
import AccordionItem from "./AccordionItem";
import AuthorCard from "./AuthorCard";
import AuthorDetails from "./AuthorDetails";
import DeliveryOption from "./DeliveryOption";
export default function InfoAccordion({ id }: { id: string }): JSX.Element {
  return (
    <div className="accordion" id={id}>
      <AccordionItem
        baseId="InfoLocality"
        parentId={id}
        headerText="Localização"
        innerText={
          <p>
            <span>Lorem ipsum</span>
            <strong>Lorem ipsum</strong>
            <span>!</span>
          </p>
        }
        defShow={false}
      />
      <AccordionItem
        baseId="InfoHistory"
        parentId={id}
        headerText="História"
        innerText={
          <div id="textHistory">
            <p className="divHistory">
              <span className="segmentHistory">Lorem ipsum</span>
              <em className="segmentHistory">Lorem ipsum</em>
              <span className="segmentHistory">Lorem ipsum</span>
            </p>
            <div className="divHistory">
              <span className="segmentHistory">Lorem ipsum</span>
              <em className="segmentHistory">
                <strong className="segmentHistory">Lorem ipsum</strong>
              </em>
              <span className="segmentHistory">
                , com escolha de ingredientes&nbsp;
              </span>
              <em className="segmentHistory">Lorem ipsum</em>
              <span className="segmentHistory">!</span>
            </div>
          </div>
        }
        defShow={false}
      />
      <AccordionItem
        baseId="InfoPayment"
        parentId={id}
        headerText="Pagamento"
        innerText={
          <div id="textPayment">
            <p className="segmentPayment">Lorem ipsum</p>
            <ul className="segmentPayment" id="listPaymentMethods">
              <li className="itemPaymentMethod">
                <b className="textPaymentMethod">Pix</b>
              </li>
              <li className="itemPaymentMethod">
                <b className="textPaymentMethod">Lorem ipsum</b>
              </li>
              <li className="itemPaymentMethod">
                <b className="textPaymentMethod">Lorem ipsum</b>
              </li>
              <li className="itemPaymentMethod">
                <b className="textPaymentMethod">Lorem ipsum</b>
              </li>
            </ul>
          </div>
        }
        defShow={false}
      />
      <AccordionItem
        baseId="InfoDelivery"
        parentId={id}
        headerText="Delivery"
        innerText={
          <div id="textDelivery">
            <div className="divDelivery">
              <em className="segmentDelivery">Lorem ipsum</em>
              <strong className="segmentDelivery">Lorem ipsum</strong>
              <em className="segmentDelivery">Lorem ipsum</em>
              <ul className="listOptsDelivery">
                <DeliveryOption
                  summaryText={
                    <strong className="segmentDelivery segmentOptDelivery">
                      Lorem ipsum
                      <mark className="subSegmentDelivery subSegmentOptDelivery">
                        Lorem ipsum
                      </mark>
                      <span className="subSegmentDelivery subSegmentOptDelivery">
                        :
                      </span>
                    </strong>
                  }
                  detailsText={
                    <span className="segmentDelivery segmentOptDelivery">
                      <span className="subSegmentDelivery subSegmentOptDelivery">
                        Lorem ipsum
                      </span>
                      <em className="subSegmentDelivery subSegmentOptDelivery">
                        <mark className="subSegmentDelivery subSegmentOptDelivery">
                          Lorem ipsum
                        </mark>
                      </em>
                      <span className="subSegmentDelivery subSegmentOptDelivery">
                        Lorem ipsum.
                      </span>
                    </span>
                  }
                  detailTitle="lessThan30"
                />
                <DeliveryOption
                  summaryText={
                    <strong className="segmentDelivery segmentOptDelivery">
                      Lorem ipsum
                      <mark className="subSegmentDelivery subSegmentOptDelivery">
                        Lorem ipsum
                      </mark>
                      Lorem ipsum
                    </strong>
                  }
                  detailsText={
                    <span className="segmentDelivery segmentOptDelivery">
                      <span className="subSegmentDelivery subSegmentOptDelivery">
                        Lorem ipsum
                      </span>
                      <em className="subSegmentDelivery subSegmentOptDelivery">
                        <mark className="subSegmentDelivery subSegmentOptDelivery">
                          Lorem ipsum
                        </mark>
                      </em>
                    </span>
                  }
                  detailTitle="equalOrMoreThan30jg"
                />
                <DeliveryOption
                  summaryText={
                    <strong className="segmentDelivery segmentOptDelivery">
                      Lorem ipsum
                      <mark className="subSegmentDelivery subSegmentOptDelivery">
                        Lorem ipsum
                      </mark>
                      Lorem ipsum
                    </strong>
                  }
                  detailsText={
                    <span className="segmentDelivery segmentOptDelivery">
                      <span className="subSegmentDelivery subSegmentOptDelivery">
                        Lorem ipsum
                      </span>
                      <em className="subSegmentDelivery subSegmentOptDelivery">
                        <mark className="subSegmentDelivery subSegmentOptDelivery">
                          Lorem ipsum
                        </mark>
                      </em>
                    </span>
                  }
                  detailTitle="btwn30and50notJg"
                />
                <DeliveryOption
                  summaryText={
                    <strong className="segmentDelivery segmentOptDelivery">
                      Lorem ipsum
                      <mark className="subSegmentDelivery subSegmentOptDelivery">
                        Lorem ipsum
                      </mark>
                      Lorem ipsum
                    </strong>
                  }
                  detailsText={
                    <span className="segmentDelivery segmentOptDelivery">
                      <span className="subSegmentDelivery subSegmentOptDelivery">
                        Lorem ipsum
                      </span>
                      <em className="subSegmentDelivery subSegmentOptDelivery">
                        <mark className="subSegmentDelivery subSegmentOptDelivery">
                          Lorem ipsum
                        </mark>
                      </em>
                    </span>
                  }
                  detailTitle="equalOrMoreThan50notJg"
                />
                <DeliveryOption
                  summaryText={
                    <strong className="segmentDelivery segmentOptDelivery">
                      Lorem ipsum
                      <mark className="subSegmentDelivery subSegmentOptDelivery">
                        Lorem ipsum
                      </mark>
                    </strong>
                  }
                  detailsText={
                    <span className="segmentDelivery segmentOptDelivery">
                      <em className="subSegmentDelivery subSegmentOptDelivery">
                        Lorem ipsum
                      </em>
                    </span>
                  }
                  detailTitle="notIg"
                />
              </ul>
            </div>
          </div>
        }
        defShow={false}
      />
      <AccordionItem
        baseId="InfoContact"
        parentId={id}
        headerText="Contato"
        innerText={
          <>
            <div className="divInfoContact" id="wpDivInfoContact">
              <span className="titleInfoContact" id="wpInfoContact">
                <span>Lorem ipsum</span>
                <strong>Lorem ipsum</strong>
              </span>
              <a
                id="anchorWhatsappContact"
                className="caller highlight"
                href="https://whatsa.me/5521983022926/?t=Ol%C3%A1,+Ana!+Gostaria+de+fazer+um+pedido+%E2%9C%89%F0%9F%8D%B0"
                target="_blank"
                rel="noopener noreferrer nofollow contact"
                title="Clique aqui para chamar no whatsapp!"
                aria-hidden="false"
                style={{
                  zIndex: 10,
                  width: "fit-content",
                  color: "rgb(255, 255, 255)",
                }}
              >
                <WpIcon large={false} />
              </a>
            </div>
            <div className="divInfoContact" id="instDivInfoContact">
              <span className="titleInfoContact" id="instInfoContact">
                <span>Clique no Ícone para acessar nosso&nbsp;</span>
                <strong>Instagram:&nbsp;</strong>
              </span>
              <InstIcon />
            </div>
          </>
        }
        defShow={false}
      />
      <AccordionItem
        baseId="InfoOwner"
        parentId={id}
        headerText="A Confeiteira"
        innerText={
          <AuthorCard
            authorName="Ana Cristina Barbosa de Oliveira"
            authorDetails="Confeiteira e Gestora comercial com experiência em Representação comercial"
            imgSrc="/img/ana_cristina.jpeg"
          />
        }
        defShow={false}
      />
      <AccordionItem
        baseId="InfoAuthors"
        parentId={id}
        headerText="Autoria & Copyright"
        innerText={<ul id="authorsCoprList"></ul>}
        defShow={false}
        lastItem={true}
      />
    </div>
  );
}
