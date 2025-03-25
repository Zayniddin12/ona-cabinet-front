<template>
  <div class="i-partner-add bg-white rounded-4">
    <!--    <pre style="color: black">{{ form }}</pre>-->
    <div class="i-partner-add__header border-b">
      <h1 class="title">{{ $t("add_partner") }}</h1>
      <p class="desc mt-1">{{ $t("add_partner_desc") }}</p>
    </div>

    <div class="p-6">
      <SFormGroup :label="$t('logo')">
        <ImageUpload @upload="handleImage" />
      </SFormGroup>

      <div class="d-flex align-items-center gap-6 mt-6">
        <SFormGroup :label="$t('title')">
          <SInput
            maxlength="99"
            v-model="form.title"
            :error="$v.title.$error"
            :placeholder="$t('write_title')"
          />
        </SFormGroup>
        <SSelectSearchable
          :list="options"
          :placeholder="$t('choose_category')"
          valueKey="value"
          v-model="form.category"
          :error="$v.category.$error"
          label-key="label"
          :label="$t('category')"
        />
      </div>
      <div class="d-flex align-items-center gap-6 mt-6">
        <SFormGroup :label="$t('type_service')">
          <div class="d-flex align-items-center gap-6">
            <div
              @click="form.cashback = !form.cashback"
              class="add-from__toggle w-100 d-flex align-items-center justify-content-between cursor-pointer"
            >
              <p class="add-from__toggle__title">
                {{ $t("cashback") }}
              </p>
              <el-switch
                v-model="form.cashback"
                style="
                  --el-switch-on-color: #7dba28;
                  --el-switch-off-color: #d0d2d0;
                "
              />
            </div>
            <div
              @click="form.discounts = !form.discounts"
              class="add-from__toggle w-100 d-flex align-items-center justify-content-between cursor-pointer"
            >
              <p class="add-from__toggle__title">{{ $t("discounts") }}</p>
              <el-switch
                v-model="form.discounts"
                style="
                  --el-switch-on-color: #7dba28;
                  --el-switch-off-color: #d0d2d0;
                "
              />
            </div>
          </div>
        </SFormGroup>
        <SFormGroup :label="$t('voucher')">
          <div
            @click="form.voucher = !form.voucher"
            class="add-from__toggle w-100 d-flex align-items-center justify-content-between cursor-pointer"
          >
            <p class="add-from__toggle__title">{{ $t("discounts") }}</p>
            <el-switch
              v-model="form.voucher"
              style="
                --el-switch-on-color: #7dba28;
                --el-switch-off-color: #d0d2d0;
              "
            />
          </div>
        </SFormGroup>
      </div>
      <div class="d-flex align-items-center gap-6 mt-6">
        <SFormGroup :label="$t('menus.responsible_people')">
          <SInput
            maxlength="99"
            :error="$v.responsible_person.$error"
            v-model="form.responsible_person"
            :placeholder="$t('write_full_name')"
          />
        </SFormGroup>
        <SFormGroup :label="$t('phone_number')">
          <SInput
            maxlength="99"
            :error="$v.number.$error"
            v-model="form.number"
            placeholder="__ ___-__-__"
            v-maska="'## ### ## ##'"
          >
            <template #prefix>
              <div class="prefix-custom">+998</div>
            </template>
          </SInput>
        </SFormGroup>
      </div>
      <div class="d-flex align-items-center gap-6 mt-6">
        <SFormGroup :label="$t('email')">
          <SInput
            maxlength="99"
            v-model="form.email"
            :error="$v.email.$error"
            :placeholder="$t('example@partner.com')"
          />
        </SFormGroup>
        <SFormGroup :label="$t('web_site')">
          <SInput
            :error="$v.site.$error"
            maxlength="99"
            v-model="form.site"
            :placeholder="$t('www.partner.uz')"
          />
        </SFormGroup>
      </div>
      <div class="row mt-6">
        <SFormGroup class="col" :label="$t('about_partner')">
          <textarea
            maxlength="400"
            v-model="form.about_partner"
            class="textarea"
            :class="$v.about_partner.$error ? 'error' : ''"
            :placeholder="$t('write_about_partner')"
          />
        </SFormGroup>
        <div class="col"></div>
      </div>

      <div class="add-form__footer">
        <SButton :text="$t('cancel')" variant="light" />
        <SButton :text="$t('save')" @click="submit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

import { isPhone } from "@/helpers";
import SButton from "@/stories/Common/Button/SButton.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import ImageUpload from "@/stories/Form/ImageUpload/ImageUpload.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import SSelectSearchable from "@/stories/Form/SelectSearchable/SSelectSearchable.vue";

const toast = useToast();
const { t } = useI18n();

const options = reactive([
  {
    value: "1",
    label: "Option1",
  },
  {
    value: "2",
    label: "Option2",
  },
  {
    value: "3",
    label: "Option3",
  },
  {
    value: "4",
    label: "Option4",
  },
  {
    value: "5",
    label: "Option5",
  },
]);

const checkHttps = () => {
  const reguarExp = new RegExp(
    "[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)"
  );

  return reguarExp.test(form.site);
};

const form = reactive({
  title: "",
  responsible_person: "",
  email: "",
  site: "",
  number: "",
  about_partner: "",
  file: undefined,
  category: "",
  cashback: false,
  discounts: false,
  voucher: false,
});

//Image Handle

function handleImage(e: any) {
  form.file = e.file;
}

const rules = reactive({
  title: {
    required,
  },
  email: {
    required,
    email,
  },
  number: {
    required,
    isPhone,
  },
  responsible_person: {
    required,
  },
  about_partner: {
    required,
  },
  category: {
    required,
  },
  site: {
    checkHttps,
  },
});

const $v = useVuelidate(rules, form);

function submit() {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    toast.success(t("successfully_added"), {
      icon: {
        iconClass: "done-icon",
        iconTag: "div",
      },
    });
  } else {
    toast.error("error", {
      icon: {
        iconClass: "error-icon",
        iconTag: "div",
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.i-partner-add {
  &__header {
    padding: 24px 0 20px 0;
    margin-left: 24px;
  }
}

.add-from__toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f7faf8;
  border-radius: 8px;
  padding: 6px 12px;

  &__title {
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #353d35;
  }
}

.add-form__footer {
  margin-top: 28px;
  display: flex;
  align-items: end;
  justify-content: end;
  gap: 16px;
}
</style>
