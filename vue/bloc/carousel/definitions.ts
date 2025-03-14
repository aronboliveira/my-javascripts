import { ref, onMounted } from "vue";
import { nDv } from "../../../scripts/declarations/types";
import { ImgProps } from "../../../scripts/declarations/interfaces";
const carouselDefinition = {
  name: "Carousel",
  props: {
    id: {
      type: String,
      required: true,
      default: "",
    },
    figures: {
      type: Array as () => ImgProps[],
      required: true,
      default: () => [{ src: "", alt: "" }],
    },
    defFig: {
      type: Number,
      required: false,
      default: 0,
    },
    hasIndicators: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasLabels: {
      type: Boolean,
      required: false,
      default: false,
    },
    fade: {
      type: Boolean,
      required: false,
      default: false,
    },
    ride: {
      type: String,
      required: false,
      default: "false",
    },
    interval: {
      type: Number,
      required: false,
      default: 5000,
    },
    pause: {
      type: Boolean,
      required: false,
      default: true,
    },
    keyboard: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  setup() {
    const r = ref<nDv>(null);
    onMounted(() => {
      try {
        if (!(r.value instanceof HTMLElement)) {
          throw new Error("Failed to validate instance of main reference");
        }
        const rideAttr = r.value.getAttribute("data-bs-ride");
        if (
          rideAttr !== "carousel" &&
          rideAttr !== "true" &&
          rideAttr !== "false"
        )
          r.value.setAttribute("data-bs-ride", "false");
      } catch (e) {
        console.error(
          `Error executing procedure to define pause behavior string:\n${
            (e as Error).message
          }`
        );
      }
    });
    return {
      r,
    };
  },
};
export default carouselDefinition;
