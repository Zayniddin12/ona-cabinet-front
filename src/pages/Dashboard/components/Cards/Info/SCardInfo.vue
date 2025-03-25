<template>
  <div
    class="w-100 h-100 rounded-12 d-flex flex-column justify-content-between p-9 position-relative overflow-hidden"
  >
    <div>
      <inline-svg :src="card?.icon" />
    </div>
    <div>
      <p class="fs-28 lh-33 fw-bolder text-white mb-1">{{ card?.total }}</p>
      <p class="fs-14 lh-16 fw-bolder text-white">{{ card?.subtitle }}</p>
    </div>
    <div class="pattern">
      <div class="pattern-inner" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  card: {
    icon: string;
    total: string;
    subtitle: string;
  };
}

withDefaults(defineProps<Props>(), {});
</script>

<style scoped>
.pattern {
  border-radius: 9999px;
  border: 40px solid rgba(255, 255, 255, 0.2);
  position: absolute;
  transform: scale(1.2);
  top: -36px;
  right: -36px;
}

.pattern-inner {
  width: 110px;
  height: 110px;
}
</style>
