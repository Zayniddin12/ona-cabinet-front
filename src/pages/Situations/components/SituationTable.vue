<template>
  <div>
    <STable
      v-bind="{ data, total: 18 }"
      :header-data="servicesHeaderData"
      :title="$t('menus.situations')"
      class="main-table user-table"
      subtitleCount="125"
      :subtitle="$t('menus.situationsCount')"
    >
      <template #afterSearch>
        <SButton
          variant="primary"
          text="menus.add_new"
          @click="$emit('add')"
          class="ms-6"
        >
          <template #pre-icon>
            <img src="/assets/svg/buttons/plus.svg" alt="plus" />
          </template>
        </SButton>
      </template>
      <template v-slot:id="{ row: data }">
        {{ data?.id }}
      </template>
      <template v-slot:merchant="{ row: data }">
        <WordHighlighter :query="$route?.query?.search || ''">
          {{ data?.merchant?.name }}
        </WordHighlighter>
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
      <template v-slot:action="{ row: data }">
        <el-dropdown
          class="d-flex justify-content-end user-table__action-dropdown"
          trigger="click"
          placement="bottom-end"
        >
          <div>
            <button class="btn btn-active-light w-25px h-25px p-0">
              <inline-svg
                src="/assets/ona/svg/dots-vertical.svg"
                class="text-2x dot"
              />
            </button>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item class="border-b" @click="editOption(data)">
                <div
                  class="d-flex align-items-center user-table__edit-dropdown"
                >
                  <inline-svg
                    src="/assets/svg/buttons/edit.svg"
                    class="text-2x d-inline-block me-2 blackEdit"
                  />
                  <span class="edit-text">{{ $t("edit") }}</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                class="border-b delete user-table__trash-dropdown"
                @click="deleteOption"
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
</template>

<script setup lang="ts">
import { ref } from "@vue/runtime-core";
import WordHighlighter from "vue-word-highlighter";

import { parseDate } from "@/helpers";
import { servicesHeaderData } from "@/pages/Situations/data";
import SButton from "@/stories/Common/Button/SButton.vue";
import STable from "@/stories/Common/Table/STable.vue";

const emit = defineEmits(["delete", "edit"]);

function deleteOption() {
  emit("delete");
}

function editOption(data: any) {
  emit("edit", data);
}

const data = ref([
  {
    id: 1,
    merchant: {
      name: "Daromad turi",
    },
    serviceType: "Ko‘p tanlov",
  },
  {
    id: 2,
    merchant: {
      name: "Kasalligi",
    },
    serviceType: "Yagona tanlov",
  },
  {
    id: 3,
    merchant: {
      name: "Oila azosi nogironliklari",
    },
    serviceType: "Ko‘p tanlov",
  },
  {
    id: 4,
    merchant: {
      name: "Daromad darajasi",
    },
    serviceType: "Yagona tanlov",
  },
  {
    id: 5,
    merchant: {
      name: "Hayotiy vaziyat",
    },
    serviceType: "Ko‘p tanlov",
  },
  {
    id: 6,
    merchant: {
      name: "Bandlik",
    },
    serviceType: "Yagona tanlov",
  },
  {
    id: 7,
    merchant: {
      name: "Oilaviy ahvol",
    },
    serviceType: "Yagona tanlov",
  },
]);
</script>
