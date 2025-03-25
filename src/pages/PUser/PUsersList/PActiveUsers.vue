<template>
  <div>
    <div class="global-breadcrumb">
      <SBreadcrumb :routes="routes" />
    </div>
    <Teleport v-if="mounted" to="#topbar-title">
      {{ $t("menus.active_participants") }}
    </Teleport>
    <CUserListTable
      v-bind="{ filters }"
      title="menus.active_participants"
      subtitle="menus.participants"
      :data="activeUsers"
      :header-data="
        useRoleManagement('edit', ['responsible_person'])
          ? usersHeaderData
          : usersHeaderData.slice(0, -1)
      "
      :fetch-url="`/api/v2/participants/participantList/?deleted=false&active=true${
        isResponsiblePerson ? '&my_participants=true' : ''
      }`"
      statusKey="active"
      :statusColors="{ true: 'green', false: 'gray' }"
      active
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";

import { useMounted } from "@/composables/useMounted";
import useParticipantFilter from "@/composables/useParticipantFilter";
import useRoleManagement from "@/composables/useRoleManagement";
import CUserListTable from "@/pages/PUser/components/CUserListTable.vue";
import { activeUsers, usersHeaderData } from "@/pages/PUser/data";
import SBreadcrumb from "@/stories/Common/BreadCrumb/SBreadcrumb.vue";

const { filters } = useParticipantFilter();
const { mounted } = useMounted();

const routes = computed(() => {
  return [
    {
      name: "main",
      route: "/",
      link: false,
    },
    {
      name: "menus.active_participants",
      route: "/",
      link: false,
    },
  ];
});

const store = useStore();

const currentUserRole = computed(() => store.state.AuthModule?.user?.type);

const isResponsiblePerson = computed(() => {
  return currentUserRole.value === "responsible_person";
});
</script>
