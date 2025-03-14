import { ref, reactive, watch, onMounted } from "vue";
import { assignFormAttrs, handleLabs, updateAttrs } from "../../../../scripts/model/utils";
import { nInp, nLb } from "../../../../scripts/declarations/types";
import { labMap } from "../../../../vars";
import { InpProps } from "../../../../scripts/declarations/interfaceComponents";
import { CheckProps } from "../../../../scripts/declarations/interfaces";
import { PropType } from "vue";
import { handleSubmit } from "../../../../scripts/handlers/handlersIO";
export default {
  name: "FilterCheck",
  props: {
    id: {
      type: String as PropType<string>,
      required: true,
      default: "",
    },
    lab: {
      type: String,
      required: false,
      default: "",
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
    checked: {
      type: Boolean,
      required: false,
      default: false,
    },
    defV: {
      type: String,
      required: false,
      default: "",
    },
    type: {
      type: String as PropType<"checkbox" | "radio">,
      required: false,
      default: "checkbox",
    },
    mv: {
      type: String,
      required: false,
      default: "",
    },
  } as CheckProps,
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
  setup(props: CheckProps) {
    const r = ref<nInp>(null),
      rlb = ref<nLb>(null),
      s = reactive({
        req: props.required,
        ro: props.readOnly,
        dsb: props.disabled,
        v: r.value?.indeterminate || r.value?.defaultChecked || r.value?.checked || props.checked,
        lb: props.lab,
      });
    watch(
      () => s.req,
      _ => updateAttrs(r.value, s.ro as any, s.dsb as any, s.req as any),
    );
    watch(
      () => s.v,
      n => {
        s.v = n ? n : r.value?.indeterminate || r.value?.defaultChecked || r.value?.checked || props.checked || n;
      },
    );
    if (s.lb === ("" as any) && props.id !== ("" as any))
      (s.lb as any) = labMap.get(props.id as any) || props.id || s.lb;
    onMounted(() => {
      try {
        if (!(r.value instanceof HTMLInputElement))
          throw new Error(`Couldn't validate the Reference for the input ${props.id}`);
        const form = r.value?.closest("form");
        if (!(form instanceof HTMLFormElement)) throw new Error(`Couldn't found Form for the Input ${props.id}`);
        assignFormAttrs(r.value, form);
      } catch (e) {
        console.error(`Error on defining form properties to the input:\n${(e as Error).message}`);
      }
      const extractedProps: Record<string, any> = {};
      for (const [key, value] of Object.entries(props)) extractedProps[key] = value;
      handleLabs(r.value, rlb.value, extractedProps as InpProps);
    });
    const tLab = labMap.get(s.lb as any) || s.lb || props.lab;
    return {
      s,
      r,
      rlb,
      tLab,
    };
  },
};
