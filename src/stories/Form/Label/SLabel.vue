<template>
  <label class="form__label">
    {{ title }}
    <span v-if="required" class="required-label">*</span>
  </label>
</template>

<script lang="ts" setup>
interface Props {
  title?: string;
  required?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: "",
});
</script>

<style scoped>
.form__label {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #191e36;
  opacity: 0.7;
  position: relative;
}

.required-label {
  color: #fa3232;
}
</style>
