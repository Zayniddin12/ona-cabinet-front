import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

import ApiService from "@/core/services/ApiService";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import { ICondition, IConditionType, IRegion } from "@/types";

export interface Global {
  regions: IRegion[];
  conditionTypes: IConditionType[];
  conditions: ICondition[];
}

@Module
export default class GlobalModule extends VuexModule implements Global {
  regions: IRegion[] = [];
  conditionTypes: IConditionType[] = [];
  conditions: ICondition[] = [];

  @Mutation
  [Mutations.SET_REGIONS](payload: IRegion[]) {
    this.regions = payload;
  }

  // MUTATIONS
  @Mutation
  [Mutations.SET_CONDITION_TYPES](payload: IConditionType[]) {
    this.conditionTypes = payload;
  }

  @Mutation
  [Mutations.SET_CONDITIONS](payload: ICondition[]) {
    this.conditions = payload;
  }

  @Action
  [Actions.FETCH_CONDITION_LIST](type: number) {
    return new Promise((resolve, reject) => {
      ApiService.get(`/api/v2/main/ConditionList?type=${type}`)
        .then(({ data }) => {
          resolve(data.results);
        })
        .catch(({ response }) => {
          reject(response);
          this.context.commit(Mutations.SET_ERROR, response.data.errors);
        });
    });
  }

  @Action
  [Actions.FETCH_CONDITION_TYPE_LIST]() {
    return ApiService.get("api/v2/main/ConditionTypeList")
      .then(({ data }) => {
        this.context.commit(Mutations.SET_CONDITION_TYPES, data.results);
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.errors);
      });
  }

  @Action
  [Actions.FETCH_REGIONS]() {
    return ApiService.get("api/v1/regions/search")
      .then(({ data }) => {
        this.context.commit(Mutations.SET_REGIONS, data.results);
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.errors);
      });
  }
}
