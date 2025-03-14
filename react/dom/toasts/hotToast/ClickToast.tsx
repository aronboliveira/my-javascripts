import DOMValidator from "@/lib/client/validators/DOMValidator";
import { toast } from "react-hot-toast";
export default function clickToast(message: string): Promise<boolean> {
  const handleClick = (): boolean => {
    if (!window) return false;
    const yes = document.getElementById("yesPersist");
    if (!(yes && DOMValidator.isButton(yes))) return false;
    if (!yes.dataset.watching) {
      yes.addEventListener("click", ev => {
        if (!ev.isTrusted) {
          const errId = toast.error(
            navigator.language.startsWith("pt-")
              ? `Evento não validado!`
              : `Event not validated!`
          );
          setTimeout(() => toast.dismiss(errId), 1000);
        }
      });
      yes.dataset.watching = "true";
    }
    return true;
  };
  setTimeout(() => {
    try {
      return window ? handleClick() : setTimeout(handleClick, 1000);
    } catch (e) {
      return;
    }
  }, 300);
  return new Promise(resolve => {
    toast(
      (t: any) => (
        <fieldset className='toastFs' id='activeToast'>
          <p>{message}</p>
          <div
            style={{
              marginTop: "1.5rem",
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <button
              className='btn btn-secondary'
              id='noPersist'
              onClick={() => {
                resolve(false);
                toast.dismiss(t.id);
              }}
            >
              {navigator.language.startsWith("pt-") ? "Não" : "No"}
            </button>
            <button
              className='btn btn-info'
              id='yesPersist'
              onClick={() => {
                /* eslint-disable */
                handleClick() ? resolve(true) : resolve(false);
                /* eslint-enable */
                setTimeout(() => toast.dismiss(t.id), 200);
              }}
              style={{ marginLeft: "10px" }}
            >
              {navigator.language.startsWith("pt-") ? "Sim" : "Yes"}
            </button>
          </div>
        </fieldset>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  });
}
