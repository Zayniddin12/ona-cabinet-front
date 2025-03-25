<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("menus.responsible_people") }}
  </Teleport>

  <div class="global-breadcrumb pt-0 ps-0">
    <SBreadcrumb :routes="routes" />
  </div>
  <div>
    <STable
      v-bind="{
        loading,
        total: paginationData.total,
        data: tableData,
        offset,
      }"
      :header-data="
        useRoleManagement('edit', 'admin')
          ? RPHeaderData
          : RPHeaderData.slice(0, -1)
      "
      :current-page="paginationData.currentPage"
      :title="$t('active_responsible_person')"
      :subtitleCount="paginationData?.total"
      :subtitle="$t('menus.person')"
      class="main-table user-table"
      statusKey="status"
      :statusColors="{
        active: 'green',
        twenty_days_left: 'yellow',
        ten_days_left: 'red',
      }"
      search-class="search"
      @search="onSearch"
      @page-change="onPageChange"
      @on-items-per-page-change="onChangeLimit"
    >
      <template #beforeSearch>
        <div class="d-flex align-items-center justify-content-end gap-2 h-100">
          <div class="w-100">
            <el-select
              v-model="filterDate"
              :placeholder="$t('all')"
              class="w-50"
            >
              <el-option
                v-for="(item, ind) in tableDateFilters"
                :key="ind"
                :label="$t(item.title)"
                :value="item.id"
                :class="item.color"
              />
            </el-select>
          </div>
          <div
            class="d-flex align-items-center justify-content-end gap-2 h-100 w-100"
          >
            <p class="filter__label">{{ $t("menus.contract_type") }}</p>
            <el-select
              v-model="filter.type"
              :placeholder="$t('all')"
              class="w-50"
            >
              <el-option
                v-for="(item, ind) in contractTypeFilter"
                :key="ind"
                :label="$t(item.name)"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
      </template>
      <template v-if="useRoleManagement('edit', 'admin')" #afterSearch>
        <div class="user-table__actions ms-6">
          <SButton
            @click="addModal = true"
            variant="primary"
            :text="$t('add_new')"
          >
            <template #pre-icon>
              <img src="/assets/svg/buttons/plus.svg" alt="plus" />
            </template>
          </SButton>
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
            ? `~${minutesToHours(+data?.daily_activity)} ${$t("hours")}`
            : `${minutesToHours(+data?.daily_activity)} ${$t("hours")}`
        }}
      </template>
      <template v-slot:weekly="{ row: data }">
        {{
          data?.weekly_activity
            ? `~${minutesToHours(+data?.weekly_activity)} ${$t("hours")}`
            : `${minutesToHours(+data?.weekly_activity)} ${$t("hours")}`
        }}
      </template>

      <template v-slot:monthly="{ row: data }">
        {{
          data?.monthly_activity
            ? `~${minutesToHours(+data?.monthly_activity)} ${$t("hours")}`
            : `${minutesToHours(+data?.monthly_activity)} ${$t("hours")}`
        }}
      </template>
      <template v-slot:hisCare="{ row: data }">
        <RouterLink
          v-if="useRoleManagement('edit')"
          :to="`/responsible-person/${data?.id}`"
        >
          <div class="d-flex flex-nowrap">
            <InlineSvg src="/assets/ona/svg/users.svg" />
            <p class="text-nowrap user-table__link">
              {{ $t("care_count", { count: data?.participant_count }) }}
            </p>
          </div>
        </RouterLink>
        <div v-else>
          <div class="d-flex flex-nowrap">
            <InlineSvg src="/assets/ona/svg/users.svg" />
            <p class="text-nowrap">
              {{ $t("care_count", { count: data?.participant_count }) }}
            </p>
          </div>
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
              <el-dropdown-item class="border-b" @click="openEdit(data?.id)">
                <div
                  class="d-flex align-items-center user-table__edit-dropdown"
                >
                  <InlineSvg
                    src="/assets/svg/buttons/edit.svg"
                    class="text-2x d-inline-block me-2 blackEdit"
                  />
                  <span class="edit-text">{{ $t("edit") }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                class="border-b delete user-table__trash-dropdown"
                @click="openDelete(data?.id)"
              >
                <inline-svg
                  src="/assets/svg/buttons/trash.svg"
                  class="text-2x d-inline-block me-2"
                />
                <span class="trash-text">{{ $t("make_inactive") }}</span>
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

  <ActionModal
    :show="addModal"
    add
    :form="form"
    :contractType="contractType"
    :moderators="moderators"
    @fetch-more="fetchMore"
    @fetch-search="searchModerator"
    @close="closeModal('add')"
    @submit="submitForm"
  />

  <ActionModal
    :show="editModal"
    edit
    :form="form"
    :contractType="contractType"
    :moderators="moderators"
    @fetch-more="fetchMore"
    @fetch-search="searchModerator"
    @close="closeModal('edit')"
    @submit="submitEdit"
  />

  <SDeleteTaskModal
    :show="showDelete"
    :title="$t('stop_responsible_person')"
    :text="$t('stop_responsible_person_text')"
    @close="showDelete = false"
    @submit="removePerson"
    :loading="buttonLoading"
    :button-text="$t('approve')"
  />
</template>

<script setup lang="ts">
import { required } from "@vuelidate/validators";
import dayjs from "dayjs";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";

import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import {
  calcTabIndex,
  debounce,
  formatDate,
  isPhone,
  updateQueryParams,
} from "@/helpers";
import ActionModal from "@/pages/PRPerson/Components/ActionModal.vue";
import { RPHeaderData } from "@/pages/PRPerson/data";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";
import STableLabels from "@/stories/Common/TableLabels/STableLabels.vue";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const { mounted } = useMounted();

const editModal = ref<boolean>(false);
const addModal = ref<boolean>(false);
const personID = ref();
const showDelete = ref(false);
const moderators = ref<any>([]);
const buttonLoading = ref(false);
const filter = ref<{ search: string; type: number | string | null }>({
  search: "",
  type: "",
});
const ten_days_left = ref(false);
const twenty_days_left = ref(false);
const filterDate = ref<number>(1);
watch(
  () => filterDate.value,
  (value) => {
    if (value === 2) {
      twenty_days_left.value = true;
      ten_days_left.value = false;
    } else if (value === 3) {
      twenty_days_left.value = false;
      ten_days_left.value = true;
    } else {
      twenty_days_left.value = false;
      ten_days_left.value = false;
    }
    updateQueryParams({
      ten_days_left: ten_days_left.value,
      twenty_days_left: twenty_days_left.value,
    });
    debounce(
      "filterActiveUsers",
      () => {
        fetchTableData();
      },
      400
    );
  }
);

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
} = useTableFetch("api/v2/main/ResponsiblePersonList?active=true");

const contractType = [
  { name: "outsourced", id: 2 },
  { name: "in_the_state", id: 1 },
];

const contractTypeFilter = [
  { name: "all", id: "" },
  { name: "outsourced", id: 2 },
  { name: "in_the_state", id: 1 },
];

const tableDateFilters = [
  {
    id: 1,
    color: "green",
    title: t("all"),
  },
  {
    id: 2,
    color: "yellow",
    title: t("twenty_days_to_end"),
  },
  {
    id: 3,
    color: "red",
    title: t("ten_days_to_end"),
  },
];

const tableLabels = [
  {
    color: "green",
    title: t("active"),
  },
  {
    color: "yellow",
    title: t("twenty_days_to_end"),
  },
  {
    color: "red",
    title: t("ten_days_to_end"),
  },
];

const form = useForm(
  {
    user: null,
    contract_type: null,
    phone: "",
    start_date: "",
    end_date: "",
  },
  {
    user: { required },
    contract_type: { required },
    start_date: { required },
    end_date: { required },
    phone: { required, isPhone },
  }
);

function minutesToHours(minutes: number) {
  return Math.round(minutes / 60);
}

const closeModal = (status: string) => {
  if (status === "add") {
    addModal.value = false;
  } else {
    editModal.value = false;
  }
  editModal.value = false;
  form.values.user = null;
  form.values.contract_type = null;
  form.values.phone = "";
  form.values.start_date = "";
  form.values.end_date = "";

  form.$v.value.$reset();
};

// Create
const submitForm = async () => {
  await ApiService.post("/api/v2/main/ResponsiblePersonCreate", {
    user: form.values.user,
    contract_type: form.values.contract_type,
    phone: form.values.phone.replaceAll(" ", ""),
    start_date: dayjs(form.values.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(form.values.end_date).format("YYYY-MM-DD"),
  })
    .then(() => {
      toast.success(t("successfully_added"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .catch(() => {
      toast.error(t("error_send"), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    });
  closeModal("add");
  fetchTableData();
};

// Edit

const openEdit = async (id: number) => {
  personID.value = id;
  await ApiService.get(`/api/v2/main/ResponsiblePersonDetail/${id}`).then(
    ({ data }) => {
      let hasId = false;
      moderators.value.forEach((el: any) => {
        if (el?.id === data?.user?.id) {
          hasId = true;
        }
      });

      if (!hasId) {
        moderators.value.push(data?.user);
      }
      form.values.user = data?.user?.id;
      form.values.contract_type = data?.contract_type;
      form.values.start_date = data?.start_date;
      form.values.end_date = data?.end_date;
      form.values.phone = data?.phone;
    }
  );

  editModal.value = true;
};
// Edit
const submitEdit = async () => {
  await ApiService.put(
    `/api/v2/main/ResponsiblePersonUpdate/${personID.value}`,
    {
      user: form.values.user,
      contract_type: form.values.contract_type,
      phone: form.values.phone.replaceAll(" ", ""),
      start_date: dayjs(form.values.start_date).format("YYYY-MM-DD"),
      end_date: dayjs(form.values.end_date).format("YYYY-MM-DD"),
    }
  )
    .then(() => {
      toast.success(t("successfully_updated"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .catch(() => {
      toast.error(t("error_send"), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    });
  closeModal("edit");
  fetchTableData();
};

// Remove

function openDelete(id: number) {
  personID.value = id;
  showDelete.value = true;
}

const removePerson = async () => {
  buttonLoading.value = true;
  await ApiService.patch(
    `api/v2/main/ResponsiblePersonUpdate/${personID.value}`,
    {
      active: false,
    }
  )
    .then(() => {
      toast.success(t("successfully_removed"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      fetchTableData();
      showDelete.value = false;
    })
    .finally(() => (buttonLoading.value = false));
};

const hasNext = ref(false);
const params = reactive({
  limit: 20,
  offset: 0,
});

function fetchModeratorList(searchText?: string) {
  ApiService.query("/api/v2/main/ModeratorList?is_free=true", {
    params: {
      ...params,
      search: searchText,
    },
  }).then(({ data }) => {
    moderators.value = searchText
      ? data?.results
      : [...moderators.value, ...(data?.results ?? [])];
    hasNext.value = !!data.next;
  });
}

function fetchMore() {
  if (hasNext.value) {
    params.offset = params.offset + 20;
    fetchModeratorList();
  }
}

function searchModerator(searchText?: string) {
  params.offset = 0;
  fetchModeratorList(searchText);
}

onMounted(() => {
  fetchModeratorList();
});

watch(
  () => filter.value.type,
  (newValue) => {
    updateQueryParams({ contract_type: newValue }, false);
    debounce(
      "filter",
      () => {
        fetchTableData();
      },
      400
    );
  }
);
</script>

<style lang="scss">
.filter__label {
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #b5b5c3;
}
</style>
