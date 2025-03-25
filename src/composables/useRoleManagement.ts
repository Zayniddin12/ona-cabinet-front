import { computed, reactive } from "vue";
import { ReactiveVariable } from "vue/macros";
import { useStore } from "vuex";

type TRoles = undefined | "superadmin" | "moderator" | "admin" | "user";

export default function useRoleManagement(
  actionName?: TRoles,
  customRoles: TRoles = undefined
) {
  const store = useStore();

  const currentUserRole = computed(() => store.state.AuthModule.user.type);

  const managers = ["admin", "moderator"];

  const actions: ReactiveVariable<{ edit: string[]; add: string[] }> = reactive(
    {
      edit: managers,
      add: managers,
      upload: managers,
    }
  );

  if (currentUserRole.value === "superadmin") {
    return true;
  }

  return !customRoles
    ? actions[actionName as keyof typeof actions].includes(
        currentUserRole.value
      )
    : customRoles.includes(currentUserRole.value);
}
