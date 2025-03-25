<template>
  <el-dialog class="passport" v-model="showInner">
    <div class="passport-body">
      <button class="close-button" @click="$emit('close')">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_318_19420)">
            <path
              d="M23.5425 8.45752L8.45752 23.5425M8.45752 8.45752L23.5425 23.5425"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_318_19420">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </button>
      <img :src="image" alt="passport" class="w-100 h-100" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const active = ref("");

interface Props {
  show?: boolean;
  image?: string;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["close"]);

const showInner = ref(false);

watch(
  () => props.show,
  () => {
    showInner.value = props.show;
  },
  {
    immediate: true,
  }
);

watch(
  () => showInner.value,
  () => {
    if (!showInner.value) {
      emit("close");
    }
  }
);
</script>

<style lang="scss" scoped>
.passport-body {
  max-width: 740px;
  max-height: 540px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;

  .close-button {
    position: absolute;
    top: -32px;
    right: -32px;
    background: transparent !important;
    outline: none;
    border: none;

    &:hover {
      svg {
        path {
          stroke: #fa3232;
        }
      }
    }

    &:active {
      transform: scale(0.9);
    }
  }

  img {
    object-fit: cover;
  }
}
</style>

<style lang="scss">
.passport {
  background: transparent !important;
  box-shadow: none;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    background: transparent !important;
  }
}
</style>
