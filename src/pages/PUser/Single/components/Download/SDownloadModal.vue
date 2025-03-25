<template>
  <el-dialog
    :title="$t('application_download')"
    width="30%"
    v-model="downloadShow"
  >
    <div class="download-body">
      <SDownloadRadio
        :info="{
          icon: '/assets/ona/svg/hand-money.svg',
          title: $t('to_donor'),
        }"
        :active="active === 'donor'"
        @click="active = 'donor'"
      />
      <SDownloadRadio
        :info="{
          icon: '/assets/ona/svg/user-stroke.svg',
          title: $t('for_employee'),
        }"
        :active="active === 'employee'"
        @click="active = 'employee'"
      />
      <!--   /assets/ona/svg/hand-money.svg   -->
    </div>

    <div class="d-flex align-items-center gap-4 mt-7">
      <SButton
        class="w-100"
        variant="secondary"
        :text="$t('cancel')"
        @click="$emit('close')"
      />
      <SButton
        class="w-100"
        :text="$t('download')"
        @click="$emit('submit', active)"
        :disabled="!active"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import SDownloadRadio from "@/pages/PUser/Single/components/Download/SDownloadRadio.vue";
import SButton from "@/stories/Common/Button/SButton.vue";

const active = ref("");

interface Props {
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["close"]);

const downloadShow = ref(false);

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
.download-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
</style>
