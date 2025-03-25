<template>
  <div class="i-breadcrumb">
    <div
      v-for="(route, index) in routes"
      :key="index"
      class="i-breadcrumb__wrapper"
      :class="[checkLastRoute(index), `text-[${textColor}]`]"
    >
      <router-link
        v-if="index !== routes.length - 1"
        class="transition duration-500 i-breadcrumb__link"
        :class="[`hover:text-[${hoverColor}]`]"
        :to="route.route"
      >
        {{ $t(route.name) }}
      </router-link>
      <p v-if="index === routes.length - 1" class="i-breadcrumb__last">
        {{ $t(route.name) }}
      </p>
      <span
        v-if="index !== routes.length - 1"
        class="mx-2 i-breadcrumb__separator"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IRoute {
  name: string;
  route: string;
  link?: boolean;
  disabled?: boolean;
}

interface Props {
  routes: IRoute[];
  hoverColor?: string;
  textColor?: string;
}
const props = withDefaults(defineProps<Props>(), {
  hoverColor: "#409eff",
  textColor: "#1C1F20",
});
const checkLastRoute = (index: number) => {
  if (index === props.routes.length - 1) {
    return "font-normal cursor-not-allowed";
  } else {
    return "font-bold cursor-pointer";
  }
};
</script>
<style lang="scss">
.i-breadcrumb {
  display: flex;
  align-items: center;
  &__wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  &__link {
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    display: flex;
    align-items: center;
    color: #1c1f20;
  }
  &__last {
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    display: flex;
    align-items: center;
    color: #a2abbe;
  }
  &__separator {
    background: #30a1db;
    width: 4px;
    height: 4px;
    border-radius: 50%;
  }
}
</style>
