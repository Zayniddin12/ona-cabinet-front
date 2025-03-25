<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("menus.responsible_people") }}
  </Teleport>

  <div class="global-breadcrumb pt-0 ps-0">
    <SBreadcrumb :routes="routes" />
  </div>
  <div>
    <STable
      v-bind="{ loading, total: paginationData.total, data: tableData, offset }"
      :header-data="
        useRoleManagement('edit', 'admin')
          ? RPHeaderData
          : RPHeaderData.slice(0, -1)
      "
      :current-page="paginationData.currentPage"
      :title="$t('nonactive_responsible_person')"
      :subtitleCount="paginationData?.total"
      :subtitle="$t('menus.person')"
      class="main-table user-table"
      statusKey="status"
      :statusColors="{
        active: 'green',
        twenty_days_left: 'yellow',
        ten_days_left: 'red',
        inactive: 'gray',
      }"
      search-class="search"
      @search="onSearch"
      @page-change="onPageChange"
      @on-items-per-page-change="onChangeLimit"
    >
      <template #beforeSearch>
        <div class="d-flex align-items-center justify-content-end gap-2 h-100">
          <p class="filter__label">{{ $t("menus.contract_type") }}</p>
          <el-select
            v-model="filter.type"
            :placeholder="$t('all')"
            class="w-50"
          >
            <el-option
              v-for="(item, ind) in contractType"
              :key="ind"
              :label="$t(item.name)"
              :value="item.id"
            />
          </el-select>
        </div>
      </template>
      <template v-slot:id="{ row: data }">
        {{ calcTabIndex(data.index, offset) }}
      </template>
      <template v-slot:name="{ row: data }">
        <div class="position-relative">
          <RouterLink
            v-if="useRoleManagement('edit')"
            :to="`/responsible-person/${data?.id}`"
            class="user-table__item"
          >
            <h3 class="user-table__link">
              <WordHighlighter :query="$route?.query?.search || ''">
                {{ data?.user?.first_name }}
              </WordHighlighter>
            </h3>
          </RouterLink>
          <div v-else class="user-table__item">
            <h3 class="">
              <WordHighlighter :query="$route?.query?.search || ''">
                {{ data?.user?.first_name }}
              </WordHighlighter>
            </h3>
          </div>
        </div>
      </template>
      <template v-slot:type="{ row: data }">
        {{ $t(`contract_type_arr[${data?.contract_type - 1}]`) }}
      </template>
      <template v-slot:daily="{ row: data }">
        {{
          data?.daily_activity
            ? `~${data?.daily_activity} ${$t("hours")}`
            : `${data?.daily_activity} ${$t("hours")}`
        }}
      </template>
      <template v-slot:weekly="{ row: data }">
        {{
          data?.weekly_activity
            ? `~${data?.weekly_activity} ${$t("hours")}`
            : `${data?.weekly_activity} ${$t("hours")}`
        }}
      </template>

      <template v-slot:monthly="{ row: data }">
        {{
          data?.monthly_activity
            ? `~${data?.monthly_activity} ${$t("hours")}`
            : `${data?.monthly_activity} ${$t("hours")}`
        }}
      </template>
      <template v-slot:hisCare="{ row: data }">
        <div class="d-flex flex-nowrap">
          <InlineSvg src="/assets/ona/svg/users.svg" />
          <p class="text-nowrap">
            {{ $t("care_count", { count: data?.participant_count }) }}
          </p>
        </div>
      </template>
      <template v-slot:end_date="{ row: data }">
        {{ formatDate(data?.end_date) }}
      </template>
      <template v-slot:actions="{ row: data }">
        <el-dropdown
          class="d-flex justify-content-end user-table__action-dropdown"
          trigger="click"
          placement="bottom-end"
        >
          <div>
            <button class="btn btn-active-light w-25px h-25px p-0">
              <InlineSvg
                src="/assets/ona/svg/dots-vertical.svg"
                class="text-2x dot"
              />
            </button>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item class="border-b" @click="openActive(data?.id)">
                <div
                  class="d-flex align-items-center user-table__edit-dropdown"
                >
                  <InlineSvg
                    src="/assets/ona/svg/restart.svg"
                    class="text-2x d-inline-block me-2"
                  />
                  <span class="edit-text">{{ $t("restart_activity") }}</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>

      <template #footerLeft>
        <STableLabels :labels="tableLabels" />
      </template>
    </STable>
  </div>
  <SDeleteTaskModal
    :show="showActive"
    :title="$t('active_r_person')"
    :text="$t('active_r_person_text')"
    :button-text="$t('make_active')"
    button-variant="primary"
    @submit="ActivePerson"
    @close="showActive = false"
    :loading="buttonLoading"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";

import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { calcTabIndex, debounce, formatDate } from "@/helpers";
import { RPHeaderData } from "@/pages/PRPerson/data";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import STable from "@/stories/Common/Table/STable.vue";
import STableLabels from "@/stories/Common/TableLabels/STableLabels.vue";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const { mounted } = useMounted();

const buttonLoading = ref(false);
const personID = ref();
const showActive = ref(false);
const filter = ref<{ search: string; type: number | string | null }>({
  search: "",
  type: "",
});

const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "menus.responsible_people",
      route: "/responsible-person",
      link: false,
    },
  ];
});

const {
  offset,
  loading,
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch("api/v2/main/ResponsiblePersonList?active=false");
const contractType = [
  { name: "all", id: "" },
  { name: "outsourced", id: 2 },
  { name: "in_the_state", id: 1 },
];

const tableLabels = [
  {
    color: "grey",
    title: t("inactive"),
  },
];

// Edit

const openActive = async (id: number) => {
  personID.value = id;
  showActive.value = true;
};

watch(
  () => filter.value.type,
  (newValue: string | number) => {
    router.push({ query: { contract_type: newValue } });
    debounce(
      "filter",
      () => {
        fetchTableData();
      },
      400
    );
  }
);

function ActivePerson() {
  buttonLoading.value = true;
  ApiService.put(`/api/v2/main/ResponsiblePersonUpdate/${personID.value}`, {
    active: true,
  })
    .then(() => {
      toast.success(t("successfully_updated"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      showActive.value = false;
      fetchTableData();
    })
    .catch((err) => {
      toast.error(t(err?.response?.data?.errors[0].error), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => (buttonLoading.value = false));
}
</script>

<style lang="scss">
.filter__label {
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #b5b5c3;
}
</style>
