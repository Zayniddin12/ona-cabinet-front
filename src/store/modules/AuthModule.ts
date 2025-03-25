import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import { IAuthLoginPayload, IUser, IUserAuthInfo } from "@/types/auth";

@Module
export default class AuthModule extends VuexModule implements IUserAuthInfo {
  errors = {};
  user = {} as IUser;
  isAuthenticated = !!JwtService.getToken();

  /**
   * Get current user object
   * @returns User
   */
  get currentUser(): IUser {
    return this.user;
  }

  /**
   * Verify user authentication
   * @returns boolean
   */
  get isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  /**
   * Get authentification errors
   * @returns array
   */
  get getErrors() {
    return this.errors;
  }

  @Mutation
  [Mutations.SET_ERROR](error) {
    this.errors = { ...error };
  }

  @Mutation
  [Mutations.SET_AUTH](user: any) {
    this.isAuthenticated = true;
    // this.user = user;
    // this.errors = {};
    JwtService.saveRefreshToken(user.refresh);
    JwtService.saveToken(user.access);
  }

  @Mutation
  [Mutations.SET_USER](user) {
    this.user = user;
  }

  @Mutation
  [Mutations.SET_PASSWORD](password) {
    this.user.password = password;
  }

  @Mutation
  [Mutations.PURGE_AUTH]() {
    this.isAuthenticated = false;
    this.user = {} as IUser;
    this.errors = [];
    JwtService.destroyToken();
  }

  @Action
  [Actions.LOGIN](credentials: IAuthLoginPayload) {
    return ApiService.post("api/v2/auth/login/", credentials)
      .then(({ data }) => {
        this.context.commit(Mutations.SET_AUTH, data);
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data);
      });
  }

  @Action
  [Actions.LOGOUT]() {
    this.context.commit(Mutations.PURGE_AUTH);
  }

  @Action
  [Actions.REGISTER](credentials) {
    this.context.commit(Mutations.SET_AUTH, {
      api_token: "secret-token",
      created_at: new Date().toISOString(),
      email: "admin@demo.com",
      email_verified_at: new Date().toISOString(),
      first_name: "John",
      id: 1,
      last_name: "Doe",
      updated_at: new Date().toISOString(),
    });
    // return ApiService.post("register", credentials)
    //   .then(({ data }) => {
    //     this.context.commit(Mutations.SET_AUTH, data);
    //   })
    //   .catch(({ response }) => {
    //     this.context.commit(Mutations.SET_ERROR, response.data.errors);
    //   });
  }

  @Action
  [Actions.FORGOT_PASSWORD](payload) {
    this.context.commit(Mutations.SET_ERROR, {});
    // return ApiService.post("forgot_password", payload)
    //   .then(() => {
    //     this.context.commit(Mutations.SET_ERROR, {});
    //   })
    //   .catch(({ response }) => {
    //     this.context.commit(Mutations.SET_ERROR, response.data.errors);
    //   });
  }

  @Action
  [Actions.VERIFY_AUTH]() {
    return new Promise((res) => {
      if (JwtService.getToken()) {
        ApiService.setHeader();

        ApiService.query("api/v2/main/GetProfile", {})
          .then(async ({ data }) => {
            await this.context.commit(Mutations.SET_USER, data);
            res(data);
          })
          .catch(async ({ response }) => {
            await this.context.commit(
              Mutations.SET_ERROR,
              response.data.errors
            );

            // await this.context.commit(Mutations.PURGE_AUTH);
            res(undefined);
          });
      } else {
        this.context.commit(Mutations.PURGE_AUTH);
        res(undefined);
      }
    });
  }
}
