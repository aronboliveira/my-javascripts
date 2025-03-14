<script lang="ts">
  import { defineComponent } from "vue";
  import defn from "./scripts/select/definition";
  //@ts-ignore
  export default defineComponent(defn);
</script>
<template>
  <fieldset :id="`${id}Fs`" :class="{ 'form-group': true, fading: id === 'size' }">
    <label :id="`${id}Lab`" :for="id" ref="rlb" class="form-label">{{ tLab }}</label>
    <select
      ref="r"
      class="form-select"
      style="min-width: max-content !important"
      v-model="v"
      :data-model="mv"
      :id="id"
      :name="id.replace(/([A-Z])/g, (m: any) => (m === id.charAt(0) ? `${m.toLowerCase()}` : `_${m.toLowerCase()}`))"
      :required="s.req"
      :readonly="s.ro"
      :disabled="s.dsb"
      :data-type="type"
      :multiple="type === 'select-multiple' ? true : false"
      :autofocus="id === 'size' ? true : false"
      :size="type === 'select-multiple' ? 2 : undefined"
      @click.prevent="handleClick"
      @mousedown="toggleOption"
      @change="onChange"
    >
      <optgroup v-if="o.options && o.lab" v-for="o in opts" :key="`optgrp__${o.lab}__${id}`" :label="o.lab">
        <option v-for="op in o.options" :key="`opt__${op.value}__${lab}__${id}`" :value="op.value">
          {{ op.text }}
        </option>
      </optgroup>
      <option v-else v-for="o in opts" :key="`opt__${o.value}__${id}`" :value="o.value">
        {{ o.text }}
      </option>
    </select>
  </fieldset>
</template>
<style scoped>
  fieldset {
    display: flex;
    flex-flow: column wrap;
    label {
      width: 100%;
    }
    select {
      width: 100%;
    }
    select[multiple] {
      min-height: 2.5rem !important;
    }
  }
</style>
