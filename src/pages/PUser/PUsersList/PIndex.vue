<template>
  <div>
    <Teleport v-if="mounted" to="#header-toolbar">
      <CHeadSection v-if="currentUserRole !== 'superadmin'">
        <label for="switch">
          {{ $t("show_appends_to_me") }}
        </label>
        <ElSwitch
          id="switch"
          v-model="headSwitch"
          :model-value="isResponsiblePerson"
          :disabled="isResponsiblePerson"
          class="ml-2"
        />
      </CHeadSection>
    </Teleport>
    <div class="mb-5">
      <RouterView v-slot="{ Component }">
        <transition name="pageChange" mode="out-in">
          <div :key="$route.name" class="user-main-section">
            <component :is="Component" />
          </div>
        </transition>
      </RouterView>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import { useMounted } from "@/composables/useMounted";
import CHeadSection from "@/pages/PUser/components/CHeadSection.vue";

const router = useRouter();
const route = useRoute();
const store = useStore();

const { mounted } = useMounted();
const headSwitch = ref<boolean>(false);

watch(
  () => headSwitch.value,
  (newValue) => {
    const queryParams = newValue
      ? {
          ...route.query,
          my_participants: newValue,
        }
      : {};

    router.push({
      name: route?.name,
      query: queryParams,
    });
  }
);

const currentUserRole = computed(() => store.state.AuthModule.user.type);
onBeforeMount(() => {
  headSwitch.value = !!route.query?.my_participants;
});

const isResponsiblePerson = computed(() => {
  return currentUserRole.value === "responsible_person";
});

watch(
  () => isResponsiblePerson.value,
  (newValue) => {
    const queryParams = newValue
      ? {
          ...route.query,
          my_participants: newValue,
        }
      : {};

    router.push({
      name: route?.name,
      query: queryParams,
    });
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
.user-statistics {
  gap: 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}
</style>
