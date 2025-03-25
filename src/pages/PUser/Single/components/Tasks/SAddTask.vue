<template>
  <el-dialog :title="$t('add_task')" width="30%" v-model="addShow">
    <div class="d-flex gap-6 flex-column">
      <SFormGroup :label="$t('task')">
        <STextArea
          v-model="values.task"
          :error="form.$v.value.task.$error"
          :placeholder="$t('enter_task_meaning')"
          maxlength="250"
        />
      </SFormGroup>

      <SFormGroup :label="$t('akt')">
        <SInput
          v-model="values.akt"
          :error="form.$v.value.akt.$error"
          :placeholder="$t('enter_akt')"
        />
      </SFormGroup>

      <SFormGroup :label="$t('program')">
        <SRemoteSearch
          v-model="values.program"
          :placeholder="$t('choose_program')"
          :error="form.$v.value.program.$error"
          :options="programs"
          :default-value="values.program"
          observe
          label-key="name"
          value-key="id"
          @on-search="$emit('search-program', $event)"
          @fetch-data="emit('fetch-more-programs')"
        />
      </SFormGroup>

      <SFormGroup :label="$t('responsible_person')">
        <SRemoteSearch
          v-model="values.responsible_person"
          :placeholder="$t('choose_responsible_person')"
          :error="form.$v.value.responsible_person.$error"
          :options="responsiblePersons"
          :default-value="values.responsible_person"
          observe
          inner-user
          label-key="first_name"
          value-key="id"
          @on-search="$emit('search-responsible-person', $event)"
          @fetch-data="emit('fetch-more-responsible-persons')"
        />
      </SFormGroup>

      <SFormGroup :label="$t('period')">
        <DatePicker
          v-model="values.deadline"
          :error="form.$v.value.deadline.$error"
          :min-date="new Date()"
        />
      </SFormGroup>
    </div>
    <div class="d-flex align-items-center gap-5 mt-12">
      <SButton
        class="w-100"
        variant="secondary"
        :text="$t('cancel')"
        @click="$emit('close')"
      />
      <SButton
        class="w-100"
        :text="$t('add')"
        @click="submit"
        v-bind="{ loading }"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, unref, watch } from "vue";

import DatePicker from "@/components/Datepicker/DatePicker.vue";
import { TForm } from "@/composables/useForm";
import SButton from "@/stories/Common/Button/SButton.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import SRemoteSearch from "@/stories/Form/SRemoteSearch.vue";
import STextArea from "@/stories/Form/TextArea/STextArea.vue";
import { IProgram } from "@/types/programs";
import { ITask } from "@/types/tasks";

interface Props {
  show?: boolean;
  form?: TForm<any>;
  responsiblePersons?: ITask[];
  programs?: IProgram[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const { form } = unref(props);
const { values, $v } = form;

const emit = defineEmits(["close", "submit"]);

const addShow = ref(false);

function submit() {
  $v.value.$touch();
  if (!$v.value.$invalid) {
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
      values.akt = "";
      values.task = "";
      values.program = "";
      values.responsible_person = "";
      values.deadline = "";
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
