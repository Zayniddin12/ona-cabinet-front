<template>
  <el-dialog
    :title="$t(titleComputed)"
    width="480px"
    v-model="filterShow"
    class="filter-modal overflow-hidden"
    :before-close="handleClose"
  >
    <TabLanguage v-model="currentLanguage" />
    <Transition
      mode="out-in"
      :name="currentLanguage === 'uz' ? 'language-left' : 'language'"
    >
      <div v-if="currentLanguage === 'uz'">
        <div class="filter-modal__item">
          <label for="name">Dastur nomi</label>
          <SInput
            v-model="values.name_uz"
            :error="$v?.name_uz.$error"
            placeholder="Dastur nomini kiriting"
            maxlength="100"
          />
        </div>
        <div class="filter-modal__item">
          <div class="d-flex align-items-center justify-content-between">
            <label for="name"> Tavsif </label>
            <p class="description__count">
              {{ values.description_uz?.length }}/2500
            </p>
          </div>
          <STextArea
            v-model="values.description_uz"
            :error="$v?.description_uz.$error"
            placeholder="Dastur tavfsifini kiriting"
            maxlength="2500"
          />
        </div>
        <div class="filter-modal__item">
          <label for="name"> Kod </label>

          <SInput
            v-model="values.code"
            :error="$v?.code.$error"
            maska="AA-##/###"
            placeholder="Kodni kiriting"
          />
        </div>
        <div class="filter-modal__item">
          <label for="name"> Tartib raqami </label>

          <SInput
            v-model="values.order_number"
            :error="$v?.order_number.$error"
            placeholder="Tartib raqamni kiriting"
            maska="##########"
          />
        </div>
      </div>
      <div v-else>
        <div class="filter-modal__item">
          <label for="name"> Название программы </label>
          <SInput
            v-model="values.name_ru"
            :error="$v?.name_ru.$error"
            placeholder="Введите название программы"
            maxlength="100"
          />
        </div>
        <div class="filter-modal__item">
          <div class="d-flex align-items-center justify-content-between">
            <label for="name"> Описание </label>
            <p class="description__count">
              {{ values.description_ru?.length }}/2500
            </p>
          </div>
          <STextArea
            v-model="values.description_ru"
            :error="$v?.description_ru.$error"
            placeholder="Введите описание программы"
            maxlength="2500"
          />
        </div>
        <div class="filter-modal__item">
          <label for="name"> Код </label>

          <SInput
            v-model="values.code"
            :error="$v?.code.$error"
            placeholder="Введите код"
            maska="AA-##/###"
          />
        </div>
        <div class="filter-modal__item">
          <label for="name"> Порядковый номер </label>

          <SInput
            v-model="values.order_number"
            :error="$v?.order_number.$error"
            placeholder="Введите порядковый номер"
            maska="#######"
          />
        </div>
      </div>
    </Transition>

    <div class="d-flex align-items-center justify-content-end gap-4 mt-7">
      <SButton
        class="w-50"
        variant="secondary"
        :text="$t('cancel')"
        @click="handleBackClose"
      />
      <SButton class="w-50" :text="$t('save')" @click="submitForm" />
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
import STextArea from "@/stories/Form/TextArea/STextArea.vue";

interface Props {
  show?: boolean;
  edit?: boolean;
  add?: boolean;
  data?: object;

  form?: TForm<any>;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["close", "submit"]);

const { form } = unref(props);
const { values, $v } = form;
const { t } = useI18n();

const currentLanguage = ref("uz");
const filterShow = ref(false);

const submitForm = () => {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    emit("submit");
  } else {
    if (
      $v.value.name_uz.$error ||
      ($v.value.description_uz.$error && !$v.value.name_ru.$error) ||
      !$v.value.description_ru.$error
    ) {
      currentLanguage.value = "uz";
    } else if (
      $v.value.name_ru.$error ||
      ($v.value.description_ru.$error && !$v.value.name_uz.$error) ||
      !$v.value.description_uz.$error
    ) {
      currentLanguage.value = "ru";
    }
  }
};

const titleComputed = computed(() => {
  if (props.add) {
    return "program_add";
  } else {
    return "program_edit";
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

.description__count {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #a2abbe;
}
</style>
