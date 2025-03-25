<template>
  <div>
    <SUserMainCard :title="$t('responsible_person')">
      <template #body>
        <SFormGroup :label="$t('responsible_person')">
          <div class="responsible-person-block">
            <p class="responsible-person-block__title">
              {{ participant?.responsible_person?.name }}
            </p>
          </div>
        </SFormGroup>

        <div class="info-person">
          <i18n-t tag="p" class="info-person__text" keypath="responsible_text">
            <template #span>
              <span>{{ $t("responsible_text_link") }}</span>
            </template>
          </i18n-t>
        </div>

        <div v-if="useRoleManagement('add')" class="add-person">
          <p class="add-person__title">
            {{ $t("temporary_responsible_person") }}
          </p>
          <Transition name="fade" mode="out-in">
            <div :key="participant?.temporary_responsible_person">
              <div
                v-if="participant?.temporary_responsible_person?.id"
                class="add-person-block"
              >
                <p class="add-person-block__title">
                  {{ participant?.temporary_responsible_person?.name }}
                </p>
                <SButton
                  variant="danger"
                  :text="$t('delete')"
                  class="py-2"
                  @click="showDelete = true"
                />
              </div>
              <SButton v-else class="py-2" @click="showAdd = true">
                <div class="d-flex align-items-center gap-1">
                  <inline-svg src="/assets/ona/svg/plus.svg" />
                  {{ $t("add") }}
                </div>
              </SButton>
            </div>
          </Transition>
        </div>
      </template>
    </SUserMainCard>
    <SAddResponsiblePerson
      :show="showAdd"
      @close="showAdd = false"
      @submit="submitPerson"
      :loading="buttonLoading"
      v-bind="{ tempResponsiblePersons }"
    />

    <SDeleteTaskModal
      :show="showDelete"
      :title="$t('delete_temporary_responsible_person')"
      :text="$t('delete_responsible_person_text')"
      :loading="deleteButtonLoading"
      @fetch-more="fetchMore"
      @close="showDelete = false"
      @submit="deleteResponsible"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";

import useRoleManagement from "@/composables/useRoleManagement";
import ApiService from "@/core/services/ApiService";
import { useParticipant } from "@/pages/PUser/composables/UserParticipant";
import SUserMainCard from "@/pages/PUser/Single/components/Cards/UserMainCard/SUserMainCard.vue";
import SAddResponsiblePerson from "@/pages/PUser/Single/components/Responsible/SAddResponsiblePerson.vue";
import SDeleteTaskModal from "@/pages/PUser/Single/components/Tasks/SDeleteTaskModal.vue";
import { Actions } from "@/store/enums/StoreEnums";
import SButton from "@/stories/Common/Button/SButton.vue";
import SFormGroup from "@/stories/Form/FormGroup/SFormGroup.vue";

const { participant } = useParticipant();
const showAdd = ref(false);
const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const store = useStore();
const deleteButtonLoading = ref(false);
const showDelete = ref(false);
const form = ref({
  person: "",
});

const responsiblePersons = ref([]);

const success = ref(false);
const buttonLoading = ref(false);

function submitPerson(person: any) {
  buttonLoading.value = true;
  ApiService.patch(
    `api/v2/participants/participantUpdate/${route.params.id}/`,
    {
      temporary_responsible_person: person,
    }
  )
    .then(() => {
      store.dispatch(Actions.FETCH_PARTICIPANT_SINGLE, route.params.id);
      toast.success(t("successfully_edited"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      showAdd.value = false;
    })
    .finally(() => (buttonLoading.value = false));
}

const tempResponsiblePersons = computed(() =>
  responsiblePersons.value.filter((el: any) => {
    if (el?.id !== form.value.person) {
      return el;
    }
  })
);

onMounted(() => {
  // fetchModeratorList();
  fetchResponsiblePersonList();
  form.value.person = participant.value.responsible_person?.id;
});

watch(
  () => participant.value,
  () => {
    form.value.person = participant.value.responsible_person?.id;
  }
);

watch(
  () => form.value.person,
  () => {
    if (success.value) {
      ApiService.patch(
        `api/v2/participants/participantUpdate/${route.params.id}/`,
        {
          responsible_person: form.value.person,
        }
      ).then(() => {
        toast.success(t("successfully_edited"), {
          icon: {
            iconClass: "done-icon",
            iconTag: "div",
          },
        });
      });
    }
    if (form.value.person) {
      success.value = true;
    }
  }
);

// deleteResponsible

function deleteResponsible() {
  deleteButtonLoading.value = true;
  ApiService.patch(
    `api/v2/participants/participantUpdate/${route.params.id}/`,
    {
      temporary_responsible_person: null,
    }
  )
    .then(() => {
      store.dispatch(Actions.FETCH_PARTICIPANT_SINGLE, route.params.id);
      toast.success(t("successfully_removed"), {
        icon: {
          iconClass: "done-icon",
          iconTag: "div",
        },
      });
      showDelete.value = false;
    })
    .finally(() => (deleteButtonLoading.value = false));
}

const hasNext = ref(false);
const params = reactive({
  limit: 20,
  offset: 0,
});

// Responsible People
function fetchResponsiblePersonList(searchText?: string) {
  ApiService.query("api/v2/main/ResponsiblePersonList?active=true", {
    params: {
      ...params,
      search: searchText,
    },
  }).then(({ data }) => {
    responsiblePersons.value = searchText
      ? data?.results
      : [...responsiblePersons.value, ...(data?.results ?? [])];
    hasNext.value = !!data.next;
  });
}

function fetchMore(searchText?: string) {
  if (hasNext.value || searchText) {
    params.offset = searchText ? 0 : params.offset + 20;
    fetchResponsiblePersonList(searchText);
  }
}
</script>

<style scoped lang="scss">
.responsible-person-block {
  background: #f3f6f9;
  border-radius: 6px;
  padding: 13px 16px;

  &__title {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #1c1f20;
  }
}

.info-person {
  background: #f3f6f9;
  border-radius: 8px;
  padding: 15px 16px;
  margin-right: 28px;

  &__text {
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
    color: #a2abbe;
  }

  span {
    color: #1c1f20;
  }
}

.add-person {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;

  &__title {
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: #1c1f20;
  }

  &-block {
    background: #f3f6f9;
    border-radius: 8px;
    padding: 4px 4px 4px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__title {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: #1c1f20;
    }
  }
}
</style>
