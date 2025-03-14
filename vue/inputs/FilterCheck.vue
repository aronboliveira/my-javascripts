<script lang="ts">
  import { defineComponent } from "vue";
  import defn from "./scripts/check/definition";
  //@ts-ignore
  export default defineComponent(defn);
</script>
<template>
  <fieldset :id="`${id}Fs`" :class="{ 'form-group form-check': true, fading: id === 'felv' || id === 'fiv' }">
    <label class="form-check-label" :id="`${id}Lab`" :for="id" ref="rlb">{{ tLab }}</label>
    <input
      v-model="s.v"
      ref="r"
      type="checkbox"
      class="form-check-input"
      :id="id"
      :name="id.replace(/([A-Z])/g, (m: any) => (m === id.charAt(0) ? `${m.toLowerCase()}` : `_${m.toLowerCase()}`))"
      :required="s.req"
      :disabled="s.dsb"
      :readonly="s.ro"
      :data-check="s.ck"
      :autofocus="id === 'felv' ? true : false"
      @change="onChange"
    />
  </fieldset>
</template>
<style scoped>
  fieldset {
    display: flex;
    flex-flow: column wrap;
    label {
      width: 100%;
    }
  }
</style>
