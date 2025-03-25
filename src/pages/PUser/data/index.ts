import i18n from "@/core/plugins/i18n";
import { moneyMask } from "@/helpers";
import { IOption, IRegion } from "@/types";
import { IParticipantsFilterItem } from "@/types/participants";
import { IProgram } from "@/types/programs";

const { t } = i18n.global;

export const statistics = [
  {
    icon: "/assets/icons/fake/diploma.svg",
    number: 123,
    title: "Oliy ma’lumotlilar ma’lumotlilar ma’lumotlilar",
  },
  {
    icon: "/assets/icons/fake/diploma.svg",
    number: 123,
    title: "Oliy ma’lumotlilar",
  },
  {
    icon: "/assets/icons/fake/diploma.svg",
    number: 123,
    title: "Oliy ma’lumotlilar",
  },
  {
    icon: "/assets/icons/fake/diploma.svg",
    number: 123,
    title: "Oliy ma’lumotlilar",
  },
  {
    icon: "/assets/icons/fake/diploma.svg",
    number: 123,
    title: "Oliy ma’lumotlilar",
  },
];
export const usersHeaderData = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "full_name",
    columnLabel: "userTable.userName",
    sortEnabled: true,
  },
  {
    columnName: "birth_date",
    columnLabel: "userTable.born",
    sortEnabled: true,
  },
  {
    columnName: "point",
    columnLabel: "userTable.grade",
    sortEnabled: true,
  },
  {
    columnName: "living_region",
    columnLabel: "userTable.region",
    sortEnabled: true,
  },
  {
    columnName: "sickness_count",
    columnLabel: "userTable.illness",
    sortEnabled: true,
  },
  {
    columnName: "actions",
    columnLabel: "actions",
  },
];

export const usersChangesHeaderData = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "field",
    columnLabel: "field",
  },
  {
    columnName: "old_value",
    columnLabel: "old_value",
  },
  {
    columnName: "new_value",
    columnLabel: "new_value",
  },
];
export const usersRecentChangesHeaderData = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "userName",
    columnLabel: "userTable.changed_user_name",
    sortEnabled: true,
  },
  {
    columnName: "grade",
    columnLabel: "userTable.grade",
    sortEnabled: true,
  },
  {
    columnName: "time",
    columnLabel: "userTable.change_time",
    sortEnabled: true,
  },
  {
    columnName: "responsible_person",
    columnLabel: "menus.responsible_people",
  },
  {
    columnName: "status",
    columnLabel: "userTable.status",
    sortEnabled: true,
  },
  {
    columnName: "actions",
    columnLabel: "actions",
  },
];
export const activeUsers = [
  {
    id: "1",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    born: "26-Noyabr, 1985-yil",
    grade: "41",
    region: "Toshkent viloyati",
    illness: "Mavjud",
    is_active: true,
    image: "/assets/ona/image/fake_image.png",
  },
  {
    id: "2",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    born: "26-Noyabr, 1985-yil",
    grade: "41",
    region: "Toshkent viloyati",
    illness: "Mavjud",
    is_active: true,
    image: "/assets/ona/image/fake_image.png",
  },
  {
    id: "3",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    born: "26-Noyabr, 1985-yil",
    grade: "41",
    region: "Toshkent viloyati",
    illness: "Mavjud",
    is_active: true,
    image: "/assets/ona/image/fake_image.png",
  },
  {
    id: "4",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    born: "26-Noyabr, 1985-yil",
    grade: "41",
    region: "Toshkent viloyati",
    illness: "Mavjud",
    is_active: true,
    image: "/assets/ona/image/fake_image.png",
  },
  {
    id: "5",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    born: "26-Noyabr, 1985-yil",
    grade: "41",
    region: "Toshkent viloyati",
    illness: "Mavjud",
    is_active: true,
    image: "/assets/ona/image/fake_image.png",
  },
  {
    id: "6",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    born: "26-Noyabr, 1985-yil",
    grade: "41",
    region: "Toshkent viloyati",
    illness: "Mavjud",
    is_active: true,
    image: "/assets/ona/image/fake_image.png",
  },
  {
    id: "7",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    born: "26-Noyabr, 1985-yil",
    grade: "41",
    region: "Toshkent viloyati",
    illness: "Mavjud",
    is_active: true,
    image: "/assets/ona/image/fake_image.png",
  },
  {
    id: "8",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    born: "26-Noyabr, 1985-yil",
    grade: "41",
    region: "Toshkent viloyati",
    illness: "Mavjud",
    is_active: true,
    image: "/assets/ona/image/fake_image.png",
  },
  {
    id: "9",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    born: "26-Noyabr, 1985-yil",
    grade: "41",
    region: "Toshkent viloyati",
    illness: "Mavjud",
    is_active: true,
    image: "/assets/ona/image/fake_image.png",
  },
  {
    id: "10",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    born: "26-Noyabr, 1985-yil",
    grade: "41",
    region: "Toshkent viloyati",
    illness: "Mavjud",
    is_active: true,
    image: "/assets/ona/image/fake_image.png",
  },
];
export const userRecentChanges = [
  {
    id: "1",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    time: "26-Noyabr, 1985-yil",
    grade: "41",
    responsible_person: "Toshkent viloyati",
    status: "changed",
    image: "/assets/ona/image/fake_image.png",
  },
  {
    id: "1",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    time: "26-Noyabr, 1985-yil",
    grade: "41",
    responsible_person: "Toshkent viloyati",
    status: "created",
    image: "/assets/ona/image/fake_image.png",
  },
  {
    id: "1",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    time: "26-Noyabr, 1985-yil",
    grade: "41",
    responsible_person: "Toshkent viloyati",
    status: "changed",
    image: "/assets/ona/image/fake_image.png",
  },
  {
    id: "1",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    time: "26-Noyabr, 1985-yil",
    grade: "41",
    responsible_person: "Toshkent viloyati",
    status: "changed",
    image: "/assets/ona/image/fake_image.png",
  },
];
export const options: IOption[] = [
  {
    value: 0,
    label: "All",
  },
  {
    value: 2,
    label: "Car",
  },
  {
    value: 3,
    label: "Track",
  },
  {
    value: 4,
    label: "Logic left",
  },
  {
    value: 5,
    label: "Ya ha-ha-ha",
  },
];

export const filters = [
  {
    type: "input",
    fieldLabel: "Hududni tanlang",
    fieldPlaceholder: "Hududni tanlang",
    fieldValue: "",
  },
  {
    type: "select",
    fieldLabel: "Hududni tanlang",
    fieldPlaceholder: "Hududni tanlang",
    fieldValue: 0,
    options,
  },
  {
    type: "input",
    fieldLabel: "Hududni tanlang",
    fieldPlaceholder: "Hududni tanlang",
    fieldValue: "",
  },
  {
    type: "select",
    fieldLabel: "Hududni tanlang",
    fieldPlaceholder: "Hududni tanlang",
    fieldValue: 0,
    options,
  },
  {
    type: "input",
    fieldLabel: "Hududni tanlang",
    fieldPlaceholder: "Hududni tanlang",
    fieldValue: "",
  },
  {
    type: "select",
    fieldLabel: "Hududni tanlang",
    fieldPlaceholder: "Hududni tanlang",
    fieldValue: 0,
    options,
  },
  {
    type: "input",
    fieldLabel: "Hududni tanlang",
    fieldPlaceholder: "Hududni tanlang",
    fieldValue: "",
  },
  {
    type: "select",
    fieldLabel: "Hududni tanlang",
    fieldPlaceholder: "Hududni tanlang",
    fieldValue: 0,
    options,
  },
  {
    type: "input",
    fieldLabel: "Hududni tanlang",
    fieldPlaceholder: "Hududni tanlang",
    fieldValue: "",
  },
  {
    type: "select",
    fieldLabel: "Hududni tanlang",
    fieldPlaceholder: "Hududni tanlang",
    fieldValue: 0,
    options,
  },
];

export function activeParticipantsFilter({
  regionOptions,
  regionValue,
  programOptions,
  programValue,
  incomeGte,
  incomeLte,
}: {
  regionOptions: IRegion[];
  regionValue?: number;
  programOptions: IProgram[];
  programValue?: number;
  incomeGte?: string;
  incomeLte?: string;
}): IParticipantsFilterItem[] {
  return [
    // {
    //   type: "select",
    //   fieldLabel: t("status"),
    //   fieldPlaceholder: t("status"),
    //   fieldValue: 0,
    //   options: statusOptions,
    // },
    // {
    //   type: "select",
    //   fieldLabel: t("disabled_label"),
    //   fieldPlaceholder: t("disabled_label"),
    //   fieldValue: 0,
    //   options: disabledOptions,
    // },
    // {
    //   type: "select",
    //   fieldLabel: t("has_disabled_family_member"),
    //   fieldPlaceholder: t("has_disabled_family_member"),
    //   fieldValue: 0,
    //   options: disabledOptions,
    // },
    {
      type: "select",
      fieldLabel: t("live_region"),
      fieldPlaceholder: t("live_region"),
      paramKey: "living_region",
      fieldValue: regionValue,
      options: [{ id: 0, title: t("all"), code: 0 }, ...regionOptions],
      optionLabelKey: "title",
      optionValueKey: "id",
    },
    {
      type: "input",
      mask: moneyMask(),
      fieldLabel: t("from_monthly_income"),
      fieldPlaceholder: t("from_monthly_income"),
      paramKey: "monthly_income__gte",
      fieldValue: incomeGte,
    },
    {
      type: "input",
      mask: moneyMask(),
      fieldLabel: t("to_monthly_income"),
      fieldPlaceholder: t("to_monthly_income"),
      paramKey: "monthly_income__lte",
      fieldValue: incomeLte,
    },
    {
      type: "select",
      fieldLabel: t("menus.services"),
      fieldPlaceholder: t("menus.services"),
      paramKey: "programs",
      searchable: true,
      fieldValue: programValue,
      options: [{ id: 0, name: t("all") }, ...(programOptions ?? [])],
      optionLabelKey: "name",
      optionValueKey: "id",
    },
    // {
    //   type: "select",
    //   fieldLabel: t("employement"),
    //   fieldPlaceholder: t("employement"),
    //   fieldValue: 0,
    //   options: [{ id: 0, name: t("all") }],
    //   optionLabelKey: "name",
    //   optionValueKey: "id",
    // },
    // {
    //   type: "select",
    //   fieldLabel: t("payment_condition"),
    //   fieldPlaceholder: t("payment_condition"),
    //   fieldValue: 0,
    //   options,
    // },
    // {
    //   type: "select",
    //   fieldLabel: t("income_type"),
    //   fieldPlaceholder: t("income_type"),
    //   fieldValue: 0,
    //   options,
    // },
    // {
    //   type: "select",
    //   fieldLabel: t("life_situation"),
    //   fieldPlaceholder: t("life_situation"),
    //   fieldValue: 0,
    //   options,
    // },
    // {
    //   type: "input",
    //   fieldLabel: t("userTable.illness"),
    //   fieldPlaceholder: t("userTable.illness"),
    //   fieldValue: 0,
    //   options,
    // },
    // {
    //   type: "select",
    //   fieldLabel: t("disables_type"),
    //   fieldPlaceholder: t("disables_type"),
    //   fieldValue: 0,
    //   options,
    // },
    // {
    //   type: "select",
    //   fieldLabel: t("family_situations"),
    //   fieldPlaceholder: t("family_situations"),
    //   fieldValue: 0,
    //   options,
    // },
    // {
    //   type: "select",
    //   fieldLabel: t("education"),
    //   fieldPlaceholder: t("education"),
    //   fieldValue: 0,
    //   options,
    // },
    // {
    //   type: "select",
    //   fieldLabel: t("housing"),
    //   fieldPlaceholder: t("housing"),
    //   fieldValue: 0,
    //   options,
    // },
    // {
    //   type: "select",
    //   fieldLabel: t("responsible_person"),
    //   fieldPlaceholder: t("responsible_person"),
    //   fieldValue: 0,
    //   options,
    // },
  ];
}
