<template>
  <div class="d-flex flex-column gap-7 mb-8">
    <div v-for="(info, idx) in familyInfos" :key="idx">
      <SSectionAboutFamily
        :user="participant"
        @open="openModal"
        @open-edit="openEditModal(info)"
        @open-delete="openDeleteModal(info)"
        :info="info"
      />
    </div>
    <SSectionDocs v-bind="{ user: participant }" />
    <SSectionAccordion v-bind="{ user: participant }" />
    <SFamilyLightbox
      v-bind="{ show }"
      :images="currentImages"
      @close="show = false"
      :active="activeSlide"
    />
    <CFamilyInfoEditModal
      :show="openEditFamilyInfoModal"
      :form="familyInfoForm"
      :familyInfo="familyInfo"
      @close="openEditFamilyInfoModal = false"
    />
    <SDeleteTaskModal
      title="about_family"
      :show="showDelete"
      @close="showDelete = false"
      @submit="deleteCondition"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

import ApiService from "@/core/services/ApiService";
import { familyInfoForm } from "@/pages/PUser/components/Add/data/forms";
import CFamilyInfoEditModal from "@/pages/PUser/components/Modals/CFamilyInfoEditModal.vue";
import { useParticipant } from "@/pages/PUser/composables/UserParticipant";
import SSectionAboutFamily from "@/pages/PUser/Single/components/Family/Sections/SSectionAboutFamily.vue";
import SSectionAccordion from "@/pages/PUser/Single/components/Family/Sections/SSectionAccordion.vue";
import SSectionDocs from "@/pages/PUser/Single/components/Family/Sections/SSectionDocs.vue";
import SFamilyLightbox from "@/pages/PUser/Single/components/Family/SFamilyLightbox.vue";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import { IFamilyInfo } from "@/pages/PUser/types/participant";

const { participant } = useParticipant();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const show = ref(false);
const openEditFamilyInfoModal = ref(false);
const showDelete = ref(false);
const activeSlide = ref(0);
const currentImages = ref([]);
const familyInfos = ref([]);
const familyInfo = ref<IFamilyInfo>();

function openModal(index: number, images: any[]) {
  activeSlide.value = index;
  currentImages.value = images;
  show.value = true;
}

function openEditModal(info: IFamilyInfo) {
  openEditFamilyInfoModal.value = true;
  familyInfo.value = info;
}

function openDeleteModal(info: IFamilyInfo) {
  showDelete.value = true;
  familyInfo.value = info;
}

function deleteCondition() {
  ApiService.delete(
    `api/v2/participants/participantFamilyInfoDelete/${familyInfo.value?.id}`
  )
    .then(() => {
      showDelete.value = false;
      getParticipantFamilyInfos();
      toast.success(t("successfully_removed"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
    })
    .catch(() => {
      showDelete.value = false;
      toast.error(t("error_send"), {
        icon: {
          iconClass: "error-icon",
          iconTag: "div",
        },
      });
    });
}

function getParticipantFamilyInfos() {
  ApiService.get(
    `api/v2/participants/participantFamilyInfo?participant=${route.params.id}&limit=20&offset=0`
  ).then((res) => {
    // eslint-disable-next-line no-console
    familyInfos.value = res.data?.results;
  });
}

onMounted(() => {
  getParticipantFamilyInfos();
});
</script>
