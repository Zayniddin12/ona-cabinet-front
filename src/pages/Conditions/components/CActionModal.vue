<template>
  <el-dialog
    :title="add ? $t('add_condition') : $t('edit_condition')"
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
        <SFormGroup label="Sarlavha">
          <SInput
            v-model="values.title_uz"
            :error="$v.title_uz.$error"
            placeholder="Sarlavhani kiriting"
          />
        </SFormGroup>
        <SFormGroup label="Turi">
          <el-select
            :class="{ error: $v.type.$error }"
            v-model="values.type"
            placeholder="Shart turini tanlang"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </SFormGroup>
        <SFormGroup label="Ijtimoiy ball">
          <SInput
            v-model="values.point"
            :error="$v.point.$error"
            :maska="{
              mask: 'D##',
              tokens: {
                D: { pattern: /[1-9]/ },
              },
            }"
            placeholder="Ijtimoiy ballni kiriting"
            suffix-class="me-1"
          >
            <template #suffix>
              <div class="input-suffix">{{ $t("max") }}:100</div>
            </template>
          </SInput>
        </SFormGroup>
      </div>
      <div v-else class="d-flex gap-6 flex-column">
        <SFormGroup label="Заголовок">
          <SInput
            v-model="values.title_ru"
            :error="$v.title_ru.$error"
            placeholder="Введите заголовок"
          />
        </SFormGroup>
        <SFormGroup label="Тип">
          <el-select
            :class="{ error: $v.type.$error }"
            v-model="values.type"
            placeholder="Выберите тип условия"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </SFormGroup>
        <SFormGroup label="Соц. балл">
          <SInput
            v-model="values.point"
            :error="$v.point.$error"
            maska="###"
            placeholder="Выберите соц. балл"
            suffix-class="me-1"
          >
            <template #suffix>
              <div class="input-suffix">{{ $t("max") }}:100</div>
            </template>
          </SInput>
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
  options?: Array<any>;
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
  } else {
    if ($v.value.title_uz.$error && !$v.value.title_ru.$error) {
      currentLanguage.value = "uz";
    } else if ($v.value.title_ru.$error && !$v.value.title_uz.$error) {
      currentLanguage.value = "ru";
    }
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
  () => values.point,
  (newValue) => {
    if (newValue !== "" && (+newValue < 0 || +newValue > 100)) {
      values.point = Math.min(Math.max(+newValue, 0), 100);
    }
  }
);

watch(
  () => addShow.value,
  () => {
    if (!addShow.value) {
      emit("close");
      currentLanguage.value = "uz";
      values.title_uz = "";
      values.title_ru = "";
      values.type = "";
      values.point = "";
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

.input-suffix {
  width: 72px;
  height: 34px;
  background: rgba(162, 171, 190, 0.12);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  text-align: right;
  color: #a2abbe;
}
</style>
