<template>
  <SUserMainCard
    v-if="
      info?.family_info ||
      info?.lifestyle ||
      info?.family_photo?.length ||
      info?.living_condition_files?.length
    "
    :title="`${info?.year} - ${$t('about_family')}`"
  >
    <template #actions>
      <div class="actions">
        <SButton variant="primary" @click="$emit('openEdit')">
          <img src="/assets/svg/buttons/edit.svg" alt="edit" />
        </SButton>
        <SButton variant="danger" @click="$emit('openDelete')">
          <img src="/assets/svg/buttons/trash.svg" alt="delete" />
        </SButton>
      </div>
    </template>
    <template #body>
      <div class="d-flex flex-column gap-7">
        <div class="info-card" v-if="info?.family_info">
          <p class="info-card__title">{{ $t("full_info_family") }}</p>
          <p class="info-card__subtitle">{{ info?.family_info }}</p>
        </div>
        <div v-if="info?.lifestyle" class="info-card">
          <p class="info-card__title">{{ $t("lifestyle") }}</p>
          <p class="info-card__subtitle">{{ info?.lifestyle }}</p>
        </div>
      </div>
      <div class="d-flex flex-column gap-7">
        <div v-if="info?.family_photo" class="info-card">
          <p class="info-card__title">{{ $t("family_photos") }}</p>
          <SFamilyImages
            v-bind="{ images: info?.family_photo }"
            @open="$emit('open', $event, info?.family_photo)"
          />
        </div>
        <div
          class="info-card family-status"
          v-if="info?.living_condition_files"
        >
          <p class="info-card__title">{{ $t("lifestyle_conditions") }}</p>
          <SFamilyImages
            v-bind="{ images: info?.living_condition_files }"
            @open="$emit('open', $event, info?.living_condition_files)"
          />
          <!--          <SUserDoc-->
          <!--            v-for="(item, index) in user?.living_condition_files"-->
          <!--            :key="index"-->
          <!--            :file="item"-->
          <!--          />-->
        </div>
      </div>
      <div v-for="(item, index) in list" :key="index" class="info-card">
        <p class="info-card__title">{{ item?.type?.title }}</p>
        <p class="info-card__subtitle">{{ item?.title }}</p>
      </div>
    </template>
  </SUserMainCard>
</template>

<script setup lang="ts">
import { computed } from "vue";

import SUserMainCard from "@/pages/PUser/Single/components/Cards/UserMainCard/SUserMainCard.vue";
import SFamilyImages from "@/pages/PUser/Single/components/Family/SFamilyImages.vue";
import { IFamilyInfo, IPerson } from "@/pages/PUser/types/participant";
import SButton from "@/stories/Common/Button/SButton.vue";

interface Props {
  user: IPerson;
  info: IFamilyInfo;
}

const props = withDefaults(defineProps<Props>(), {});
defineEmits(["openEdit", "openDelete"]);

const list = computed(() => {
  let innerList: any = [];

  props.user?.conditions?.forEach((el: any) => {
    if (el?.type?.place === "MAIN_ADDITIONAL_INFOS") {
      innerList.push(el);
    }
  });
  return innerList;
});
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.info-card {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 8px;

  &__title {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #a2abbe;
  }

  &__subtitle {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #1c1f20;
    white-space: pre-line;
  }
}
</style>
