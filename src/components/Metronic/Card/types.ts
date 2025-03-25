import { MTHWithDefaultClass } from "../helpers/types";

export interface MTCard extends MTHWithDefaultClass {
  title?: string;
  subTitle?: string;
  noToolbar?: boolean;
  header?: MTCardHeader;
  noHeader: boolean;
  body?: MTCardBody;
  footer?: MTCardFooter;
  noFooter: boolean;
  shadow: boolean;
}
export interface MTCardHeader extends MTHWithDefaultClass {
  title?: MTCardTitle;
  toolbar?: MTCardToolbar;
  noTitle: boolean;
  noToolbar: boolean;
}

export interface MTCardTitle extends MTHWithDefaultClass {
  title: string;
  titleClass?: string;
  subTitle?: string;
  subTitleClass?: string;
}

export interface MTCardToolbar extends MTHWithDefaultClass {}

export interface MTCardBody extends MTHWithDefaultClass {
  scroll: boolean;
}

export interface MTCardFooter extends MTHWithDefaultClass {}
