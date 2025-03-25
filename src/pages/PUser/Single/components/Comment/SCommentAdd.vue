<template>
  <el-dialog
    :title="$t(edit ? 'edit_comment' : 'add_comment')"
    width="30%"
    v-model="addShow"
  >
    <div class="d-flex gap-6 flex-column">
      <SFormGroup :label="$t('comment')">
        <template #labelOpposite>
          <p class="fs-6 fw-bold lh-16 text-secondary-dark">
            {{ form.values.comment?.length }}/2500
          </p>
        </template>
        <STextArea
          v-model="form.values.comment"
          :error="form.$v.value.comment.$error"
          maxlength="2500"
          :placeholder="$t('enter_comment')"
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
      <SButton
        class="w-100"
        :text="$t(edit ? 'edit' : 'add')"
        @click="submit"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import { ref, watch } from "vue";

import { TForm, useForm } from "@/composables/useForm";
import SButton from "@/stories/Common/Button/SButton.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import STextArea from "@/stories/Form/TextArea/STextArea.vue";

interface Props {
  show?: boolean;
  form?: TForm<any>;
  edit?: boolean;
  data?: {
    comment: string;
  };
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits(["close", "submit"]);

const form = useForm(
  {
    comment: "",
  },
  {
    comment: {
      required,
    },
  }
);

const addShow = ref(false);

function submit() {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    emit("submit", form.values.comment);
  }
}

watch(
  () => props.show,
  () => {
    addShow.value = props.show;
    if (props.edit) {
      form.values.comment = props.data?.comment;
    }
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
      form.values.comment = "";
      form.$v.value.$reset();
    }
  }
);
</script>

<style scoped>
.mr-3 {
  margin-right: 10px;
}
</style>
