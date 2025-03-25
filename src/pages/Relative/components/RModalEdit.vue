<template>
  <el-dialog :title="$t('edit_relative')" width="30%" v-model="addShow">
    <div class="d-flex gap-6 flex-column">
      <SFormGroup :label="$t('label')">
        <SInput
          v-model="values.name"
          :error="form.$v.value.name.$error"
          :placeholder="$t('enter_name')"
        />
      </SFormGroup>
    </div>
    <div class="d-flex align-items-center gap-5 mt-7">
      <SButton
        class="w-100"
        variant="secondary"
        :text="$t('cancel')"
        @click="$emit('close')"
      />
      <SButton class="w-100" :text="$t('add')" @click="submit" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, unref, watch } from "vue";

import { TForm } from "@/composables/useForm";
import SButton from "@/stories/Common/Button/SButton.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import STextArea from "@/stories/Form/TextArea/STextArea.vue";

interface Props {
  show?: boolean;
  form?: TForm<any>;
}

const props = withDefaults(defineProps<Props>(), {});

const { form } = unref(props);
const { values, $v } = form;

const emit = defineEmits(["close", "submit"]);

const addShow = ref(false);

function submit() {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    emit("close");
    emit("submit");
  }
}

watch(
  () => props.show,
  () => {
    addShow.value = props.show;
  },
  {
    immediate: true,
  }
);

watch(
  () => addShow.value,
  () => {
    if (!addShow.value) {
      emit("close");
      values.name = "";
      $v.value.$reset();
    }
  }
);
</script>

<style scoped>
.mr-3 {
  margin-right: 10px;
}
</style>
