<template>
  <ElDialog
    v-bind="{ width }"
    v-model="filterShow"
    :title="`${$t('score')} ${pointsCount || ''}`"
    class="filter-modal"
  >
    <ul>
      <li
        v-for="el in pointList"
        :key="el.id"
        class="point-list d-flex justify-content-between align-center py-1"
      >
        <p>{{ el.title }}</p>
        <span>{{ el.point }}</span>
      </li>
    </ul>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import { IPointList } from "@/types";

interface Props {
  show?: boolean;
  filters?: Array<any>;
  width?: string;
  bodyClass?: string;
  full?: boolean;
  wrapperStyle?: string;
  pointList?: IPointList[];
  pointsCount: number;
  img?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: "50%",
});

// ******* EMITS *******
const emit = defineEmits<{
  (e: "close"): void;
  (e: "change", value: any): void;
}>();

const filterShow = ref(false);

watch(
  () => props.show,
  () => {
    filterShow.value = props.show;
  },
  {
    immediate: true,
  }
);

watch(
  () => filterShow.value,
  () => {
    if (!filterShow.value) {
      emit("close");
    }
  }
);
</script>

<style lang="scss">
ul {
  padding: 0;
  margin: 0;
}
.point-list {
  list-style: none;
  span {
    padding: 6px 12px;
    width: 50px;
    border-radius: 4px;
    background-color: #2ed47a;
    color: white;
    display: grid;
    place-items: center;
  }
}
</style>
