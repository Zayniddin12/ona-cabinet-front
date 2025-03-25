<template>
  <el-dialog :title="$t('change_password')" width="30%" v-model="showModal">
    <form class="d-flex gap-6 flex-column" @submit.prevent="submit">
      <SFormGroup :label="$t('password')">
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
      <SFormGroup :label="$t('confirm_password')">
        <SInput
          v-model="form.values.repeatPassword"
          :error="form.$v.value.repeatPassword.$error"
          :placeholder="$t('confirm_password_enter')"
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
          @click="$emit('close')"
        />
        <SButton
          v-bind="{ loading }"
          type="submit"
          class="w-100"
          :text="$t('save')"
        />
      </div>
    </form>
  </el-dialog>
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

import { useForm } from "@/composables/useForm";
import ApiService from "@/core/services/ApiService";
import { handleError } from "@/helpers";
import SButton from "@/stories/Common/Button/SButton.vue";
import EyeToggle from "@/stories/Common/EyeToggle/EyeToggle.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import SInput from "@/stories/Form/Input/SInput.vue";

interface Props {
  show?: boolean;
  moderatorId: number;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["close"]);

const toast = useToast();
const { t } = useI18n();

const hidePassword = ref(false);

const form = useForm(
  {
    password: "",
    repeatPassword: "",
  },
  {
    password: {
      required,
    },
    repeatPassword: {
      required,
      sameAs(value: any) {
        return value === form.values.password;
      },
    },
  }
);

const showModal = ref(false);
const loading = ref(false);

function submit() {
  form.$v.value.$touch();
  if (form.$v.value.$invalid) {
    return;
  }

  loading.value = true;

  const data = {
    password: form.values.password,
  };

  ApiService.patch(`/api/v2/main/ModeratorUpdate/${props.moderatorId}`, data)
    .then(() => {
      toast.success(t("successfully_updated"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      emit("close");
    })
    .catch(({ response }) => {
      handleError(response?.data);
    })
    .finally(() => (loading.value = false));
}

watch(
  () => props.show,
  () => {
    showModal.value = props.show;
  },
  {
    immediate: true,
  }
);

watch(
  () => showModal.value,
  () => {
    if (!showModal.value) {
      emit("close");
      form.values.password = "";
      form.values.repeatPassword = "";
      form.$v.value.$reset();
    }
  }
);
</script>
