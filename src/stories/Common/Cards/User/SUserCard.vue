<template>
  <div class="py-custom">
    <RouterLink
      v-if="!disabled"
      :to="
        !responsible
          ? `/dashboard/participants/${data?.id}`
          : `/responsible-person/${data?.id}/care`
      "
      class="fs-14 text-dark-black hover-blue leading-130 fw-semibold transition-200"
    >
      {{ data?.full_name }}
    </RouterLink>
    <div
      v-else
      class="fs-14 cursor-none text-dark-black leading-130 fw-semibold transition-200"
    >
      {{ data?.full_name }}
    </div>
    <p class="fs-7 text-dark-secondary leading-100 mt-1">ID: {{ data?.ID }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: {
    id: string;
    full_name: string;
    ID: string;
  };
  responsible?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {});
</script>

<style scoped>
.py-custom {
  padding: 5px 0 5px 0;
}
.cursor-none {
  cursor: default;
}
</style>
