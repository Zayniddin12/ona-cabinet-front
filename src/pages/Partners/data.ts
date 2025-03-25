import { options } from "@/pages/PUser/data";

export const PartnersHeaderData = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "userName",
    columnLabel: "partner_name",
  },
  {
    columnName: "type",
    columnLabel: "partner_type",
  },
  {
    columnName: "amount",
    columnLabel: "amount_of_aid",
  },
  {
    columnName: "region",
    columnLabel: "userTable.region",
  },
  {
    columnName: "phone",
    columnLabel: "phone_number",
  },
  {
    columnName: "actions",
    columnLabel: "actions",
  },
];

export const PartnersData = [
  {
    id: "1",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    phone_number: "+998971835353",
    type: "physical",
    region: "Toshkent viloyati",
    amount_of_aid: 500000000,
    is_active: true,
  },
  {
    id: "2",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    phone_number: "+998971835353",
    type: "legal",
    region: "Toshkent viloyati",
    amount_of_aid: 500000000,
    is_active: false,
  },
  {
    id: "3",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    phone_number: "+998971835353",
    type: "legal",
    region: "Toshkent viloyati",
    amount_of_aid: 500000000,
    is_active: true,
  },
  {
    id: "4",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    phone_number: "+998971835353",
    type: "legal",
    region: "Toshkent viloyati",
    amount_of_aid: 500000000,
    is_active: false,
  },
  {
    id: "5",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    phone_number: "+998971835353",
    type: "legal",
    region: "Toshkent viloyati",
    amount_of_aid: 500000000,
    is_active: true,
  },
  {
    id: "6",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    phone_number: "+998971835353",
    type: "legal",
    region: "Toshkent viloyati",
    amount_of_aid: 500000000,
    is_active: true,
  },
];
export const partner = {
  full_name: "Umarova Zulayxo Xursanboyevna",
  id: "000001",
  phone_number: "+998971835353",
  amount_of_aid: 500000000,
  region: "Toshkent viloyati",
  type: "legal",
};

export const filters = [
  {
    type: "select",
    fieldLabel: "partner_type",
    fieldPlaceholder: "partner_type",
    fieldValue: 0,
    options,
  },
  {
    type: "select",
    fieldLabel: "region",
    fieldPlaceholder: "region",
    fieldValue: 0,
    options,
  },
];

export const addList = [
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
];

export interface TPartner {
  name_uz: string;
  name_ru: string;
  partner_id: number | null;
  type: number | null;
  id?: number | null;
  phone: string;
  amount: number | null;
  region: number | null;
}
