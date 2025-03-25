<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("menus.tasks") }}
  </Teleport>

  <div class="global-breadcrumb pt-0 ps-0">
    <SBreadcrumb :routes="breadcrumbs" />
  </div>
  <div class="task-card d-flex flex-column w-100">
    <div class="d-flex flex-column align-items-start head">
      <div class="d-flex justify-content-between align-items-center w-100">
        <div class="d-flex flex-column align-items-start">
          <h2 class="task__title">
            {{ $t("tasks") }}
          </h2>
          <p class="text--secondary">
            {{
              $t("tasks_count", {
                count: $route.query?.total ?? 0,
              })
            }}
          </p>
        </div>
        <div class="d-flex align-items-stretch">
          <div class="d-flex align-items-center">
            <p class="text--secondary me-3">{{ $t("period") }}</p>
            <DatePicker v-model="filter.date" />
          </div>

          <SSearchBar
            v-model="filter.search"
            class="w-250px mx-6"
            :placeholder="$t('search')"
          />
          <SButton
            variant="green"
            :loading="downloadLoading"
            @click="downloadExcel"
          >
            <InlineSvg src="/assets/icons/static/excel-logo.svg" />
            {{ $t("download_excel") }}
          </SButton>
        </div>
      </div>
      <ul class="task__list">
        <li v-for="(link, ind) in navLinks" :key="ind">
          <RouterLink
            :to="{ name: link.name }"
            class="nav-link"
            active-class="task-active"
          >
            {{ $t(link.title) }}
          </RouterLink>
        </li>
      </ul>
    </div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import { useMounted } from "@/composables/useMounted";
import { useTableFetch } from "@/composables/useTableFetch";
import ApiService from "@/core/services/ApiService";
import { debounce, updateQueryParams } from "@/helpers";
import DatePicker from "@/pages/Tasks/Components/DatePicker.vue";
import { breadcrumbs, navLinks } from "@/pages/Tasks/data";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import SSearchBar from "@/stories/Form/SearchBar/SSearchBar.vue";
import { IObject, ISearchDateFilter } from "@/types";

const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const { mounted } = useMounted();

const filter = reactive<ISearchDateFilter>({
  search: "",
  date: {
    start: null,
    end: null,
  },
});

watch(
  () => filter.search,
  (newValue) => {
    debounce("search", () => updateQueryParams({ search: newValue }));
  },
  { deep: true }
);

watch(
  () => filter.date,
  (newValue) => {
    const queryParams: IObject = {
      deadline__gte: newValue.start
        ? dayjs(newValue.start).format("YYYY-MM-DD")
        : undefined,
      deadline__lte: newValue.end
        ? dayjs(newValue.end).format("YYYY-MM-DD")
        : undefined,
    };
    updateQueryParams(queryParams);
  },
  { deep: true }
);

const downloadLoading = ref(false);

function downloadExcel() {
  downloadLoading.value = true;
  const params = route.query;
  ApiService.query("api/v2/main/TaskGenerateExcel", {
    params,
    responseType: "blob",
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.xls"); //or any other extension
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    })
    .catch(() => {
      toast.error(t("something_went_wrong"), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    })
    .finally(() => (downloadLoading.value = false));
}
</script>

<style lang="scss">
.btn-style {
  margin-left: 20px;
}

.task-date-picker {
  width: auto !important;
  padding: 12px !important;
  height: 40px !important;
  background: #ffffff !important;
  border-color: #f0f1f4 !important;
  border-radius: 8px !important;

  .el-icon.el-range__icon {
    display: none !important;
  }

  .el-range-input {
    height: 40px;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    color: #1c1f20;
    width: 90px !important;

    &::placeholder {
      font-weight: 400;
      font-size: 13px;
      line-height: 16px;
      color: #1c1f20;
    }
  }

  .el-range-separator {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #b5b5c3;
  }
}
</style>

<style scoped lang="scss">
.task-card {
  background: #fff;
  border: 1px solid #e5eaee;
  border-radius: 12px;

  .head {
    padding: 28px 28px 0 28px;
  }

  .task__title {
    text-transform: capitalize;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: #1c1f20;
  }

  .task__list {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 16px 0 0 0;
    padding: 0;
  }

  .nav-link {
    position: relative;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #a2abbe;
    padding: 8px 12px 14px 12px;
    margin-right: 12px;
    background: transparent;
    transition: 0.3s ease all;

    &:before {
      content: "";
      width: 100%;
      height: 100%;
      display: block;
      background: linear-gradient(
        180deg,
        rgba(48, 161, 219, 0) 0%,
        rgba(48, 161, 219, 0.1) 100%
      );
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: 0.3s ease all;
    }

    &:after {
      content: "";
      width: 100%;
      height: 2px;
      background-color: #30a1db;
      display: block;
      border-radius: 3px;
      position: absolute;
      inset: auto 0 0 0;
      opacity: 0;
      transition: 0.3s ease all;
    }
  }

  .nav-link.task-active {
    color: #30a1db;

    &:after {
      opacity: 1;
    }

    &:before {
      opacity: 1;
    }

    transition: 1s ease all;
  }

  .text--secondary {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #b5b5c3;
  }
}
</style>
