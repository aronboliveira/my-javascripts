<script lang="ts">
import { defineComponent } from "vue";
import defn from "./scripts/definition";
export default defineComponent(defn);
</script>
<template>
  <div
    ref="r"
    :id="id"
    :class="{ 'carousel slide': true, 'carousel-fade': fade === true }"
    :data-bs-ride="ride"
  >
    <fieldset v-if="hasIndicators" class="carousel-indicators">
      <button
        v-for="(_, i) in figures"
        :key="`indicator-${i}`"
        type="button"
        :data-bs-target="`#${id}`"
        :data-bs-slide-to="i"
        :aria-label="`Slide ${i + 1}`"
        :class="{ active: i === (defFig ?? 0) }"
      ></button>
    </fieldset>
    <div class="carousel-inner">
      <div
        v-for="(figure, i) in figures"
        :key="`fig__carousel__${i}`"
        :class="{ 'carousel-item': true, active: i === (defFig ?? 0) }"
        :data-bs-interval="ride ? figure.interv ?? 2000 : ''"
      >
        <img
          :src="figure.src"
          :alt="figure.alt"
          class="d-block w-100"
          crossorigin="anonymous"
          fetchpriority="high"
        />
        <hgroup v-if="hasLabels" class="carousel-caption d-none d-md-block">
          <h5 class="carousel-caption-title">{{ figure.labTitle }}</h5>
          <p class="carousel-caption-description">{{ figure.labDesc }}</p>
        </hgroup>
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      :data-bs-target="`#${id}`"
      data-bs-slide="prev"
      title="Move to previous slide"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      :data-bs-target="`#${id}`"
      data-bs-slide="next"
      title="Move to next slide"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>
<style scoped>
.carousel-caption.d-none {
  display: block !important;
}
</style>
