<template>
  <div>
    <SUserMainCard
      :title="$t('history_of_support_user')"
      class="pr-5"
      wrapper-class="d-flex flex-wrap"
    >
      <template #body>
        <div v-if="data.length">
          <div v-for="(item, idx) of data" :key="idx" class="d-flex w-100">
            <FSingleInfo :data="item" />
            <FSingleInfoContent class="mt-6" :data="item" />
          </div>
        </div>
        <div v-else>
          <div class="d-flex justify-content-center w-100">
            <p>{{ $t("data_not_found") }}</p>
          </div>
        </div>
      </template>
    </SUserMainCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import ApiService from "@/core/services/ApiService";
import FSingleInfo from "@/pages/Financial/components/FSingleInfo.vue";
import FSingleInfoContent from "@/pages/Financial/components/FSingleInfoContent.vue";
import SUserMainCard from "@/pages/PUser/Single/components/Cards/UserMainCard/SUserMainCard.vue";

const data = ref();
const route = useRoute();

onMounted(() => {
  ApiService.get(
    `api/v2/main/FinSupportList?participant__id=${route.params.id}`
  ).then((res) => {
    data.value = res?.data?.results;
    // routes.value = [
    //   {
    //     name: "main",
    //     route: "/",
    //     link: false,
    //   },
    //   {
    //     name: "financial_assistance",
    //     route: "/dashboard/financial",
    //     link: false,
    //   },
    //   {
    //     name: data.value?.participant?.full_name,
    //     route: "/",
    //     link: false,
    //   },
    // ];
  });
});
</script>
<style scoped>
.pr-5 {
  padding-right: 20px;
}
</style>
