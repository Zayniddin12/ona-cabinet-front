<template>
  <div>
    <img v-if="active" src="/assets/ona/svg/tick.svg" alt="tick" />
    <img v-else src="/assets/ona/svg/x-red.svg" alt="tick" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  active?: boolean;
}

withDefaults(defineProps<Props>(), {});
</script>
