<script lang="ts">
  import { defineComponent } from "vue";
  import defn from "./scripts/num/definition";
  //@ts-ignore
  export default defineComponent(defn);
</script>
<template>
  <fieldset :id="`${id}Fs`" class="form-group">
    <label :id="`${id}Lab`" :for="id" ref="rlb" class="form-label">{{ tLab }}</label>
    <input
      v-model="s.v"
      ref="r"
      class="form-control"
      type="number"
      dir="ltr"
      min="0"
      max="999"
      :name="id.replace(/([A-Z])/g, (m: any) => (m === id.charAt(0) ? `${m.toLowerCase()}` : `_${m.toLowerCase()}`))"
      :dirName="`${id.replace(/([A-Z])/g, (m: any) => (m === id.charAt(0) ? `${m.toLowerCase()}` : `_${m.toLowerCase()}`))?.direction ?? ''}`"
      :data-number="s.vn"
      :placeholder="`Digite ${tLab.toLowerCase() === 'idade' ? 'a' : 'o'} ${tLab} aqui`"
      :id="id"
      :minlength="minLength"
      :maxlength="maxLength"
      :autocomplete="autocomplete"
      :pattern="s.pt"
      :required="s.req"
      :disabled="s.dsb"
      :readonly="s.ro"
      :step="Number.isFinite(step) ? step.toFixed(0) : 1"
      @input="onChange"
    />
    <datalist v-if="dataList.length > 0" :id="`${id}List`" ref="dr" :data-inp="id">
      <option v-for="d in recentSelections[id] ?? dataList" :key="`opt__${id}List__${d}`" :value="d"></option>
    </datalist>
  </fieldset>
</template>
<style scoped>
  fieldset {
    display: flex;
    flex-flow: column wrap;
    label {
      width: 100%;
    }
    input {
      width: 100%;
    }
  }
</style>
