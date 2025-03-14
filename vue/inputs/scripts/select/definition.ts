import { onMounted, reactive, ref, watch, SetupContext, EmitsOptions } from "vue";
import { OptGroupProps, OptProps } from "../../../../scripts/declarations/interfaceComponents";
import { assignFormAttrs, handleLabs, pushSelectOpts, updateAttrs } from "../../../../scripts/model/utils";
import { labMap, rc } from "../../../../vars";
import { SelectProps } from "../../../../scripts/declarations/interfaces";
import { nLb, nSl } from "../../../../scripts/declarations/types";
import { limitResize, recolorOpts } from "../../../../scripts/handlers/handlersStyles";
import { formVars } from "../../../../scripts/vars";
import { handleSubmit } from "../../../../scripts/handlers/handlersIO";
export default {
  name: "FilterSelect",
  props: {
    id: {
      type: String,
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
    defV: {
      type: String,
      required: false,
      default: "",
    },
    type: {
      type: String as () => "select-one" | "select-multiple",
      required: false,
      default: "select-one",
    },
    opts: {
      type: Array as () => OptProps[] | OptGroupProps[],
      required: true,
      default: () => [],
    },
    mv: {
      type: String,
      required: false,
      default: "",
    },
  } as SelectProps,
  emits: ["update:mv"],
  methods: {
    handleClick(ev: MouseEvent): void {
      let targ = ev.currentTarget;
      if (!(targ instanceof HTMLSelectElement || targ instanceof HTMLOptionElement)) {
        console.warn(`Event target passed to handleClick is not a select`);
        return;
      }
      const updateOpts = (targ: HTMLSelectElement) => {
        const clickEl = document.elementFromPoint(ev.clientX, ev.clientY);
        try {
          if (clickEl instanceof HTMLOptionElement) {
            if (!clickEl.classList.contains("selected")) clickEl.selected = false;
            if (!rc[targ.id]) rc[targ.id] = {};
            if (!Array.isArray(rc[targ.id]?.lastOpts)) rc[targ.id].lastOpts = [];
            if (!Array.isArray(rc[targ.id]?.lastOpts))
              console.warn(`Failed to fetch recent last options for the <select>`);
            else {
              for (const o of Object.values(rc[targ.id].lastOpts)) {
                const sOp = Array.from(targ.options).find(op => op.value === o);
                if (sOp && o !== clickEl.value) {
                  sOp.selected = true;
                  sOp.ariaSelected = "true";
                }
              }
            }
            pushSelectOpts(targ, targ.id, Array.from(targ.selectedOptions));
          }
        } catch (e) {
          console.error(`Error executing updateOpts:\n${(e as Error).message}`);
        }
      };
      if (targ instanceof HTMLSelectElement) updateOpts(targ);
      else {
        targ = targ.closest("select");
        if (!(targ instanceof HTMLSelectElement)) {
          console.warn(`Failed to fetch parent select`);
          return;
        }
        updateOpts(targ);
      }
      if (targ.multiple && targ.selectedOptions.length === 0) handleSubmit(targ, targ.form);
    },
    toggleOption(ev: MouseEvent): void {
      try {
        const clickEl = document.elementFromPoint(ev.clientX, ev.clientY);
        if (clickEl instanceof HTMLOptionElement) clickEl.classList.toggle("selected");
      } catch (e) {
        console.error(`Error executing toggleOption:\n${(e as Error).message}`);
      }
    },
    onChange(ev: MouseEvent): void {
      const t = ev.currentTarget;
      if (t instanceof HTMLSelectElement && t.id === "species") formVars.animals = `${t.value}s` as "cats" | "dogs";
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
  setup(props: SelectProps, { emit }: SetupContext<EmitsOptions>) {
    const r = ref<nSl>(null),
      rlb = ref<nLb>(null),
      v = ref(
        (props.type as any) === "select-multiple"
          ? Array.isArray(props.mv)
            ? props.mv
            : []
          : props.mv || props.defV || "dog",
      ),
      s = reactive({
        req: props.required,
        ro: props.readOnly,
        dsb: props.disabled,
        lb: props.lab,
      });
    watch(
      () => s.req as any,
      _ => updateAttrs(r.value, s.ro as any, s.dsb as any, s.req as any),
    );
    watch(
      () => v.value,
      n => {
        (v.value as any) = n || props.defV;
        if ((props.type as any) === "select-multiple" && !Array.isArray(n)) n = [n] as any;
        emit("update:mv", n);
      },
    );
    if ((s.lb as any) === "" && (props.id as any) !== "")
      (s.lb as any) = labMap.get(props.id as any) || props.id || s.lb;
    onMounted(() => {
      try {
        if (!(r.value instanceof HTMLInputElement || r.value instanceof HTMLSelectElement))
          throw new Error(`Couldn't validate the Reference for the input ${props.id}`);
        const form = r.value?.closest("form");
        if (!(form instanceof HTMLFormElement)) throw new Error(`Couldn't found Form for the Input ${props.id}`);
        assignFormAttrs(r.value, form);
      } catch (e) {
        console.error(`Error on defining form properties to the input:\n${(e as Error).message}`);
      }
      handleLabs(r.value, rlb.value, props as any);
      try {
        if (!(r.value instanceof HTMLSelectElement)) throw new Error(`Failed to validate main reference instance`);
        (v.value as any) = props.defV;
        if ((v.value as any) === "" && r.value.options.length > 0) (v.value as any) = r.value.options[0].value;
        (r.value.dataset.default as any) = props.defV;
      } catch (e) {
        console.error(
          `Error executing procedure for defining default value for Select ${props.id}:\n${(e as Error).message}`,
        );
      }
      try {
        if ((props.defV as any) !== "") {
          (v.value as any) = props.defV;
          emit("update:mv", props.defV);
        }
      } catch (e) {
        console.error(`Error executing procedures for defining default Value:\n${(e as Error).message}`);
      }
      if ((props.type as any) === "select-multiple") {
        recolorOpts(r.value, "red");
        limitResize(r.value);
      }
    });
    return {
      s,
      v,
      r,
      rlb,
      tLab: labMap.get(s.lb as any) || s.lb || props.lab,
      o: props.opts,
    };
  },
};
