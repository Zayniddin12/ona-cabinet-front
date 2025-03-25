<template>
  <el-dialog
    :title="$t(titleComputed)"
    width="480px"
    v-model="filterShow"
    class="filter-modal"
    :before-close="handleClose"
  >
    <div class="filter-modal__body">
      <div>
        <label for="name"> {{ $t("responsible_person") }} </label>
        <SRemoteSearch
          :default-value="moderators[0].id"
          v-model="values.user"
          id="name"
          label-key="first_name"
          value-key="id"
          :error="$v?.user.$error"
          :placeholder="$t('choose_type')"
          :options="moderators"
          observe
          @on-search="$emit('fetch-search', $event)"
          @fetch-data="$emit('fetch-more')"
        />
      </div>
      <div>
        <label for="name"> {{ $t("menus.contract_type") }} </label>

        <el-select
          v-model="values.contract_type"
          :class="$v?.contract_type.$error && 'error-select'"
          id="name"
          :placeholder="$t('choose_type')"
        >
          <el-option
            v-for="item in contractType"
            :key="item.id"
            :label="$t(item.name)"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="d-flex align-items-center gap-3">
        <div class="w-50">
          <label for="name"> {{ $t("started_date") }} </label>

          <DatePicker
            v-model="values.start_date"
            :error="$v?.start_date.$error"
            :disabled="
              (!useRoleManagement('edit', 'superadmin') && edit) ||
              (!useRoleManagement('edit', 'superadmin') && reset)
            "
            :maxDate="values.end_date"
          />
        </div>
        <div class="w-50">
          <label for="name"> {{ $t("ended_date") }} </label>

          <DatePicker
            v-model="values.end_date"
            :error="$v?.end_date.$error"
            :disabled="
              (!useRoleManagement('edit', 'superadmin') && edit) ||
              (!useRoleManagement('edit', 'superadmin') && reset)
            "
            :minDate="values.start_date"
          />
        </div>
      </div>
      <div>
        <label for="name"> {{ $t("phone_number") }} </label>

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
    </div>
    <div class="d-flex align-items-center justify-content-end gap-4 mt-7">
      <SButton
        class="w-50"
        variant="secondary"
        :text="$t('cancel')"
        @click="handleBackClose"
      />
      <SButton
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

import DatePicker from "@/components/Datepicker/DatePicker.vue";
import { TForm } from "@/composables/useForm";
import useRoleManagement from "@/composables/useRoleManagement";
import SButton from "@/stories/Common/Button/SButton.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import SRemoteSearch from "@/stories/Form/SRemoteSearch.vue";

interface Props {
  show?: boolean;
  edit?: boolean;
  add?: boolean;
  reset?: boolean;
  data?: object;
  moderators?: {
    id: number;
    first_name: string;
  }[];

  form?: TForm<any>;
  contractType?: { name: string; id: number }[];
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits(["close", "submit", "fetch-search", "fetch-more"]);

const { form } = unref(props);
const { values, $v } = form;
const { t } = useI18n();

const filterShow = ref(false);

const submitForm = () => {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    emit("submit");
  }
};

const titleComputed = computed(() => {
  if (props.add) {
    return "menus.add_responsible_person";
  } else if (props.edit) {
    return "menus.edit_responsible_person";
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

// function handleClose(done: () => void) {
//   ElMessageBox.confirm(t("before_close_text"), {
//     confirmButtonText: t("confirmation"),
//     cancelButtonText: t("cancel"),
//     type: "warning",
//   })
//     .then(() => {
//       done();
//     })
//     .catch(() => {});
// }

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
