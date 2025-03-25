<template>
  <el-dialog :title="$t('add_temporary_person')" width="30%" v-model="addShow">
    <div class="d-flex gap-6 flex-column">
      <SFormGroup :label="$t('menus.responsible_people')">
        <SRemoteSearch
          v-model="form.values.person"
          id="moderator"
          label-key="first_name"
          value-key="id"
          inner-user
          :error="form.$v.value.person.$error"
          :placeholder="$t('choose_temporary_person')"
          :options="tempResponsiblePersons"
          :default-value="form.values.person"
          observe
          @on-search="$emit('search', $event)"
          @fetch-data="$emit('fetch-more')"
        />
      </SFormGroup>
      <div class="info-person">
        <i18n-t tag="p" class="info-person__text" keypath="responsible_text">
          <template #span>
            <span>{{ $t("responsible_text_link") }}</span>
          </template>
        </i18n-t>
      </div>
    </div>
    <div class="d-flex align-items-center gap-5 mt-7">
      <SButton
        class="w-100"
        variant="secondary"
        :text="$t('cancel')"
        @click="$emit('close')"
      />
      <SButton
        class="w-100"
        :text="$t('add')"
        @click="submit"
        v-bind="{ loading }"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import { ref, watch } from "vue";

import { useForm } from "@/composables/useForm";
import SButton from "@/stories/Common/Button/SButton.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";
import SRemoteSearch from "@/stories/Form/SRemoteSearch.vue";

interface Props {
  show?: boolean;
  loading?: boolean;
  tempResponsiblePersons?: Array<any>;
}

const props = withDefaults(defineProps<Props>(), {});

const form = useForm(
  {
    person: "",
  },
  {
    person: {
      required,
    },
  }
);

const emit = defineEmits(["close", "submit"]);

const addShow = ref(false);

function submit() {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    emit("submit", form.values.person);
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
      form.values.person = "";
      form.$v.value.$reset();
    }
  }
);
</script>

<style lang="scss" scoped>
.mr-3 {
  margin-right: 10px;
}

.info-person {
  background: #f3f6f9;
  border-radius: 8px;
  padding: 15px 16px;

  &__text {
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
    color: #a2abbe;
  }

  span {
    color: #1c1f20;
  }
}
</style>
