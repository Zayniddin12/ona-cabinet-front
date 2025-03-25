<template>
  <div class="dropdown-item w-100" @click.stop="$emit('on-handle')">
    <div
      class="py-4 border-b border-solid border-[#F3F5F8] flex-y-center gap-2.5"
      :class="{ 'border-t border-solid border-[#F3F5F8]': index !== 0 }"
    >
      <p class="text-blue-900 text-sm font-normal">
        {{ $t(item.name) }}
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  item: {
    icon: string;
    name: string;
  };
  index: number;
}

withDefaults(defineProps<Props>(), {});
</script>
<style scoped lang="scss">
.dropdown-item {
  padding-left: 16px;
  transition: all 300ms;
  min-width: 245px;
  background: #f7faf8;
  &:hover {
    background: #7dba281a;
  }
}
</style>
