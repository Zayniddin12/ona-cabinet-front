<template>
  <button
    v-bind="{ type }"
    class="btn mbtn d-flex align-items-center justify-content-center position-relative"
    :class="[
      `size__${size}`,
      `type__${variant}`,
      { 'disabled-button': disabled | loading },
    ]"
    :style="{ '--spinnerColor': spinnerColor }"
  >
    <span
      :class="[
        's-btn-loader transition-300 absolute-center',
        loading ? 'opacity-100 visible' : 'opacity-0 invisible',
      ]"
    >
      <svg class="circular-loader" viewBox="25 25 50 50">
        <circle
          class="circular-loader__path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
        />
      </svg>
    </span>
    <span
      :class="!loading ? 'opacity-100 visible' : 'opacity-0 invisible'"
      class="d-flex align-items-center"
    >
      <slot name="pre-icon"></slot>
      <slot>
        {{ $t(text) }}
      </slot>
      <slot name="post-icon"></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string;
  variant?:
    | "primary"
    | "secondary"
    | "green"
    | "transparent"
    | "danger"
    | "danger-solid"
    | "gray";
  size?: "sm" | "md" | "lg";
  icon?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  loading?: boolean;
  spinnerColor?: string;
}

withDefaults(defineProps<Props>(), {
  text: "Button",
  variant: "primary",
  size: "md",
  type: "button",
  spinnerColor: "#fff",
});
</script>

<style lang="scss">
.mbtn {
  transition: 0.3s ease-in-out;
  border: 1px solid transparent !important;
  border-radius: 8px !important;

  &:active {
    transition: 0.1s;
    scale: 0.95;
  }

  .icon {
    margin-right: 4px;

    svg path {
      transition: 0.2s;
    }
  }

  &.size {
    &__sm {
      padding: 9px 16px;
      font-size: 12px;
      font-weight: 500;
      line-height: 15.6px;
    }

    &__md {
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      line-height: 19.6px;
    }

    &__lg {
      padding: 12px 22px;
      font-size: 16px;
      font-weight: 600;
      line-height: 26px;
    }
  }

  &.type {
    &__primary {
      background-color: #30a1db;
      color: white !important;

      .icon svg path {
        stroke: white;
      }

      &:hover {
        background-color: rgba(50, 164, 222, 0.8);
      }
    }

    &__secondary {
      background-color: rgba(48, 161, 219, 0.1);
      color: #30a1db;

      .icon svg path {
        stroke: white;
      }

      &:hover {
        border: 1px solid #30a1db !important;
        background-color: white;
      }

      &:active {
        color: #30a1db;
      }
    }

    &__green {
      background-color: #2ed47a;
      color: white !important;

      .icon svg path {
        stroke: white;
      }

      &:hover {
        background-color: #08ea70;
      }
    }

    &__danger {
      background-color: rgba(250, 50, 50, 0.1);
      color: #fa3232 !important;

      .icon svg path {
        stroke: #fa3232;
      }

      &:hover {
        border: 1px solid #fa3232 !important;
        background-color: white;
      }
    }

    &__danger-solid {
      background-color: #ff4c4c;
      color: #fff;

      .icon svg path {
        stroke: #fff;
      }

      &:hover {
        color: #ff4c4c !important;
        border: 1px solid #fa3232 !important;
        background-color: white;
      }
    }

    &__gray {
      background-color: #a2abbe;
      color: white !important;

      .icon svg path {
        stroke: white;
      }

      &:hover {
        opacity: 0.8;
      }

      &:active {
        background-color: #a2abbe;
        color: white !important;
      }
    }
  }
}

.disabled-button {
  pointer-events: none;
  cursor: not-allowed !important;
  background: #a2abbe !important;
  color: #fff !important;

  svg {
    path {
      stroke: #fff;
    }
  }
}

.s-btn-loader .circular-loader {
  width: 24px;
  height: 24px;
  stroke: var(--spinnerColor);
}

.s-btn-loader .circular-loader__path {
  fill: none;
  stroke-width: 5px;
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
</style>
