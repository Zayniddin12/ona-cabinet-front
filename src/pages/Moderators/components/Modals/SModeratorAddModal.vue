<template>
  <ElDialog
    :title="$t(isEdit ? 'edit_moderator' : 'add_moderator')"
    width="30%"
    v-model="showModal"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <form
      class="d-flex gap-6 flex-column"
      @submit.prevent="submit"
      :key="showModal"
      novalidate
    >
      <SFormGroup :label="$t('login')">
        <SInput
          v-model="form.values.username"
          :error="form.$v.value.username.$error"
          :placeholder="$t('enter_login')"
        />
      </SFormGroup>
      <SFormGroup :label="$t('email')">
        <SInput
          v-model="form.values.email"
          type="email"
          :error="form.$v.value.email.$error"
          placeholder="example@gmail.com"
        />
      </SFormGroup>
      <SFormGroup :label="$t('fish')">
        <SInput
          v-model="form.values.name"
          :error="form.$v.value.name.$error"
          :placeholder="$t('enter_full_name')"
        />
      </SFormGroup>
      <SFormGroup v-if="isEdit" :label="$t('user_type')">
        <ElSelect
          :class="{ error: form.$v.value.type.$error }"
          v-model="form.values.type"
          :placeholder="$t('choose_user_type')"
          :disabled="
            isMe ||
            (form.values.type === 'superadmin' &&
              users?.type === 'admin' &&
              isEdit)
          "
        >
          <ElOption
            v-for="item in roleSuperAdminOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :class="
              isMe ||
              (item.value !== 'superadmin' &&
                users?.type === 'admin' &&
                isEdit) ||
              users?.type === 'superadmin'
                ? ''
                : 'pointer-events-none'
            "
          />
        </ElSelect>
      </SFormGroup>
      <SFormGroup v-else :label="$t('user_type')">
        <ElSelect
          :class="{ error: form.$v.value.type.$error }"
          v-model="form.values.type"
          :placeholder="$t('choose_user_type')"
          :disabled="
            isMe ||
            (form.values.type === 'superadmin' &&
              users?.type === 'admin' &&
              isEdit)
          "
        >
          <ElOption
            v-for="item in users?.type === 'superadmin'
              ? roleSuperAdminOptions
              : roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </SFormGroup>
      <SFormGroup v-if="!isEdit || isMe" :label="$t('password')">
        <SInput
          v-model="form.values.password"
          :error="form.$v.value.password.$error"
          :placeholder="$t('enter_password')"
          :type="hidePassword ? 'text' : 'password'"
        >
          <template #suffix>
            <EyeToggle
              :type-password="!hidePassword"
              @click="hidePassword = !hidePassword"
            />
          </template>
        </SInput>
      </SFormGroup>
      <SFormGroup v-if="!isEdit || isMe" :label="$t('confirm_password')">
        <SInput
          v-model="form.values.repeatPassword"
          :error="form.$v.value.repeatPassword.$error"
          :placeholder="$t('confirm_password')"
          :type="hidePassword ? 'text' : 'password'"
        >
          <template #suffix>
            <EyeToggle
              :type-password="!hidePassword"
              @click="hidePassword = !hidePassword"
            />
          </template>
        </SInput>
      </SFormGroup>

      <div class="d-flex align-items-center gap-5 mt-7">
        <SButton
          class="w-100"
          variant="secondary"
          :text="$t('cancel')"
          @click="handleBackClose"
        />
        <SButton
          type="submit"
          class="w-100"
          :text="isEdit ? $t('save') : $t('add')"
          :loading="addLoading"
        />
      </div>
    </form>
  </ElDialog>
</template>

<script setup lang="ts">
import { email, required } from "@vuelidate/validators";
import { ElMessageBox } from "element-plus";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

import { useForm } from "@/composables/useForm";
import ApiService from "@/core/services/ApiService";
import { handleError } from "@/helpers";
import {
  roleOptions,
  roleSuperAdminOptions,
} from "@/pages/Moderators/components/data";
import SButton from "@/stories/Common/Button/SButton.vue";
import EyeToggle from "@/stories/Common/EyeToggle/EyeToggle.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import { IModerator, IModeratorAdd } from "@/types/moderators";

interface Props {
  show?: boolean;
  isEdit?: boolean;
  defaultData?: IModerator;
  isMe?: boolean;
  users?: any;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "update"]);

const toast = useToast();
const { t } = useI18n();

const formInitialValue = {
  username: "",
  email: "",
  name: "",
  type: "",
  password: "",
  repeatPassword: "",
};

const addRules = computed(() => {
  return {
    username: { required },
    email: { required, email },
    name: { required },
    type: { required },
    password: props.isEdit && !props.isMe ? {} : { required },
    repeatPassword:
      props.isEdit && !props.isMe
        ? {}
        : {
            required,
            sameAs(value: any) {
              return value === form.values.password;
            },
          },
  };
});

const form = useForm<IModeratorAdd>(
  {
    ...formInitialValue,
  },
  addRules.value
);

const showModal = ref(false);
const hidePassword = ref(false);

watch(
  () => props.show,
  (newValue) => (showModal.value = newValue),
  {
    immediate: true,
  }
);

watch(
  () => showModal.value,
  (newValue) => {
    Object.assign(
      form,
      useForm<IModeratorAdd>(
        {
          ...formInitialValue,
        },
        addRules.value
      )
    );
    if (!newValue) {
      emit("close");
      form.$v.value.$reset();
    } else {
      if (props.isEdit) {
        form.values.username = props.defaultData?.username;
        form.values.email = props.defaultData?.email;
        form.values.name = props.defaultData?.first_name;
        form.values.type = props.defaultData?.type;
      }
    }
  }
);

const addLoading = ref(false);

function submit() {
  form.$v.value.$touch();

  if (form.$v.value.$invalid) {
    return;
  }

  addLoading.value = true;

  if (props.isEdit) {
    editModerator();
  } else {
    addModerator();
  }
}

function addModerator() {
  const data = {
    ...form.values,
    first_name: form.values.name,
  };

  ApiService.post("/api/v2/main/ModeratorCreate", data)
    .then(() => {
      toast.success(t("successfully_added"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      emit("update");
      emit("close");
    })
    .catch(({ response }) => handleError(response?.data))
    .finally(() => (addLoading.value = false));
}

function editModerator() {
  let data: any = {
    username: form.values.username,
    email: form.values.email,
    first_name: form.values.name,
    type: form.values.type,
  };

  let dataMe: any = {
    username: form.values.username,
    email: form.values.email,
    first_name: form.values.name,
    type: form.values.type,
    repeatPassword: form.values.repeatPassword,
    password: form.values.password,
  };

  ApiService.patch(
    `/api/v2/main/ModeratorUpdate/${props.defaultData?.id}`,
    props.isMe ? dataMe : data
  )
    .then(() => {
      toast.success(t("successfully_updated"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      emit("update");
      emit("close");
    })
    .catch(({ response }) => handleError(response?.data))
    .finally(() => (addLoading.value = false));
}

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
      emit("close");
    })
    .catch(() => {});
}
</script>

<style>
.pointer-events-none {
  pointer-events: none;
}
</style>
