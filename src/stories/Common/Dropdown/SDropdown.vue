<template>
  <div class="dropdown" :class="[wrapperClass, { 'dropdown-active': opened }]">
    <div class="dropdown-header" @click.stop="opened = !opened">
      <slot name="head" />
    </div>
    <div
      v-if="!disabled"
      class="dropdown__list"
      :class="[{ '!w-100': full }, bodyClass]"
      @click.prevent="handleCloseDropdown"
    >
      <slot name="body" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

interface Props {
  arrow?: boolean;
  arrowClass?: string;
  full?: boolean;
  removeEvent?: boolean;
  above: boolean;
  wrapperClass?: string;
  bodyClass?: string;
  arrowDisplay?: boolean;
  close?: boolean;
  disabled: boolean;
  opened?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  arrow: false,
  full: false,
  removeEvent: false,
  above: false,
  arrowClass: "",
  wrapperClass: "",
  arrowDisplay: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: "on-toggle", boolean: any): void;
}>();

let opened = ref(false);
watch(opened, (newValue) => emit("on-toggle", newValue));

onMounted(() => {
  if (!props.removeEvent) {
    document.addEventListener("mousedown", hideEvent);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", hideEvent);
});

watch(
  () => props.removeEvent,
  (newV) => {
    if (newV) {
      document.removeEventListener("mousedown", hideEvent);
    } else {
      document.addEventListener("mousedown", hideEvent);
    }
  }
);

watch(
  () => props.opened,
  () => {
    opened.value = props.opened;
  }
);

const hideEvent = (e: any) => {
  if (!e.target.closest(".dropdown-active") && opened.value) {
    opened.value = false;
  }
};

function handleCloseDropdown() {
  // if (!props.removeEvent) {
  //   opened.value = !opened.value;
  // }
}
</script>

<style scoped lang="scss">
.dropdown-active .dropdown__list {
  top: 110%;
  box-shadow: 0 5px 8px rgba(51, 64, 85, 0.04),
    inset 0 -1px 0 rgba(182, 186, 191, 0.2);
  background: #fff;
  opacity: 1;
  visibility: visible;
  transform-origin: top center;
  border: 1px solid #f3f5f8;
}

.dropdown {
  display: inline-block;
  transition: all 150ms linear;
  cursor: pointer;
  user-select: none;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
  }

  &__list {
    overflow: auto;
    position: absolute;
    right: 0;
    visibility: hidden;
    z-index: 10;
    background: #ffffff;
    border: 1px solid #e1e3e2;
    box-shadow: 0 4px 21px rgba(128, 128, 128, 0.07);
    border-radius: 8px;
    transition: all 150ms linear;
    width: 100%;
    height: auto;
    opacity: 0;
    top: 150%;
  }
}
</style>
