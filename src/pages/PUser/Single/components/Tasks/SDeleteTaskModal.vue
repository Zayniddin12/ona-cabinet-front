<template>
  <el-dialog :title="$t(title)" width="30%" v-model="deleteShow">
    <div>
      <p class="fs-4 text-dark-blue text-center leading-140 fw-bold opacity-75">
        {{ $t(text) }}
      </p>
      <div class="d-flex align-items-center gap-5 mt-9">
        <SButton
          class="w-100"
          :text="$t('cancel')"
          variant="secondary"
          @click="$emit('close')"
        />
        <SButton
          v-bind="{ loading }"
          class="w-100"
          :variant="buttonVariant"
          :text="$t(buttonText)"
          @click="$emit('submit')"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import SButton from "@/stories/Common/Button/SButton.vue";

interface Props {
  show?: boolean;
  title?: string;
  text?: string;
  buttonText?: string;
  loading?: boolean;
  buttonVariant?:
    | "primary"
    | "secondary"
    | "green"
    | "transparent"
    | "danger"
    | "danger-solid"
    | "gray";
}

const props = withDefaults(defineProps<Props>(), {
  title: "delete_task",
  text: "delete_task_text",
  buttonText: "delete",
  buttonVariant: "danger-solid",
});

const emit = defineEmits(["close"]);

const deleteShow = ref(false);

watch(
  () => props.show,
  () => {
    deleteShow.value = props.show;
  },
  {
    immediate: true,
  }
);

watch(
  () => deleteShow.value,
  () => {
    if (!deleteShow.value) {
      emit("close");
    }
  }
);
</script>
