<template>
  <div class="main overflow-hidden">
    <h3 class="title">{{ $t("add_new") }}</h3>
    <p class="subtitle">{{ $t("add_info") }}</p>
    <TabLanguage v-model="currentLanguage" class="mt-5" />
    <transition
      mode="out-in"
      :name="currentLanguage === 'uz' ? 'language-left' : 'language'"
    >
      <div class="mt-5" v-if="currentLanguage === 'uz'">
        <div class="d-flex align-items-center gap-5">
          <div class="w-100">
            <label class="label">{{ $t("participant") }}</label>
            <SRemoteSearch
              v-model="values.participant"
              label-key="full_name"
              :error="form?.$v?.value?.participant?.$error"
              :placeholder="$t('choose_user')"
              :options="userList"
              :default-value="values.participant"
              @fetch-data="emit('fetch-data')"
              observe
              @on-search="(e) => (search = e)"
            />
          </div>
          <div class="w-100">
            <label class="label">{{ $t("amount_money") }}</label>
            <SInput
              v-model="values.sum"
              :error="form?.$v?.value?.sum?.$error"
              v-maska="moneyMask()"
              maxlength="11"
              :placeholder="$t('amount_enter_money')"
            ></SInput>
          </div>
        </div>

        <div class="d-flex gap-5 mt-5">
          <div class="w-100">
            <label class="label">{{ $t("akt_date") }}</label>
            <div>
              <el-date-picker
                class="date-picker w-100"
                v-model="values.akt_date"
                :class="{ error: form?.$v?.value?.akt_date?.$error }"
                type="date"
                format="DD.MM.YYYY"
                placeholder="kk.oo.yyyy"
              />
            </div>
          </div>

          <div class="w-100">
            <label class="label">{{ $t("akt_ID") }}</label>
            <SInput
              v-bind="{ type: 'number' }"
              v-model="values.akt_number"
              :error="form?.$v?.value?.akt_number?.$error"
              :placeholder="$t('enter_akt_id')"
            ></SInput>
          </div>
        </div>
        <div class="w-100 mt-5">
          <p>{{ $t("help_things") }}</p>
          <CKEditor5
            class="mt-3"
            v-model="form.values.given_accessories_uz"
            :error="form?.$v?.value?.given_accessories_uz?.$error"
          />
        </div>
        <div class="w-100 mt-5">
          <p>Tavsif</p>
          <CKEditor5
            class="mt-3"
            v-model="form.values.description_uz"
            :error="form?.$v?.value?.description_uz?.$error"
          />
        </div>
      </div>
      <div class="mt-5" v-else>
        <div class="d-flex align-items-center gap-5">
          <div class="w-100">
            <label class="label">{{ $t("user") }}</label>
            <SRemoteSearch
              v-model="values.participant"
              label-key="full_name"
              :error="form?.$v?.value?.participant?.$error"
              :placeholder="$t('choose_user')"
              :options="userList"
              :default-value="values.participant"
              @fetch-data="emit('fetch-data')"
              observe
              @on-search="(e) => (search = e)"
            />
          </div>

          <div class="w-100">
            <label class="label">{{ $t("amount_money") }}</label>
            <SInput
              v-model="values.sum"
              :error="form?.$v?.value?.sum?.$error"
              v-maska="moneyMask()"
              :placeholder="$t('enter_amount_sum')"
            ></SInput>
          </div>
        </div>
        <div class="d-flex gap-5 mt-5">
          <div class="w-100">
            <label class="label">{{ $t("created_akt") }}</label>
            <div>
              <el-date-picker
                class="date-picker w-100"
                v-model="values.akt_date"
                :class="{ error: form?.$v?.value?.akt_date?.$error }"
                type="date"
                format="DD.MM.YYYY"
                :placeholder="$t('kk_mm_yyyy')"
              />
            </div>
          </div>

          <div class="w-100">
            <label class="label">{{ $t("akt_count") }}</label>
            <SInput
              v-bind="{ type: 'number' }"
              v-model="values.akt_number"
              :error="form?.$v?.value?.akt_number?.$error"
              :placeholder="$t('created_akt')"
            ></SInput>
          </div>
        </div>
        <div class="w-100 mt-5">
          <p>{{ $t("donated_items") }}</p>
          <CKEditor5
            :key="currentLanguage"
            class="mt-3"
            v-model="values.given_accessories_ru"
            :error="form?.$v?.value?.given_accessories_ru?.$error"
          />
        </div>
        <div class="w-100 mt-5">
          <p>{{ $t("definition") }}</p>
          <CKEditor5
            :key="currentLanguage"
            class="mt-3"
            v-model="values.description_ru"
            :error="form?.$v?.value?.description_ru?.$error"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, watch } from "vue";

import { TForm } from "@/composables/useForm";
import { moneyMask } from "@/helpers";
import CKEditor5 from "@/pages/Financial/components/CKEditor5.vue";
import SInput from "@/stories/Form/Input/SInput.vue";
import SRemoteSearch from "@/stories/Form/SRemoteSearch.vue";
import TabLanguage from "@/stories/Form/TabLanguage.vue";

interface Props {
  form?: TForm<any>;
  userList?: Array<[]>;
}

const currentLanguage = ref("uz");
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["fetchData", "fetchSearchData"]);
const { form } = unref(props);
const { values, $v } = form;

function submit() {
  if (
    $v.value.description_uz.$error ||
    ($v.value.given_accessories_uz.$error && !$v.value.description_ru.$error) ||
    !$v.value.given_accessories_ru.$error
  ) {
    currentLanguage.value = "uz";
  } else if (
    $v.value.description_ru.$error ||
    ($v.value.given_accessories_ru.$error && !$v.value.description_uz.$error) ||
    !$v.value.given_accessories_uz.$error
  ) {
    currentLanguage.value = "ru";
  }
}

defineExpose({ submit });

const search = ref("");

watch(
  () => search.value,
  (val) => {
    emit("fetchSearchData", String(val));
  }
);
</script>

<style scoped>
.main {
  background: #ffffff;
  border: 1px solid #e5eaee;
  border-radius: 12px;
  padding: 24px;
}

.title {
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: #1c1f20;
}

.subtitle {
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #a2abbe;
  padding-bottom: 16px;
  margin-top: 8px;
  border-bottom: 3px solid #eff2f5;
  border-radius: 3px;
}

.label {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #191e36;
  margin-bottom: 12px;
  opacity: 0.7;
}

.date-picker {
  width: 100%;
  background: #f3f6f9;
  border-radius: 6px;
}
</style>
