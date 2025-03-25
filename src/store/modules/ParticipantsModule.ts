import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

import ApiService from "@/core/services/ApiService";
import { IPerson, IStatistic } from "@/pages/PUser/types/participant";
import { Actions, Mutations } from "@/store/enums/StoreEnums";

export interface Participant {
  participant: IPerson;
  participantList: IPerson[];
  statistics: IStatistic[];
}

@Module
export default class ParticipantsModule
  extends VuexModule
  implements Participant
{
  participant = {} as IPerson;
  participantList = [] as IPerson[];
  statistics = [] as IStatistic[];

  @Mutation
  [Mutations.SET_PARTICIPANT_SINGLE](payload: any) {
    this.participant = payload;
  }
  @Mutation
  [Mutations.SET_PARTICIPANT_LIST](payload: any) {
    if (payload?.merge) {
      return (this.participantList = [
        ...this.participantList,
        ...payload.results,
      ]);
    }

    if (payload?.search) {
      return (this.participantList = [
        ...payload.results,
        // ...this.participantList,
      ]);
    }

    this.participantList = payload?.results;
  }

  @Mutation
  [Mutations.SET_PARTICIPANT_STATISTICS](payload: IStatistic[]) {
    this.statistics = payload;
  }

  @Action
  [Actions.FETCH_PARTICIPANT_SINGLE](id: string) {
    return ApiService.get(`api/v2/participants/participantDetail/${id}`)
      .then(({ data }) => {
        this.context.commit(Mutations.SET_PARTICIPANT_SINGLE, data);
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.errors);
      });
  }
  @Action
  [Actions.FETCH_PARTICIPANT_LIST](params: any) {
    return ApiService.query(`/api/v2/participants/participantList/`, {
      params: params,
    })
      .then(({ data }) => {
        this.context.commit(Mutations.SET_PARTICIPANT_LIST, {
          results: data.results,
          merge: params?.merge,
          search: true,
        });
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.errors);
      });
  }
}
