import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

import ApiService from "@/core/services/ApiService";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import { IProgram, IProgramResults } from "@/types/programs";

export interface Programs {
  programs: IProgramResults[];
  count: number;
}

@Module
export default class GlobalModule extends VuexModule implements Programs {
  programs = [] as IProgramResults[];
  count = 0 as number;

  @Mutation
  [Mutations.SET_PROGRAMS](payload: { data: IProgram; merge: boolean }) {
    const dataProgram: IProgramResults = payload.data?.results;
    if (payload.merge) {
      this.programs = [...this.programs, ...dataProgram];
    } else {
      this.programs = payload.data?.results;
    }
    this.count = payload.data?.count;
  }

  @Action
  [Actions.FETCH_PROGRAMS](payload: {
    params?: { [key: string]: string };
    config?: { merge: boolean };
  }) {
    return ApiService.query("api/v2/main/ProgramList", {
      params: payload.params,
    })
      .then(({ data }) => {
        this.context.commit(Mutations.SET_PROGRAMS, {
          data,
          merge: payload.config?.merge,
        });
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.errors);
      });
  }
}
