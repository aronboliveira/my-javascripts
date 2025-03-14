<script lang="ts">
  import { defineComponent } from "vue";
  import defn from "./scripts/text/definition";
  //@ts-ignore
  export default defineComponent(defn);
</script>
<template>
  <fieldset :id="`${id}Fs`" class="form-group">
    <label :id="`${id}Lab`" :for="id" ref="rlb" class="form-label">{{ tLab }}</label>
    <input
      v-model="s.v"
      class="form-control"
      ref="r"
      type="text"
      dir="ltr"
      :name="id.replace(/([A-Z])/g, (m: any) => (m === id.charAt(0) ? `${m.toLowerCase()}` : `_${m.toLowerCase()}`))"
      :dirName="`${id.replace(/([A-Z])/g, (m: any) => (m === id.charAt(0) ? `${m.toLowerCase()}` : `_${m.toLowerCase()}`))?.direction ?? ''}`"
      :data-number="s.vn"
      :placeholder="`Digite o ${tLab} aqui`"
      :id="id"
      :minLength="minLength"
      :maxLength="maxLength"
      :autocomplete="autocomplete"
      :autocapitalize="autocapitalize"
      :pattern="s.pt"
      :required="s.req"
      :disabled="s.dsb"
      :readonly="s.ro"
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
