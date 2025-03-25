<template>
  <STable
    v-bind="{ total, data }"
    :title="$t('menus.participants')"
    subtitle=""
    :header-data="TableHeader"
    :search="$route.query.search"
    :current-page="$route.query.page"
    no-search
  >
    <template v-slot:id="{ row: data }"> {{ data.index }}.</template>
    <template v-slot:fio="{ row: data }">
      <SUserCard :data="data" :disabled="isResponsiblePerson" />
    </template>
    <template v-slot:ijt="{ row: data }"> {{ data?.point }}</template>
    <template v-slot:region="{ row: data }">
      {{ data?.living_region?.title }}
    </template>
    <template #afterSearch>
      <RouterLink
        :to="{ name: 'ActiveParticipants' }"
        class="fs-16 hover-opacity lh-16 fw-semibold text-blue ms-6"
      >
        {{ $t("all_users") }}
        <inline-svg src="/assets/ona/svg/arrow-right.svg" />
      </RouterLink>
    </template>
  </STable>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

import SUserCard from "@/stories/Common/Cards/User/SUserCard.vue";
import STable from "@/stories/Common/Table/STable.vue";

const { t } = useI18n();

const store = useStore();

const currentUserRole = computed(() => store.state.AuthModule?.user?.type);

const isResponsiblePerson = computed(() => {
  return currentUserRole.value === "responsible_person";
});

// ******* PROPS *******
interface Props {
  title: string;
  subtitle: string;
  data: Array<string>;
  hasSearch?: boolean;
  currentPage?: number;
  total?: number;
  isNotEnd?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: "Title",
  subtitle: "Subtitle",
  currentPage: 1,
  total: 0,
});

const TableHeader = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "fio",
    columnLabel: t("fio"),
  },
  {
    columnName: "ijt",
    columnLabel: t("ijt"),
  },
  {
    columnName: "region",
    columnLabel: t("region"),
  },
];
</script>
