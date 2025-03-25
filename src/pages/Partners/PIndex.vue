<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("partners") }}
  </Teleport>

  <div class="global-breadcrumb pt-0 ps-0">
    <SBreadcrumb :routes="routes" />
  </div>
  <div class="">
    <STable
      v-bind="{ loading, total: paginationData.total, data: tableData, offset }"
      :header-data="
        useRoleManagement('edit')
          ? PartnersHeaderData
          : PartnersHeaderData.slice(0, -1)
      "
      :title="$t('partners')"
      :subtitleCount="paginationData?.total"
      :subtitle="$t('partners')"
      class="main-table user-table"
      search-class="search"
      @search="onSearch"
      @page-change="onPageChange"
      @on-items-per-page-change="onChangeLimit"
      :current-page="paginationData.currentPage"
      :items-per-page="paginationData.defaultLimit"
    >
      <template #afterSearch>
        <div class="user-table__actions ms-6">
          <SButton variant="secondary" text="" @click="showFilter = true">
            <template #pre-icon>
              <InlineSvg src="/assets/ona/svg/filter.svg" />
            </template>
          </SButton>
          <SButton
            v-if="useRoleManagement('add')"
            @click="addPartner"
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
        {{ calcTabIndex(data?.index, offset) }}
      </template>
      <template v-slot:userName="{ row: data }">
        <div class="position-relative">
          <RouterLink
            :to="{ name: 'PartnerSingle', params: { id: data?.id } }"
            class="user-table__item"
          >
            <h3>
              <WordHighlighter :query="$route?.query?.search || ''">
                {{ data?.name }}
              </WordHighlighter>
            </h3>
            <p>{{ data?.partner_id }}</p>
          </RouterLink>
        </div>
      </template>
      <template v-slot:type="{ row: data }">
        {{ $t(data?.type) }}
      </template>
      <template v-slot:amount="{ row: data }">
        <span>{{ formatMoneyDecimal(data?.amount, 0) }} UZS</span>
      </template>
      <template v-slot:region="{ row: data }">
        {{ data?.region }}
      </template>
      <template v-slot:phone="{ row: data }">
        {{ formatPhoneNumber(`+998${data?.phone}`) }}
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
              <el-dropdown-item class="border-b" @click="editPartner(data?.id)">
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
                v-if="useRoleManagement('', [])"
                class="border-b delete user-table__trash-dropdown"
                @click="showDeleteModal(data?.id)"
              >
                <inline-svg
                  src="/assets/svg/buttons/trash.svg"
                  class="text-2x d-inline-block me-2"
                />
                <span class="trash-text">{{ $t("delete") }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </STable>
  </div>
  <CFilterModal
    :show="showFilter"
    @close="showFilter = false"
    @submit="submitFilter"
    :regions="regions"
  />
  <CActionModal
    :show="addModalActive"
    @close="addModalActive = false"
    @submit="submitForm"
    :form="form"
    :type="type"
    :regions="regions"
  />
  <SDeleteTaskModal
    :show="showDelete"
    :loading="deleteLoading"
    title="delete_partner"
    text="delete_task_text"
    button-text="delete"
    @close="showDelete = false"
    @submit="removePartner"
  />
</template>
<script setup lang="ts">
import { required } from "@vuelidate/validators";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import WordHighlighter from "vue-word-highlighter";

import { useForm } from "@/composables/useForm";
import { useMounted } from "@/composables/useMounted";
import useRoleManagement from "@/composables/useRoleManagement";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import {
  calcTabIndex,
  formatMoneyDecimal,
  formatPhoneNumber,
  isPhone,
} from "@/helpers";
import CActionModal from "@/pages/Partners/Components/CActionModal.vue";
import CFilterModal from "@/pages/Partners/Components/CFilterModal.vue";
import { PartnersHeaderData, TPartner } from "@/pages/Partners/data";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";

const {
  offset,
  loading,
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch("api/v2/main/PartnerList");

const { t } = useI18n();
const toast = useToast();
const { mounted } = useMounted();

const showFilter = ref(false);
const addModalActive = ref(false);
const regions = ref();
const type = ref("add");
const partnerID = ref();
const showDelete = ref<boolean>(false);
const deleteLoading = ref<boolean>(false);
const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "menus.cashiers",
      route: "/partners",
      link: false,
    },
  ];
});

const form = useForm<TPartner>(
  {
    name_uz: "",
    name_ru: "",
    type: null,
    partner_id: null,
    phone: "",
    amount: null,
    region: null,
  },
  {
    name_uz: { required },
    name_ru: { required },
    type: { required },
    partner_id: { required },
    phone: { required, isPhone },
    amount: { required },
    region: { required },
  }
);

ApiService.get("api/v1/regions/search").then(({ data }) => {
  regions.value = data?.results;
});

// Filter

const submitFilter = (query: object) => {
  showFilter.value = false;

  fetchTableData({ ...query });
};

// Add Edit
const submitForm = async () => {
  if (type.value === "add") {
    await ApiService.post("/api/v2/main/PartnerCreate", {
      name_uz: form.values.name_uz,
      name_ru: form.values.name_ru,
      partner_id: form.values.partner_id,
      type: form.values.type,
      amount: form.values.amount.replaceAll(" ", ""),
      region: form.values.region,
      phone: form.values.phone.replaceAll(" ", ""),
    })
      .then(() => {
        toast.success(t("successfully_added"), {
          icon: {
            iconClass: "done-icon",
            iconTag: "div",
          },
        });
        addModalActive.value = false;
        fetchTableData();
      })
      .catch((err) => {
        toast.error(err, {
          icon: {
            iconClass: "error-icon",
            iconTag: "div",
          },
        });
      });
  } else {
    await ApiService.put(`api/v2/main/PartnerUpdate/${partnerID.value}`, {
      name_uz: form.values.name_uz,
      name_ru: form.values.name_ru,
      partner_id: form.values.partner_id,
      type: form.values.type,
      amount: String(form.values.amount).replaceAll(" ", ""),
      region: form.values.region,
      phone: form.values.phone.replaceAll(" ", ""),
    })
      .then(() => {
        addModalActive.value = false;
        fetchTableData();
        toast.success(t("successfully_edited"), {
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
  }
};

function showDeleteModal(id: number) {
  partnerID.value = id;
  showDelete.value = true;
}

const removePartner = () => {
  deleteLoading.value = true;

  ApiService.delete(`api/v2/main/PartnerDelete/${partnerID.value}`)
    .then(() => {
      toast.success(t("successfully_removed_partner"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => {
      deleteLoading.value = false;
      showDelete.value = false;
      fetchTableData();
    });
};

const addPartner = () => {
  type.value = "add";
  addModalActive.value = true;
};

const editPartner = async (id: number) => {
  partnerID.value = id;
  await ApiService.get(`/api/v2/main/PartnerDetail/${id}`).then(({ data }) => {
    form.values.name_uz = data?.name_uz;
    form.values.name_ru = data?.name_ru;
    form.values.type = data?.type;
    form.values.partner_id = data?.partner_id;
    form.values.phone = data?.phone;
    form.values.amount = data?.amount;
    form.values.region = data?.region?.id;
  });

  type.value = "edit";
  addModalActive.value = true;
};
</script>
