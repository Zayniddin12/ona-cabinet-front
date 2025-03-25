import { computed, onBeforeMount, onBeforeUnmount, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { LocationQueryValue, useRoute } from "vue-router";
import { useStore } from "vuex";

import { formatMoneyDecimal } from "@/helpers";
import { activeParticipantsFilter } from "@/pages/PUser/data";
import { Actions } from "@/store/enums/StoreEnums";
import { IConditionOption, IConditionType } from "@/types";
import { IProgram } from "@/types/programs";

export default function () {
  interface IComputedCondition extends IConditionType {
    type: "condition";
    fieldLabel: string;
    fieldPlaceholder: string;
    selectType: 1 | 2; // 1 - single select, 2 - multiple select
    fieldValue: number | string | boolean | number[];
  }

  const store = useStore();
  const { t } = useI18n();
  const route = useRoute();

  onBeforeMount(() => {
    store.dispatch(Actions.FETCH_REGIONS);
    store.dispatch(Actions.FETCH_PROGRAMS, { params: { limit: 10 } });
    store.dispatch(Actions.FETCH_CONDITION_TYPE_LIST);
  });

  function getConditionValue(conditionType: IConditionType) {
    const conditionsQuery = route.query.conditions;

    if (!conditionsQuery) {
      return t("all");
    }

    // SINGLE SELECT
    if (conditionType.selection_type === 1) {
      // IF TYPE OF QUERY IS ARRAY
      if (Array.isArray(conditionsQuery)) {
        const convertedQuery = conditionsQuery.map(Number);

        return (
          conditionType.options.find((option: IConditionOption) =>
            convertedQuery?.some((q: number) => q === option.id)
          )?.id ?? t("all")
        );
      }

      // IF TYPE OF QUERY IS STRING
      else {
        return (
          conditionType.options.find(
            (option: IConditionOption) =>
              conditionsQuery && +conditionsQuery === option.id
          )?.id ?? t("all")
        );
      }
    }

    // MULTIPLE SELECT
    else {
      // IF TYPE OF QUERY IS ARRAY
      if (Array.isArray(conditionsQuery)) {
        const convertedQuery = conditionsQuery.map(Number);
        return conditionType.options
          .filter((option: IConditionOption) =>
            convertedQuery.includes(option.id)
          )
          .map((option: IConditionOption) => option.id);
      }

      // IF TYPE OF QUERY IS STRING
      else {
        return [
          conditionType.options.find(
            (option: IConditionOption) =>
              conditionsQuery && +conditionsQuery === option.id
          )?.id,
        ];
      }
    }
  }

  const conditions: Ref<IComputedCondition[]> = computed(() => {
    return store.state.GlobalModule.conditionTypes.map((i: IConditionType) => ({
      ...i,
      options: [{ id: 0, title: t("all") }, ...i.options],
      type: "condition",
      fieldLabel: i.title,
      fieldPlaceholder: i.title,
      fieldValue: getConditionValue(i),
      selectType: i.selection_type,
      optionLabelKey: "title",
      optionValueKey: "id",
    }));
  });

  function getStaticValue(
    paramKey: LocationQueryValue | LocationQueryValue[],
    returnType: "number" | "string" = "number"
  ) {
    const value = route.query[paramKey];

    if (!value) {
      return undefined;
    }

    return returnType === "number" ? +value : value;
  }

  const programOptions = computed(() => {
    const localOption = JSON.parse(
      localStorage.getItem("search-program") ?? "{}"
    );

    const options = [...store.state.ProgramModule.programs];

    if (
      localOption?.id &&
      !options.some((option: IProgram) => option?.id === localOption?.id)
    ) {
      options.unshift(localOption);
    }

    return options;
  });

  const filters = computed(() => {
    const gte = getStaticValue("monthly_income__gte", "string");
    const incomeGte = +gte ? formatMoneyDecimal(gte, 0) : "";
    const lte = getStaticValue("monthly_income__lte", "string");
    const incomeLte = +lte ? formatMoneyDecimal(lte, 0) : "";

    return [
      ...activeParticipantsFilter({
        regionOptions: store.state.GlobalModule.regions,
        programOptions: programOptions.value,
        regionValue: getStaticValue("living_region"),
        programValue: getStaticValue("programs"),
        incomeGte,
        incomeLte,
      }),
      ...conditions.value,
    ];
  });

  onBeforeUnmount(() => {
    localStorage.removeItem("search-program");
  });

  return { filters };
}
