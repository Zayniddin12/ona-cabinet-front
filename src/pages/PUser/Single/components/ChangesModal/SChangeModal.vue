<template>
  <el-dialog
    class="changes"
    :title="$t('history_changes')"
    width="30%"
    v-model="downloadShow"
    lock-scroll
  >
    <div class="changes-body">
      <SUserLastChangeCard
        v-for="(card, index) in list"
        :key="index"
        v-bind="{ index, card }"
        :is-last="index === card?.length - 1"
      />

      <div
        class="d-flex align-items-center justify-content-center flex-column pt-5 pb-12"
        v-if="list.length === 0"
      >
        <img src="/assets/ona/image/no-data.svg" alt="" class="mb-4" />
        <p>{{ $t("no_changes") }}</p>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import SUserLastChangeCard from "@/pages/PUser/Single/components/Cards/UserLastChange/SUserLastChangeCard.vue";

const active = ref("");

interface Props {
  show?: boolean;
  list?: {
    action: number;
    id: number;
    object_repr: string;
    participant: {
      full_name: string;
      id: number;
      point: number;
      responsible_person: string;
    };
    timestamp: Date;
  }[];
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["close"]);

const downloadShow = ref(false);

const cards = ref([
  {
    name: "Мусаев Хайрулла",
    date: new Date(),
  },
  {
    name: "Мусаев Хайрулла",
    date: new Date(),
  },
  {
    name: "Мусаев Хайрулла",
    date: new Date(),
  },
  {
    name: "Мусаев Хайрулла",
    date: new Date(),
  },
  {
    name: "Мусаев Хайрулла",
    date: new Date(),
  },
  {
    name: "Мусаев Хайрулла",
    date: new Date(),
  },
  {
    name: "Мусаев Хайрулла",
    date: new Date(),
  },
  {
    name: "Мусаев Хайрулла",
    date: new Date(),
  },
]);

watch(
  () => props.show,
  () => {
    downloadShow.value = props.show;
  },
  {
    immediate: true,
  }
);

watch(
  () => downloadShow.value,
  () => {
    if (!downloadShow.value) {
      emit("close");
    }
  }
);
</script>

<style scoped>
.changes-body {
  margin-top: 8px;
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 400px;
}
</style>

<style lang="scss">
.changes {
  position: relative;
  overflow: hidden;

  .el-dialog__body {
    padding: 0 !important;
  }
}
</style>
