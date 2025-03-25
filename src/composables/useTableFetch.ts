import {
  computed,
  ComputedRef,
  onMounted,
  reactive,
  ReactiveEffect,
  ref,
  toRef,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

import { usePagination } from "@/composables/usePagination";
import ApiService from "@/core/services/ApiService";
import { handleError, updateQueryParams } from "@/helpers";
import { IObject } from "@/types";

export function useTableFetch<TD = any>(
  url: string,
  params?: ReactiveEffect<IObject>
) {
  const toast = useToast();
  const { t: $t } = useI18n();
  const route = useRoute();

  const loading = ref(false);
  const fetchTrigger = ref(0);
  const responseData = ref();

  const paginationData = reactive<{
    token: string;
    total: number;
    defaultLimit: number;
    currentPage: number;
  }>({
    token: localStorage.getItem("id_token") as string,
    total: 0,
    defaultLimit: route.query.limit ? +route.query.limit : 10,
    currentPage: route.query.page ? +route.query.page : 1,
  });
  const pinCount = ref<number | null>(null);

  const totalPage: ComputedRef<number> = computed(
    () => Math.floor(paginationData.total / paginationData.defaultLimit) + 1
  );

  const { offset, changePage } = usePagination(
    toRef(paginationData, "defaultLimit")
  );

  const searchText = ref(route.query.search);

  const tableData = ref<TD[]>([]);
  const fetchTableData = (queryParams: object = { ...route.query }) => {
    // console.log(searchText.value)
    // console.log(queryParams)
    loading.value = true;
    ApiService.query(url, {
      params: {
        limit: paginationData.defaultLimit,
        offset: offset.value,
        ...queryParams,
        ...params,
        search: searchText.value,
      },
    })
      .then((res: any) => {
        pinCount.value = res?.data?.pin_count ?? null;
        paginationData.total = res?.data?.count;
        tableData.value = res?.data?.results;
        responseData.value = res.data;
        fetchTrigger.value++;
      })
      .catch((err) => {
        if (err.response.status === 500) {
          toast.error(
            $t("server_error", {
              icon: {
                iconClass: "error-icon",
                iconTag: "div",
              },
            })
          );
        }
        handleError(err.response.data);
      })
      .finally(() =>
        setTimeout(() => {
          loading.value = false;
        }, 300)
      );
  };

  onMounted(() => {
    const currentPage = Number(route.query.page);
    if (currentPage && +currentPage !== paginationData.currentPage) {
      onPageChange(+currentPage);
    } else {
      fetchTableData();
    }
  });

  function onSearch(text: string, noQuery?: boolean) {
    offset.value = 0;
    searchText.value = text;

    if (route?.query?.limit || (route?.query?.limit && route?.query?.page)) {
      const queryParams: {
        search: string;
        limit: string;
        page?: string;
      } = {
        ...route.query,
        search: text,
        limit: route.query.limit as string,
      };

      if (route.query.page) {
        queryParams.page = undefined;
      }

      queryParams.limit = route.query.limit as string;
      if (!noQuery) {
        updateQueryParams(queryParams, true);
      }
      changePage(1);
      paginationData.currentPage = 1;
      return fetchTableData();
    }

    if (!noQuery) {
      updateQueryParams({ search: text });
    }
    changePage(1);
    fetchTableData();
  }

  function onPageChange(page: number, filterParams?: object) {
    if (page && page !== paginationData.currentPage) {
      paginationData.currentPage = page;
      updateQueryParams({ page: String(page) });
      changePage(page);
    }
    fetchTableData(filterParams);
  }

  const scrollToTop = () => {
    const tableEl = document.querySelector(".i-table");
    if (tableEl) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onChangeLimit = (newLimit: number) => {
    paginationData.defaultLimit = newLimit;
    updateQueryParams({
      limit: String(newLimit),
    });
    setTimeout(() => {
      usePagination(toRef({ limit: newLimit }, "limit"));
      onPageChange(1);
      scrollToTop();
    }, 10);
  };

  return {
    tableData,
    loading,
    paginationData,
    offset,
    totalPage,
    pinCount,
    fetchTrigger,
    responseData,
    onPageChange,
    onSearch,
    fetchTableData,
    onChangeLimit,
  };
}
