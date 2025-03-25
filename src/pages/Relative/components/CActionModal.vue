<template>
  <el-dialog
    :title="add ? $t('add_relative') : $t('edit_relative')"
    width="30%"
    v-model="addShow"
    class="overflow-hidden"
    :before-close="handleClose"
  >
    <TabLanguage v-model="currentLanguage" />
    <Transition
      mode="out-in"
      :name="currentLanguage === 'uz' ? 'language-left' : 'language'"
    >
      <div v-if="currentLanguage === 'uz'" class="d-flex gap-6 flex-column">
        <SFormGroup label="Nomi">
          <SInput
            v-model="values.name_uz"
            :error="$v.name_uz.$error"
            :placeholder="$t('enter_name')"
            type="text"
          />
        </SFormGroup>
      </div>
      <div v-else class="d-flex gap-6 flex-column">
        <SFormGroup label="Имя">
          <SInput
            v-model="values.name_ru"
            :error="$v.name_ru.$error"
            placeholder="Введите имя"
            type="text"
          />
        </SFormGroup>
      </div>
    </Transition>
    <div class="d-flex align-items-center gap-5 mt-7">
      <SButton
        class="w-100"
        variant="secondary"
        :text="$t('cancel')"
        @click="handleBackClose"
      />
      <SButton
        class="w-100"
        :text="add ? $t('add') : $t('save')"
        @click="submit"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import { ref, unref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { TForm } from "@/composables/useForm";
import SButton from "@/stories/Common/Button/SButton.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import TabLanguage from "@/stories/Form/TabLanguage.vue";

interface Props {
  show?: boolean;
  form?: TForm<any>;
  add?: boolean;
  edit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const { form } = unref(props);
const { values, $v } = form;
const { t } = useI18n();

const emit = defineEmits(["close", "submit"]);

const currentLanguage = ref("uz");
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
      currentLanguage.value = "uz";
      values.name_uz = "";
      values.name_ru = "";
      $v.value.$reset();
    }
  }
);

function handleClose(done: () => void) {
  ElMessageBox.confirm(t("before_close_text"), {
    confirmButtonText: t("confirmation"),
    cancelButtonText: t("cancel"),
    type: "warning",
  })
    .then(() => {
      done();
    })
    .catch(() => {});
}

function handleBackClose() {
  ElMessageBox.confirm(t("before_close_text"), {
    confirmButtonText: t("confirmation"),
    cancelButtonText: t("cancel"),
    type: "warning",
  })
    .then(() => {
      addShow.value = false;
    })
    .catch(() => {});
}
</script>

<style scoped>
.mr-3 {
  margin-right: 10px;
}
</style>
