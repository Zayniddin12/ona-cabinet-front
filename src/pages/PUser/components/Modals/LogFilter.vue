<template>
  <ElDialog
    v-bind="{ width }"
    v-model="filterShow"
    :title="$t('filter')"
    class="filter-modal"
  >
    <form :class="bodyClass" @submit.prevent="submit">
      <div class="filter-modal__body">
        <div class="filter-modal__item">
          <label for="name"> {{ $t("responsible_person") }} </label>
          <SRemoteSearch
            v-model="filter.responsiblePerson"
            label-key="name"
            value-key="id"
            :options="responsiblePersons"
            :default-value="filter.responsiblePerson"
            @on-search="(e) => (searchText = e)"
            @fetch-data="fetchMore"
            observe
          />
        </div>
        <div class="filter-modal__item">
          <label for="name"> {{ $t("userTable.change_time") }} </label>

          <DoubleDatePicker
            v-model="filter.time"
            input-class="justify-content-start"
            query-key-from="timestamp_after"
            query-key-to="timestamp_before"
          />
        </div>
      </div>

      <div class="d-flex align-items-center justify-content-end gap-4 mt-6">
        <SButton
          class="w-25"
          :class="{ 'w-100': full }"
          variant="secondary"
          :text="$t('clear')"
          @click="clear"
        />
        <SButton
          type="submit"
          class="w-25"
          :class="{ 'w-100': full }"
          :text="$t('save')"
        />
      </div>
    </form>
  </ElDialog>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed, onMounted, reactive, Ref, ref, watch } from "vue";
import { ReactiveVariable } from "vue/macros";
import { useRoute, useRouter } from "vue-router";

import DoubleDatePicker from "@/components/Datepicker/DoubleDatePicker.vue";
import ApiService from "@/core/services/ApiService";
import { IResponsiblePerson } from "@/pages/PUser/types/participant";
import SButton from "@/stories/Common/Button/SButton.vue";
import SRemoteSearch from "@/stories/Form/SRemoteSearch.vue";
import { ILogFilter } from "@/types/participants";

interface Props {
  show?: boolean;
  filters?: Array<any>;
  width?: string;
  bodyClass?: string;
  full?: boolean;
  wrapperStyle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: "480px",
});

const searchText = ref("");

// ******* EMITS *******
const emit = defineEmits<{
  (e: "close"): void;
  (e: "change", value: any): void;
}>();

const router = useRouter();
const route = useRoute();

const filterShow = ref(false);

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
    } else {
      const routeQuery = route.query;

      filter.responsiblePerson = routeQuery.responsible_person
        ? Number(routeQuery.responsible_person)
        : undefined;

      filter.time.start = routeQuery.timestamp_after
        ? (routeQuery.timestamp_after as string)
        : null;
      filter.time.end = routeQuery.timestamp_before
        ? (routeQuery.timestamp_before as string)
        : null;
    }
  }
);

function clear() {
  router.replace({ path: router.currentRoute.value.path }).then(() => {
    filter.time.start = undefined;
    filter.time.end = undefined;
    filter.responsiblePerson = undefined;

    params.responsible_person = undefined;
    params.timestamp_after = undefined;
    params.timestamp_before = undefined;

    emit("change", {});
  });
}

function submit() {
  params.responsible_person = filter.responsiblePerson;
  params.timestamp_after =
    !filter.time.start || String(filter.time.start).length === 0
      ? undefined
      : dayjs(filter.time.start).format("YYYY-MM-DD");
  params.timestamp_before =
    !filter.time.end || String(filter.time.end).length === 0
      ? undefined
      : dayjs(filter.time.end).format("YYYY-MM-DD");

  emit("change", params);
}

const filter = reactive<ILogFilter>({
  responsiblePerson: undefined,
  time: { start: null, end: null },
});

const params: ReactiveVariable<{
  offset: number;
  search: string;
  limit: number;
  hasNext?: boolean;
  responsible_person?: number;
  timestamp_after?: string;
  timestamp_before?: string;
}> = reactive({
  offset: 0,
  search: "",
  limit: 20,
  hasNext: false,
  responsible_person: undefined,
  timestamp_after: undefined,
  timestamp_before: undefined,
});
const loading = ref(false);
const responsiblePersons: Ref<IResponsiblePerson[]> = ref([]);
const searchResponsiblePerson = () => {
  ApiService.query("api/v1/participants/responsible_person/", {
    params: { ...params },
  }).then((res: any) => {
    responsiblePersons.value = res?.data.results;
  });
};
watch(
  () => searchText.value,
  (value) => {
    params.search = value;
    searchResponsiblePerson();
  },
  { deep: true }
);
async function fetchResponsiblePerson() {
  loading.value = true;
  const { data } = await ApiService.query(
    "api/v1/participants/responsible_person/",
    {
      params,
    }
  );

  if (params.offset !== 0) {
    responsiblePersons.value = [...responsiblePersons.value, ...data.results];
  } else {
    responsiblePersons.value = data.results;
  }
  params.hasNext = !!data.next;

  responsiblePersons.value = data.results;
  loading.value = false;
}

function fetchMore() {
  if (params.hasNext) {
    params.offset += 20;
    fetchResponsiblePerson();
  }
}

onMounted(() => {
  fetchResponsiblePerson();
});
</script>

<style lang="scss">
.filter-modal {
  .el-dialog__body {
    padding: 14px 24px 24px !important;
  }

  &__item {
    margin-top: 10px;
    margin-bottom: 10px;

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

.condition-select-loader {
  background: transparent !important;
}
</style>
