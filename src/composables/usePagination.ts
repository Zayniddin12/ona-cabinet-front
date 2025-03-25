import { Ref, ref } from "vue";
import { useRoute } from "vue-router";

export function usePagination(limit: Ref<number>) {
  const route = useRoute();

  const offset = ref(0);
  const currentPage = ref(1);

  offset.value = route?.query?.page
    ? (+route?.query?.page - 1) * limit.value
    : 0;

  const changePage = (page: number) => {
    currentPage.value = page;
    offset.value = (page - 1) * limit.value;
  };

  return {
    offset,
    currentPage,
    changePage,
  };
}
