<template>
  <el-dialog
    :title="$t(titleComputed)"
    width="480px"
    v-model="filterShow"
    class="filter-modal"
    :before-close="handleClose"
  >
    <div class="filter-modal__body">
      <TabLanguage v-model="currentLanguage" class="mt-5" />
      <transition
        mode="out-in"
        :name="currentLanguage === 'uz' ? 'language-left' : 'language'"
      >
        <div v-if="currentLanguage === 'uz'">
          <label for="name" class="mb-3">Yordam turi</label>

          <SInput
            v-model="values.support_type_uz"
            :error="$v?.support_type_uz.$error"
            placeholder="Nomini kiriting"
            type="text"
          />
        </div>
        <div v-else>
          <label for="name" class="mb-3">Тип поддержки</label>

          <SInput
            v-model="values.support_type_ru"
            :error="$v?.support_type_ru.$error"
            placeholder="Введите имя"
            type="text"
          />
        </div>
      </transition>
    </div>
    <div class="d-flex align-items-center justify-content-end gap-4 mt-7">
      <SButton
        class="w-50"
        variant="secondary"
        :text="$t('cancel')"
        @click="handleBackClose"
      />
      <SButton
        v-bind="{ loading }"
        class="w-50"
        :text="reset ? $t('restart') : $t('save')"
        @click="submitForm"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import { computed, ref, unref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { TForm } from "@/composables/useForm";
import SButton from "@/stories/Common/Button/SButton.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import TabLanguage from "@/stories/Form/TabLanguage.vue";

interface Props {
  show?: boolean;
  edit?: boolean;
  add?: boolean;
  reset?: boolean;
  form?: TForm<any>;
  support_type?: { title: string; id: number }[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits(["close", "submit"]);

const { form } = unref(props);
const { values, $v } = form;
const { t } = useI18n();

const filterShow = ref(false);
const currentLanguage = ref("uz");

const submitForm = () => {
  $v.value.$touch();
  if (values.support_type_uz) {
    currentLanguage.value = "ru";
  }
  if (values.support_type_ru) {
    currentLanguage.value = "uz";
  }
  if (!$v.value.$invalid) {
    emit("submit");
  }
};

const titleComputed = computed(() => {
  if (props.add) {
    return "add_support_type";
  } else if (props.edit) {
    return "edit_support_type";
  } else {
    return "menus.reset_responsible_person";
  }
});

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
      filterShow.value = false;
    })
    .catch(() => {});
}
</script>

<style lang="scss" scoped>
.filter-modal {
  &__body {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }

  .el-dialog__body {
    padding: 24px !important;
  }

  &__item {
    label {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: #191e36;
      opacity: 0.7;
      margin-bottom: 12px;
    }
  }
}
</style>
