<template>
  <div class="d-flex flex-column gap-7" v-if="user.family_members?.length">
    <SFamilyAccordion
      v-for="(item, index) in user?.family_members"
      :key="index"
      :data="item"
      :active="index === active"
      @open="openAccordion(index)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import SFamilyAccordion from "@/pages/PUser/Single/components/Family/SFamilyAccordion.vue";
import { IPerson } from "@/pages/PUser/types/participant";

const active = ref(0);

function openAccordion(index: number) {
  if (index === active.value) {
    active.value = null;
  } else {
    active.value = index;
  }
}

interface Props {
  user: IPerson;
}

withDefaults(defineProps<Props>(), {});
</script>
