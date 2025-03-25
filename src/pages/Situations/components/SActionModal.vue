<template>
  <el-dialog
    :title="add ? $t('add_situation') : $t('edit_situation')"
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
        <SFormGroup label="Interfeysdagi joylashuv">
          <el-select
            :class="{ error: $v.place.$error }"
            v-model="values.place"
            placeholder="Joylashuvni tanlang"
          >
            <el-option
              v-for="(item, index) in placeList"
              :key="index"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </SFormGroup>
        <SFormGroup label="Tanlov turi">
          <el-select
            :class="{ error: $v.selection_type.$error }"
            v-model="values.selection_type"
            placeholder="Tanlov turini tanlang"
          >
            <el-option
              v-for="item in options_uz"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <SFormGroup label="Место расположения на экране">
          <el-select
            :class="{ error: $v.place.$error }"
            v-model="values.place"
            placeholder="Выберите место"
          >
            <el-option
              v-for="(item, index) in placeListRu"
              :key="index"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </SFormGroup>
        <SFormGroup label="Тип выбора">
          <el-select
            :class="{ error: $v.selection_type.$error }"
            v-model="values.selection_type"
            placeholder="Выберите тип выбора"
          >
            <el-option
              v-for="item in options_ru"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
  options_uz?: Array<any>;
  options_ru?: Array<any>;
  placeList?: Array<any>;
  placeListRu?: Array<any>;
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
  () => addShow.value,
  () => {
    if (!addShow.value) {
      emit("close");
      currentLanguage.value = "uz";
      values.title_uz = "";
      values.title_ru = "";
      values.place = "";
      values.selection_type = "";
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
