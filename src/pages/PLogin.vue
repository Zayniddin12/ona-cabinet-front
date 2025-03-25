<template>
  <div>
    <h2 class="auth-title mb-7 text-center">{{ $t("login_to_system") }}</h2>
    <form @submit.prevent>
      <div class="mb-4">
        <label class="mb-2 input-label" for="email">{{ $t("login") }}</label>
        <SInput
          v-model="form.username"
          id="email"
          :error="$v.username.$error || hasError"
          placeholder="enter_login"
        />
      </div>
      <div class="mb-7">
        <label class="mb-2 input-label" for="email">{{ $t("password") }}</label>
        <SInput
          v-model="form.password"
          id="email"
          :error="$v.password.$error || hasError"
          :placeholder="$t('enter_your_password')"
          :type="!typePassword ? 'password' : 'text'"
        >
          <template #suffix>
            <EyeToggle
              @click="typePassword = !typePassword"
              v-bind="{ typePassword }"
            />
          </template>
        </SInput>
      </div>
      <vue-recaptcha
        class="mb-7 mx-auto"
        ref="recaptcha"
        size="100px"
        :sitekey="siteKey"
        @verify="verifyMethod"
        @expired="expiredMethod"
      />
      <s-button
        :disabled="!captchaToken"
        class="w-100"
        @click="onAuth"
        :text="$t('login_to_system')"
        :loading="loading"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { VueRecaptcha } from "vue-recaptcha";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";

import { Actions } from "@/store/enums/StoreEnums";
import SButton from "@/stories/Common/Button/SButton.vue";
import EyeToggle from "@/stories/Common/EyeToggle/EyeToggle.vue";
import SInput from "@/stories/Form/Input/SInput.vue";

const store = useStore();
const router = useRouter();
const typePassword = ref(false);
const siteKey = import.meta.env.VITE_APP_SITE_KEY;
const captchaToken = ref();
const loading = ref(false);
const toast = useToast();
const { t } = useI18n();

interface TForm {
  username: string;
  password: string;
}

function verifyMethod(response: any) {
  captchaToken.value = response;
}

function expiredMethod() {
  captchaToken.value = null;
}

const form = reactive<TForm>({
  username: "",
  password: "",
});

const hasError = ref(false);

const rules = computed(() => ({
  username: {
    required,
  },
  password: {
    required,
  },
}));
const $v = useVuelidate(rules, form);

const onAuth = async () => {
  await store.dispatch(Actions.LOGOUT);

  $v.value.$touch();

  if (!$v.value.$invalid) {
    loading.value = true;
    await store.dispatch(Actions.LOGIN, form).then(() => {
      store.dispatch(Actions.VERIFY_AUTH);
      router
        .push({
          name: "Dashboard",
        })
        .then((res: any) => {
          if (res) {
            toast.error(t("invalid_login"), {
              icon: {
                iconClass: "error-icon",
                iconTag: "div",
              },
            });
          } else {
            toast.success(t("successfully_entered"), {
              icon: {
                iconClass: "done-icon",
                iconTag: "div",
              },
            });
          }
        })
        .finally(() => (loading.value = false));

      const [errorName] = Object.keys(store.getters.getErrors);
      const error = store.getters.getErrors[errorName];
    });
  }
};
</script>

<style lang="scss">
.auth {
  &-title {
    font-family: "SF Pro Text", Roboto, sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 28px;
    line-height: 33px;
    color: #333333;
  }
}

.input-label {
  font-family: "SF Pro Text", Roboto, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  color: #353d35;
}
</style>
