<template>
  <div
    class="badge mbadge"
    :class="[`mbadge__${variant}`, icon ? 'mbadge__has_icon' : '']"
  >
    <span class="icon" v-if="icon">
      <inline-svg :src="iconPath(icon)" />
    </span>
    <span class="text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string;
  variant?: "primary" | "green" | "yellow" | "red" | "purple" | "blue";
  hasIcon?: boolean;
  icon?: "discount" | "cashback" | "voucher" | string;
}

withDefaults(defineProps<Props>(), {
  text: "Badge",
  variant: "primary",
});

const iconPath = (ic: string) => {
  if (ic === "discount" || ic === "cashback" || ic === "voucher") {
    return "/assets/svg/badge-icons/" + ic + ".svg";
  }
  return ic;
};
</script>

<style lang="scss">
.mbadge {
  border-radius: 6px;
  padding: 6px 20px;
  font-size: 12px;
  line-height: 14.6px;

  &__has_icon {
    padding: 6px 8px !important;
  }

  .icon {
    margin-right: 5px;

    svg {
      width: 13px;
    }
  }

  &__primary {
    background-color: rgba(53, 61, 53, 0.102);
    color: #353d35;

    .icon svg path {
      stroke: #353d35;
    }
  }

  &__green {
    background-color: #2ed47a1a;
    color: #2ed47a;

    .icon svg path {
      stroke: #7dba28;
    }
  }

  &__yellow {
    background-color: #ffa8001a;
    color: #ffa800;

    .icon svg path {
      stroke: #ffa800;
    }
  }

  &__red {
    background-color: #fceaea;
    color: #de2727;

    .icon svg path {
      stroke: #de2727;
    }
  }

  &__purple {
    background-color: #f0ebfc;
    color: #6935d8;

    .icon svg path {
      stroke: #6935d8;
    }
  }

  &__blue {
    background-color: #30a1db1a;
    color: #30a1db;

    .icon svg path {
      stroke: #287dba;
    }
  }
}
</style>
