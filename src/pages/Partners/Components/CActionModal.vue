<template>
  <el-dialog
    :title="type === 'add ' ? $t('add_partner') : $t('edit_partner')"
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
      <div v-if="currentLanguage === 'uz'" class="filter-modal__body">
        <div>
          <label for="name"> Hamkor nomi </label>
          <SInput
            v-model="values.name_uz"
            :error="$v?.name_uz.$error"
            :placeholder="$t('enter_name')"
            maxlength="100"
          ></SInput>
        </div>
        <div class="d-flex align-items-center gap-3">
          <div>
            <label for="name">Hamkor ID si </label>

            <SInput
              v-model="values.partner_id"
              :error="$v?.partner_id.$error"
              placeholder="ID ni kiriting"
              maska="AA-##/###"
            ></SInput>
          </div>
          <div>
            <label for="name"> Hamkor turi </label>

            <el-select
              v-model="values.type"
              :class="$v?.type.$error && 'error-select'"
              id="name"
              placeholder="Turini tanlang"
            >
              <el-option
                v-for="item in partnerTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <div>
          <label for="name"> Telefon raqami </label>

          <SInput
            v-model="values.phone"
            :error="$v?.phone.$error"
            placeholder="00 000-00-00"
            type="phone"
            class="phone_input"
            prefixClass="phone_prefix"
          >
            <template #prefix> +998</template>
          </SInput>
        </div>
        <div>
          <label for="name"> Yordam miqdori</label>

          <SInput
            v-model="values.amount"
            placeholder="Yordam miqdorini kiriting"
            :error="$v?.amount.$error"
            v-maska="moneyMask()"
          ></SInput>
        </div>
        <div>
          <label for="name"> Viloyat </label>

          <el-select
            v-model="values.region"
            :class="$v?.type.$error && 'error-select'"
            id="name"
            placeholder="Viloyatni tanlang"
          >
            <el-option
              v-for="item in regions"
              :key="item.id"
              :label="item.title"
              :value="item.code"
            />
          </el-select>
        </div>
      </div>
      <div v-else class="filter-modal__body">
        <div>
          <label for="name"> Название партнера </label>
          <SInput
            v-model="values.name_ru"
            :error="$v?.name_ru.$error"
            placeholder="Введите название"
            maxlength="100"
          ></SInput>
        </div>
        <div class="d-flex align-items-center gap-3">
          <div>
            <label for="name"> ID партнера</label>

            <SInput
              v-model="values.partner_id"
              :error="$v?.partner_id.$error"
              placeholder="Введите ID"
              maska="AA-##/###"
            ></SInput>
          </div>
          <div clas>
            <label for="name"> Тип партнера </label>

            <el-select
              v-model="values.type"
              :class="$v?.type.$error && 'error-select'"
              id="name"
              placeholder="Выберите тип"
            >
              <el-option
                v-for="item in partnerTypeListRu"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <div>
          <label for="name"> Номер телефона </label>

          <SInput
            v-model="values.phone"
            :error="$v?.phone.$error"
            placeholder="00 000-00-00"
            type="phone"
            class="phone_input"
            prefixClass="phone_prefix"
          >
            <template #prefix> +998</template>
          </SInput>
        </div>
        <div>
          <label for="name"> Сумма помощи </label>

          <SInput
            v-model="values.amount"
            placeholder="Введите сумму помощи"
            :error="$v?.amount.$error"
            v-maska="moneyMask()"
          ></SInput>
        </div>
        <div>
          <label for="name"> Регион </label>

          <el-select
            v-model="values.region"
            :class="$v?.type.$error && 'error-select'"
            id="name"
            placeholder="Выберите регион"
          >
            <el-option
              v-for="item in regions"
              :key="item.id"
              :label="item.title"
              :value="item.code"
            />
          </el-select>
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
import { ref, unref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { TForm } from "@/composables/useForm";
import { moneyMask } from "@/helpers";
import SButton from "@/stories/Common/Button/SButton.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import TabLanguage from "@/stories/Form/TabLanguage.vue";

interface Props {
  show?: boolean;
  form?: TForm<any>;
  type?: string;
  regions?: { code: number; id: number; title: string }[];
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["close", "submit"]);

const { t } = useI18n();
const { form } = unref(props);
const { values, $v } = form;
const filterShow = ref(false);
const currentLanguage = ref("uz");
const partnerTypeList = [
  {
    value: "jismoniy",
    label: "Jismoniy shaxs",
  },
  {
    value: "yuridik",
    label: "Yuridik shaxs",
  },
];

const partnerTypeListRu = [
  {
    value: "jismoniy",
    label: "Физическое лицо",
  },
  {
    value: "yuridik",
    label: "Юридическое лицо",
  },
];

const submitForm = () => {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    emit("submit");
  } else {
    if ($v.value.name_uz.$error && !$v.value.name_ru.$error) {
      currentLanguage.value = "uz";
    } else if ($v.value.name_ru.$error && !$v.value.name_uz.$error) {
      currentLanguage.value = "ru";
    }
  }
};

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
      currentLanguage.value = "uz";
      values.name_uz = "";
      values.name_ru = "";
      values.type = null;
      values.id = null;
      values.partner_id = null;
      values.phone = "";
      values.amount = null;
      values.region = null;
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
