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

import ApiService from "@/core/services/ApiService";
import { handleError } from "@/helpers";

export function useRemoteSearch<TD = any>(
  url?: string,
  params?: ReactiveEffect<{ [key: string]: string | number }>
) {
  const loading = ref(false);
  const toast = useToast();
  const { t: $t } = useI18n();
  const route = useRoute();

  const remoteMethod = (query: string) => {
    if (query) {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 200);
    } else {
      return [];
    }
  };

  return {
    loading,
    remoteMethod,
  };
}
