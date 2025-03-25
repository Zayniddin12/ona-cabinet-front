<template>
  <div>
    <SUserMainCard v-if="list?.length" :title="$t('conditions')">
      <template #body>
        <div v-for="(item, index) in list" :key="index" class="info-card">
          <p class="info-card__title">{{ item?.type?.title }}</p>
          <p class="info-card__subtitle">{{ item?.title }}</p>
        </div>
      </template>
    </SUserMainCard>

    <SUserMainCard v-else :title="$t('conditions')">
      <template #body>
        <div class="odd dataTables_empty col-span-2 w-100">
          <img src="/assets/ona/image/no-data.svg" alt="" class="mb-7" />
          <p class="dataTables_empty-title">
            {{ $t("result_not_exists") }}
          </p>
          <p class="dataTables_empty-text">
            {{ $t("data_not_found") }}
          </p>
        </div>
      </template>
    </SUserMainCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import { useParticipant } from "@/pages/PUser/composables/UserParticipant";
import SUserMainCard from "@/pages/PUser/Single/components/Cards/UserMainCard/SUserMainCard.vue";
import { Actions } from "@/store/enums/StoreEnums";

const { participant } = useParticipant();

const store = useStore();

const route = useRoute();

onMounted(() => {
  store.dispatch(Actions.FETCH_PARTICIPANT_SINGLE, route.params.id);
});

const list = computed(() => {
  let innerList: any = [];

  participant.value?.conditions?.forEach((el: any) => {
    if (el?.type?.place === "DEFAULT") {
      innerList.push(el);
    }
  });
  return innerList;
});
</script>

<style lang="scss" scoped>
.info-card {
  display: flex;
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

.dataTables_empty {
  height: 350px !important;
  width: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  img {
    margin-bottom: 16px;
  }

  &-title {
    font-weight: 600;
    font-size: 20px;
    line-height: 23px;
    text-align: center;
    color: #191e36;
    margin-bottom: 12px;
  }

  &-text {
    font-weight: 500;
    font-size: 14px;
    line-height: 140%;
    color: #191e36;
    opacity: 0.7;
    max-width: 400px;
  }
}

.col-span-2 {
  grid-column: span 2;
}
</style>
