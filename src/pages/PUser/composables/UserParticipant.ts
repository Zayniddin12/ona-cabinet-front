import { computed } from "vue";
import { useStore } from "vuex";

export function useParticipant() {
  const store = useStore();

  const participant = computed(
    () => store.state.ParticipantsModule.participant
  );
  const participantPassport = computed(
    () =>
      `${participant.value.passport_serial} ${participant.value.passport_number} `
  );

  return {
    participant,
    participantPassport,
  };
}
