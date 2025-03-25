export interface TTableHeader {
  columnName: string;
  columnLabel: string;
}

export interface TMerchantCategory {
  id: number;
  name: string;
  icon?: string;
}

export interface IPointList {
  id: number;
  point: number;
  title: string;
}
[];
export interface TMerchant {
  id: number;
  name: string;
  logo: string;
  background_image?: string;
  available_services?: string[];
  category: TMerchantCategory;
}

export interface TErrors {
  status_code: 400 | 401 | 403 | 500 | 502;
  errors: {
    error: string;
    message: string;
  }[];
}

export interface TUser {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  avatar: string;
  email: string;
  phone: string;
  gender: "female" | "male";
  birth_date: string;
  pnfl: string;
  role: "cashier" | "superadmin" | "merchant" | "resident";
  thumbnail_avatar: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface IOption {
  label: string;
  value: number | boolean;
}

export interface IRegion {
  id: number;
  title: string;
  code?: number;
}

export interface IConditionOption {
  id: number;
  title: string;
}

export interface IConditionType {
  id: number;
  title: string;
  selection_type: number;
  options: IConditionOption[];
}

export interface ICondition {
  id: number;
}

export interface IDate {
  start?: string | null;
  end?: string | null;
}

export interface IObject {
  [key: string]: any;
}

export interface ISearchDateFilter {
  search?: string;
  date: IDate;
}
