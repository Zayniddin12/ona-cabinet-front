import i18n from "@/core/plugins/i18n";
import { IParticipantsFilterItem } from "@/types/participants";

const { t } = i18n.global;

export const moderatorsHeaderData = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "login",
    columnLabel: "login",
  },
  {
    columnName: "email",
    columnLabel: "email",
  },
  {
    columnName: "name",
    columnLabel: "fio",
  },
  {
    columnName: "see",
    columnLabel: "can_see",
  },
  {
    columnName: "edit",
    columnLabel: "can_edit",
  },
  {
    columnName: "admin",
    columnLabel: "is_admin",
  },
  {
    columnName: "actions",
    columnLabel: "actions",
  },
];
export const moderators = [
  {
    id: "1",
    login: "hamrayev",
    fullName: "Asadbek Tashmatov",
    email: "asadbekona1@gmail.com",
    can_view: true,
    can_edit: true,
    admin: true,
    is_active: true,
  },
  {
    id: "1",
    login: "hamrayev",
    fullName: "Asadbek Tashmatov",
    email: "asadbekona1@gmail.com",
    can_view: true,
    can_edit: true,
    admin: true,
    is_active: false,
  },
  {
    id: "1",
    login: "hamrayev",
    fullName: "Asadbek Tashmatov",
    email: "asadbekona1@gmail.com",
    can_view: true,
    can_edit: true,
    admin: true,
    is_active: true,
  },
  {
    id: "1",
    login: "hamrayev",
    fullName: "Asadbek Tashmatov",
    email: "asadbekona1@gmail.com",
    can_view: true,
    can_edit: true,
    admin: true,
    is_active: true,
  },
  {
    id: "1",
    login: "hamrayev",
    fullName: "Asadbek Tashmatov",
    email: "asadbekona1@gmail.com",
    can_view: true,
    can_edit: true,
    admin: true,
    is_active: false,
  },
  {
    id: "1",
    login: "hamrayev",
    fullName: "Asadbek Tashmatov",
    email: "asadbekona1@gmail.com",
    can_view: true,
    can_edit: false,
    admin: true,
    is_active: false,
  },
  {
    id: "1",
    login: "hamrayev",
    fullName: "Asadbek Tashmatov",
    email: "asadbekona1@gmail.com",
    can_view: true,
    can_edit: true,
    admin: false,
    is_active: true,
  },
  {
    id: "1",
    login: "hamrayev",
    fullName: "Asadbek Tashmatov",
    email: "asadbekona1@gmail.com",
    can_view: true,
    can_edit: true,
    admin: false,
    is_active: false,
  },
  {
    id: "1",
    login: "hamrayev",
    fullName: "Asadbek Tashmatov",
    email: "asadbekona1@gmail.com",
    can_view: true,
    can_edit: true,
    admin: true,
    is_active: false,
  },
  {
    id: "1",
    login: "hamrayev",
    fullName: "Asadbek Tashmatov",
    email: "asadbekona1@gmail.com",
    can_view: true,
    can_edit: false,
    admin: false,
    is_active: false,
  },
];

export const filters: IParticipantsFilterItem = [
  {
    type: "select",
    paramKey: "is_active",
    fieldLabel: t("active_or_inactive"),
    fieldPlaceholder: t("active_or_inactive"),
    fieldValue: undefined,
    optionLabelKey: "label",
    optionValueKey: "value",
    options: [
      {
        value: undefined,
        label: t("all"),
      },
      {
        value: "true",
        label: t("active"),
      },
      {
        value: "false",
        label: t("in_active"),
      },
    ],
  },
  {
    type: "select",
    paramKey: "type",
    fieldLabel: t("moderators_type"),
    fieldPlaceholder: t("moderators_type"),
    fieldValue: undefined,
    optionLabelKey: "label",
    optionValueKey: "value",
    options: [
      {
        value: undefined,
        label: t("all"),
      },
      {
        value: "user",
        label: t("user"),
      },
      {
        value: "superadmin",
        label: t("superadmin"),
      },
      {
        value: "moderator",
        label: t("moderator"),
      },
      {
        value: "admin",
        label: t("admin"),
      },
    ],
  },
];

export const labels = [
  {
    title: "active",
    color: "green",
  },
  {
    title: "inactive",
    color: "grey",
  },
];

export const roleOptions = [
  {
    value: "user",
    label: t("observer"),
  },
  {
    value: "moderator",
    label: t("moderator"),
  },
  {
    value: "admin",
    label: t("admin"),
  },
];

export const roleSuperAdminOptions = [
  {
    value: "user",
    label: t("observer"),
  },
  {
    value: "moderator",
    label: t("moderator"),
  },
  {
    value: "admin",
    label: t("admin"),
  },
  {
    value: "superadmin",
    label: t("super_admin"),
  },
  {
    value: "responsible_person",
    label: t("responsible_person"),
  },
];
