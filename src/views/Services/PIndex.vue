<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <li class="breadcrumb-item pe-3">
      <RouterLink :to="{ name: 'dashboard' }" class="pe-3">
        {{ $t("main") }}
      </RouterLink>
    </li>
    <li class="breadcrumb-item pe-3 text-muted">
      <span>{{ $t("services") }}</span>
    </li>
  </Teleport>
  <STable
    v-bind="{ data }"
    :header-data="servicesHeaderData"
    :title="$t('services')"
    :subtitle="$t('services_count', { count: 20 })"
  >
    <template v-slot:id="{ row: data }">
      {{ data?.id }}
    </template>
    <template v-slot:merchant="{ row: data }">
      {{ data?.merchant?.name }}
    </template>
    <template v-slot:nameOfService="{ row: data }">
      {{ data?.nameOfService }}
    </template>
    <template v-slot:serviceType="{ row: data }">
      {{ data?.serviceType }}
    </template>
    <template v-slot:percent="{ row: data }">
      <span>{{ data?.percent }}</span>
      <span>%</span>
    </template>
    <template v-slot:deadline="{ row: data }">
      {{ parseDate(data?.deadline) }}
    </template>
    <template v-slot:benefitingResidents="{ row: data }">
      <div class="d-flex align-items-center">
        <inline-svg
          src="/assets/loyalty/services/building.svg"
          class="d-inline-block me-1"
        />
        {{ data?.benefitingResidents }}
      </div>
    </template>
    <template v-slot:action>
      <el-dropdown
        class="d-flex justify-content-center"
        trigger="click"
        placement="bottom-end"
      >
        <div>
          <button class="btn btn-active-light w-25px h-25px p-0">
            <inline-svg
              src="/assets/ona/svg/dots-vertical.svg"
              class="text-2x"
            />
          </button>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item class="border-b">
              <div class="d-flex align-items-center">
                <inline-svg
                  src="/assets/icons/loyalty/arrow-swap-horizontal.svg"
                  class="text-2x d-inline-block me-2"
                />
                <span>{{ $t("moderation") }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item class="border-b">
              <inline-svg
                src="/assets/icons/loyalty/check.svg"
                class="text-2x d-inline-block me-2"
              />
              <span>{{ $t("distribute") }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template #footerLeft>
      <STableLabels :labels="tableLabels" />
    </template>
  </STable>
</template>

<script setup lang="ts">
import { ref } from "@vue/runtime-core";

import { useMounted } from "@/composables/useMounted";
import { parseDate } from "@/helpers";
import STable from "@/stories/Common/Table/STable.vue";
import STableLabels from "@/stories/Common/TableLabels/STableLabels.vue";
import { servicesHeaderData, tableLabels } from "@/views/Services/data";

// ******* PLUGINS *******
const { mounted } = useMounted();

const data = ref([
  {
    id: 1,
    merchant: {
      name: "BeFit Fitness and Wellness",
    },
    category: {
      id: 1,
      name: "Фитнес центр",
    },
    nameOfService: "8 марта - Международный женский день",
    serviceType: "Скидка",
    percent: 1,
    deadline: "2022-10-11T05:08:53+0000",
    benefitingResidents: 10,
  },
]);
</script>

<!--<style scoped></style>-->
