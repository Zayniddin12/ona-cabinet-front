<template>
  <div
    class="qr position-relative d-inline-flex align-items-center justify-content-center"
  >
    <transition name="fade" mode="out-in">
      <div :key="loading">
        <div
          v-if="loading"
          :style="{ width: size + 'px', height: size + 'px' }"
        >
          <i
            class="qr__loader i-transition absolute-center-h absolute-center-v"
          >
            <svg class="w-50px h-50px" viewBox="25 25 50 50">
              <circle
                class="qr-loader__path"
                cx="50"
                cy="50"
                r="20"
                fill="none"
              />
            </svg>
          </i>
        </div>
        <QRCanvas
          v-else
          :options="options"
          :style="{
            width: size + 'px',
            height: size + 'px',
            display: 'inherit',
          }"
          :class="qrClass"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { QRCanvas } from "qrcanvas-vue";
import { ref } from "vue";

interface Props {
  text: string;
  margin?: number;
  loading?: boolean;
  size?: number;
  qrClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  size: 160,
});

const options = ref({
  cellSize: 12,
  data: props.text,
  foreground: "white",
  background: "#7DBA28",
});
</script>

<style scoped lang="scss">
.qr-loader__path {
  fill: none;
  stroke-width: 5px;
  stroke: #fff;
  stroke-linecap: round;
  animation: animate-stroke 1s ease-in-out infinite;
}

@keyframes animate-stroke {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
}

.qr {
  background: #7dba28;
  border-radius: 15px;
  padding: 20px;

  &__loader {
    top: 35%;
  }
}
</style>
