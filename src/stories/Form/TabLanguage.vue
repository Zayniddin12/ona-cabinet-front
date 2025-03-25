<template>
  <div class="language-wrapper">
    <button
      class="form-language-switcher"
      :class="modelValue === 'uz' && 'active'"
      @click="emit('update:modelValue', 'uz')"
    >
      O‘zbekcha
    </button>
    <button
      class="form-language-switcher"
      :class="modelValue === 'ru' && 'active'"
      @click="emit('update:modelValue', 'ru')"
    >
      Русский
    </button>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "uz",
});
const emit = defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped>
.language-wrapper {
  margin-bottom: 20px;
}

.form-language-switcher {
  position: relative;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #a2abbe;
  padding: 8px 12px 14px 12px;
  margin-right: 12px;
  background: transparent;
  transition: 0.3s ease all;
  border: none;

  &:before {
    content: "";
    width: 100%;
    height: 100%;
    display: block;
    background: linear-gradient(
      180deg,
      rgba(48, 161, 219, 0) 0%,
      rgba(48, 161, 219, 0.1) 100%
    );
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: 0.3s ease all;
  }

  &:after {
    content: "";
    width: 100%;
    height: 2px;
    background-color: #30a1db;
    display: block;
    border-radius: 3px;
    position: absolute;
    inset: auto 0 0 0;
    opacity: 0;
    transition: 0.3s ease all;
  }

  &.active {
    color: #30a1db;

    &:after {
      opacity: 1;
    }

    &:before {
      opacity: 1;
    }

    transition: 1s ease all;
  }
}
</style>
