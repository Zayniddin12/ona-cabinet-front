import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

import { Actions, Mutations } from "@/store/enums/StoreEnums";

export interface StoreInfo {
  classes: {
    header?: Array<string>;
    headerContainer?: Array<string>;
    headerMobile?: Array<string>;
    headerMenu?: Array<string>;
    aside?: Array<string>;
    asideMenu?: Array<string>;
    asideToggle?: Array<string>;
    toolbar?: Array<string>;
    toolbarContainer?: Array<string>;
    content?: Array<string>;
    contentContainer?: Array<string>;
    footerContainer?: Array<string>;
    sidebar?: Array<string>;
    pageTitle?: Array<string>;
  };
}

@Module
export default class BodyModule extends VuexModule implements StoreInfo {
  classes: { [key: string]: string[] } = {};

  /**
   * Get current page title
   * @returns string
   */
  get getClasses() {
    return (position: string | undefined) => {
      if (typeof position !== "undefined") {
        return this.classes[position];
      }
      return this.classes;
    };
  }

  @Mutation
  [Mutations.SET_CLASSNAME_BY_POSITION](payload: {
    position: string;
    className: string;
  }) {
    const { position, className } = payload;
    if (!this.classes[position]) {
      this.classes[position] = [];
    }
    this.classes[position].push(className);
  }

  @Action
  [Actions.ADD_BODY_CLASSNAME](className: string) {
    document.body.classList.add(className);
  }

  @Action
  [Actions.REMOVE_BODY_CLASSNAME](className: string) {
    document.body.classList.remove(className);
  }

  @Action
  [Actions.ADD_BODY_ATTRIBUTE](payload: {
    qualifiedName: string;
    value: string;
  }) {
    const { qualifiedName, value } = payload;
    document.body.setAttribute(qualifiedName, value);
  }

  @Action
  [Actions.REMOVE_BODY_ATTRIBUTE](payload: { qualifiedName: string }) {
    const { qualifiedName } = payload;
    document.body.removeAttribute(qualifiedName);
  }

  @Action
  [Actions.ADD_CLASSNAME](payload: { position: string; className: string }) {
    this.context.commit(Mutations.SET_CLASSNAME_BY_POSITION, payload);
  }
}
