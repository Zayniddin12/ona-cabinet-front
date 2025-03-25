<template>
  <div class="partners">
    <STable :header-data="tableRow" :data="data">
      <template v-slot:id="{ row: data }"> {{ data.id }} </template>
      <template v-slot:nameOfPartner="{ row: data }">
        <SPartnerCard :item="data.nameOfPartner" />
      </template>
      <template v-slot:availableServices="{ row: data }">
        <SBadge
          class="partners-service"
          v-for="i in data.availableServices"
          :variant="
            i === 'cashback' ? 'blue' : i === 'discount' ? 'green' : 'yellow'
          "
          :key="i"
          has-icon
        >
          {{ i }}
        </SBadge>
      </template>
      <template v-slot:numberServices="{ row: data }">
        {{ data.numberServices }}
      </template>
      <template v-slot:dateRegister="{ row: data }">
        {{ moment(data.dateRegister).format("DD.MM.YYYY") }}
      </template>
      <template v-slot:action="{ row: data }">
        <el-dropdown trigger="click">
          <inline-svg
            class="action-dots"
            src="/assets/svg/common/actionDots.svg"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                class="border-b"
                @click="
                  $router.push(`/dashboard/partners/${data.nameOfPartner.slug}`)
                "
              >
                <inline-svg
                  class="dropdown-icon"
                  src="/assets/svg/common/eye.svg"
                />
                {{ $t("see") }}
              </el-dropdown-item>
              <el-dropdown-item class="border-b">
                <inline-svg
                  class="dropdown-icon"
                  src="/assets/svg/common/edit.svg"
                />
                {{ $t("edit") }}
              </el-dropdown-item>
              <el-dropdown-item>
                <inline-svg
                  class="dropdown-icon"
                  src="/assets/svg/common/trash.svg"
                />
                {{ $t("delete") }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template v-slot:afterSearch>
        <router-link to="/dashboard/partners/add">
          <SButton style="margin-left: 20px">{{ $t("add") }}</SButton>
        </router-link>
      </template>
    </STable>
  </div>
</template>
<script lang="ts" setup>
import moment from "moment";
import { useI18n } from "vue-i18n";

import SBadge from "@/stories/Common/Badge/SBadge.vue";
import SButton from "@/stories/Common/Button/SButton.vue";
import SPartnerCard from "@/stories/Common/Cards/PartnerCard/SPartnerCard.vue";
import STable from "@/stories/Common/Table/STable.vue";

const { t: $t } = useI18n();
const tableRow = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "nameOfPartner",
    columnLabel: $t("name_of_partners"),
  },
  {
    columnName: "availableServices",
    columnLabel: $t("available_services"),
  },
  {
    columnName: "numberServices",
    columnLabel: $t("number_of_services"),
  },
  {
    columnName: "dateRegister",
    columnLabel: $t("date_of_register"),
  },
  {
    columnName: "action",
    columnLabel: $t("action"),
  },
];
const data = [
  {
    id: 1,
    nameOfPartner: {
      avatar: "https://picsum.photos/40/40",
      name: "BeFit Fitness and Wellness",
      description: "Фитнес центр",
      slug: "befit_pro",
    },
    availableServices: ["cashback", "discount", "voucher"],
    numberServices: 2,
    dateRegister: new Date(),
  },
  {
    id: 2,
    nameOfPartner: {
      avatar: "https://picsum.photos/41/40",
      name: "BeFit Fitness and Wellness",
      description: "Фитнес центр",
      slug: "befit_pro",
    },
    availableServices: ["cashback", "voucher"],
    numberServices: 2,
    dateRegister: new Date(),
  },
  {
    id: 3,
    nameOfPartner: {
      avatar: "https://picsum.photos/40/42",
      name: "BeFit Fitness and Wellness",
      description: "Фитнес центр",
      slug: "befit_pro",
    },
    availableServices: ["cashback", "discount"],
    numberServices: 2,
    dateRegister: new Date(),
  },
];
</script>

<style lang="scss">
.partners {
  &-service:not(:last-child) {
    margin-right: 12px;
  }
}
</style>
