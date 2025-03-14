import { PropType, ref, reactive, watch, onMounted } from "vue";
import { nInp, nLb, nDl } from "../../../../scripts/declarations/types";
import { TextProps } from "../../../../scripts/declarations/interfaces";
import { handleDlUpdate, updateAttrs, assignFormAttrs, handleDl, handleLabs } from "../../../../scripts/model/utils";
import { parseNotNaN } from "../../../../scripts/handlers/handlersMath";
import { labMap } from "../../../../vars";
import { handleSubmit } from "../../../../scripts/handlers/handlersIO";
export default {
  name: "FilterInp",
  props: {
    //@ts-ignore
    id: {
      type: String as PropType<string>,
      required: true,
      default: "",
    },
    lab: {
      type: String as PropType<string>,
      required: false,
      default: "",
    },
    minLength: {
      type: Number as PropType<number>,
      required: false,
      default: 0,
    },
    maxLength: {
      type: Number as PropType<number>,
      required: false,
      default: 4000,
    },
    pattern: {
      type: String as PropType<string>,
      required: false,
      default: ".*",
    },
    autocomplete: {
      type: String as PropType<string>,
      required: false,
      default: "none",
    },
    autocapitalize: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    required: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    //@ts-ignore
    disabled: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    readOnly: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    dataList: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => [],
    },
  } as TextProps,
  methods: {
    onChange(ev: Event) {
      const t = ev.currentTarget;
      if (
        !(
          t instanceof HTMLInputElement ||
          t instanceof HTMLSelectElement ||
          t instanceof HTMLButtonElement ||
          t instanceof HTMLTextAreaElement ||
          t instanceof HTMLFormElement
        )
      )
        return;
      handleSubmit(t, t.form);
    },
  },
  setup(props: TextProps) {
    const r = ref<nInp>(null),
      rlb = ref<nLb>(null),
      dr = ref<nDl>(null),
      rc = ref<{ [k: string]: string[] }>({}),
      s = reactive({
        req: props.required,
        ro: props.readOnly,
        dsb: props.disabled,
        pt: props.pattern,
        lb: props.lab,
        v: "",
        vn: NaN,
      });
    const updateDatalist = (n: string) => {
      try {
        if (!(r.value instanceof HTMLInputElement)) throw new Error(`Input reference for ${props.id} is not valid`);
        sessionStorage.setItem(`${props.id}_v`, s.v);
        if (!dr.value) {
          dr.value = Object.assign(document.createElement("datalist"), {
            id: `${props.id}List`,
          });
          r.value.insertAdjacentElement("afterend", dr.value);
        }
        handleDlUpdate(r.value, dr.value, n);
      } catch (e) {
        console.error(`Error updating datalist for ${props.id}: ${(e as Error).message}`);
      }
    };
    watch(
      () => s.req,
      _ => updateAttrs(r.value, s.ro as any, s.dsb as any, s.req as any),
    );
    watch(
      () => s.v,
      n => {
        s.vn = parseNotNaN(n);
        updateDatalist(n);
      },
    );
    watch(
      () => s.vn,
      n => (s.vn = parseNotNaN(s.v) || n),
    );
    if ((s.lb as any) === "" && (props.id as any) !== "")
      (s.lb as any) = labMap.get(props.id as any) || props.id || s.lb;
    if (!/{/g.test(s.pt as any)) {
      if ((props.minLength as any) > 0) {
        (s.pt as any) = `${s.pt}{${props.minLength},`;
        if (props.maxLength) (s.pt as any) += `{props.maxLength}}`;
        else (s.pt as any) += `}`;
      }
    }
    onMounted(() => {
      updateDatalist(s.v);
      try {
        if (!(r.value instanceof HTMLInputElement))
          throw new Error(`Couldn't validate the Reference for the input ${props.id}`);
        const form = r.value?.closest("form");
        if (!(form instanceof HTMLFormElement)) throw new Error(`Couldn't found Form for the Input ${props.id}`);
        assignFormAttrs(r.value, form);
      } catch (e) {
        console.error(`Error on defining form properties to the input:\n${(e as Error).message}`);
      }
      handleLabs(r.value, rlb.value, props as any);
      handleDl(r.value, dr.value);
    });
    return {
      s,
      r,
      rlb,
      dr,
      rc,
      tLab: labMap.get(s.lb as any) || s.lb || props.lab,
    };
  },
};
