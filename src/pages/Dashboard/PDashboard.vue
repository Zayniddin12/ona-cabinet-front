<template>
  <Teleport v-if="mounted" to="#topbar-title">
    {{ $t("menus.general_statistics") }}
  </Teleport>

  <!--begin::Dashboard-->
  <div class="row gy-5 g-xl-8 mb-6">
    <div class="col-xxl-4">
      <WidgetDashboard
        widget-classes="card-xl-stretch mb-xl-8"
        widget-color="primary"
        :statistics="statistics"
      />
    </div>
    <div class="col-xxl-8">
      <SUsersTable
        v-bind="{ data: participants }"
        :search="$route.query.search"
        :current-page="$route.query.page"
        is-not-end
      />
    </div>
  </div>

  <div class="mb-7">
    <STopResponsibleTab
      v-bind="{ data: responsiblePersons }"
      :last-list="lastList"
      :title="$t('menus.top_responsible_persons')"
      subtitle=""
      :search="$route.query.search"
      :current-page="$route.query.page"
      is-not-end
    />
  </div>

  <div class="mb-7">
    <STasksTable
      v-bind="{ data: tasks }"
      :title="$t('menus.tasks')"
      subtitle=""
      :search="$route.query.search"
      :current-page="$route.query.page"
      is-not-end
    />
  </div>
  <div class="row gy-5 g-xl-8 mb-7">
    <div class="col-xxl-6 d-flex align-items-center gap-4 h-auto">
      <SCardInfo
        class="i-bg-green"
        :card="{
          icon: '/assets/ona/svg/women-full.svg',
          total: formatNumber(support?.count),
          subtitle: $t('provided_mothers'),
        }"
      />
      <SCardInfo
        class="i-bg-blue"
        :card="{
          icon: '/assets/ona/svg/money.svg',
          total: `${formatNumber(support?.all_sum)} UZS`,
          subtitle: $t('allocated_money'),
        }"
      />
    </div>
    <div class="col-xxl-6">
      <SChardCard :contract="contract" />
    </div>
  </div>
  <!--end::Dashboard-->
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import WidgetDashboard from "@/components/widgets/mixed/WidgetDashboard.vue";
import { useMounted } from "@/composables/useMounted";
import { setCurrentPageTitle } from "@/core/helpers/breadcrumb";
import ApiService from "@/core/services/ApiService";
import { formatNumber } from "@/helpers";
import SCardInfo from "@/pages/Dashboard/components/Cards/Info/SCardInfo.vue";
import SChardCard from "@/pages/Dashboard/components/Charts/SChardCard.vue";
import STasksTable from "@/pages/Dashboard/components/TasksTable/STasksTable.vue";
import STopResponsibleTab from "@/pages/Dashboard/components/TopResponsibleTab/STopResponsibleTab.vue";
import SUsersTable from "@/pages/Dashboard/components/UsersTable/SUsersTable.vue";

const { mounted } = useMounted();

const dataTotalParticipants = ref(0);
const statistics = ref();
const participants = ref();
const support = ref();
const contract = ref();
const responsiblePersons = ref([]);
const lastList = ref([]);
const tasks = ref([]);

onBeforeMount(() => {
  setCurrentPageTitle("Dashboard");

  ApiService.get("api/v2/participants/participantStatistic").then((res) => {
    statistics.value = res?.data;
  });
  ApiService.get("api/v2/participants/participantDashboard").then((res) => {
    participants.value = res?.data?.results;
  });
  ApiService.get("api/v2/main/DashboardFinSupport").then((res) => {
    support.value = res?.data;
  });
  ApiService.get("api/v2/main/DashboardContractGraph").then((res) => {
    contract.value = res?.data;
  });
  ApiService.get("api/v2/main/ResponsiblePersonDashboard").then((res) => {
    responsiblePersons.value = res?.data;
  });

  ApiService.get(
    "api/v2/main/ResponsiblePersonDashboard?last_six_months=true"
  ).then((res) => {
    lastList.value = res?.data;
  });

  ApiService.get("api/v2/main/DashboardTask/").then((res) => {
    tasks.value = res?.data?.results;
  });
});
</script>

<style scoped>
.h-252 {
  height: 252px;
}
</style>
