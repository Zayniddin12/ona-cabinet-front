export const RPHeaderData = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "name",
    columnLabel: "user",
  },
  {
    columnName: "started_date",
    columnLabel: "started_date",
  },
  {
    columnName: "end_date",
    columnLabel: "ended_date",
  },
  {
    columnName: "actions",
    columnLabel: "actions",
  },
];
export const NonActiveRPData = [
  {
    id: "1",
    userName: "Мусаев Хайрулла",
    userId: "ID: 000001",
    contract_type: "outsourced",
    average_daily: 2.5,
    average_weekly: 10,
    average_monthly: 60,
    care: 100,
    status: "nonactive",
    end_date: "2011/07/25",
  },
  {
    id: "2",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    contract_type: "outsourced",
    average_daily: 2.5,
    average_weekly: 10,
    average_monthly: 60,
    care: 100,
    end_date: "2011/07/25",

    status: "nonactive",
  },
  {
    id: "3",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    contract_type: "in_the_state",
    average_daily: 2.5,
    average_weekly: 10,
    average_monthly: 60,
    end_date: "2011/07/25",
    care: 100,
    status: "nonactive",
  },
  {
    id: "4",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    contract_type: "outsourced",
    average_daily: 2.5,
    average_weekly: 10,
    average_monthly: 60,
    care: 100,
    end_date: "2011/07/25",
    status: "nonactive",
  },
  {
    id: "5",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    contract_type: "in_the_state",
    average_daily: 2.5,
    average_weekly: 10,
    average_monthly: 60,
    care: 100,
    end_date: "2011/07/25",
    status: "nonactive",
  },
  {
    id: "6",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    contract_type: "outsourced",
    average_daily: 2.5,
    average_weekly: 10,
    average_monthly: 60,
    care: 100,
    end_date: "2011/07/25",
    status: "nonactive",
  },
];

export const CareRPData = [
  {
    id: "1",
    userName: "Мусаев Хайрулла",
    userId: "ID: 000001",
    illness: "available",
    region: "Toshkent viloyati",
    status: "active",
    birth_date: "2011/07/25",
    ijt: 15,
  },
  {
    id: "2",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    illness: "available",
    region: "Toshkent viloyati",
    status: "nonactive",
    birth_date: "2011/07/25",
    ijt: 23,
  },
  {
    id: "3",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    illness: "available",
    region: "Toshkent viloyati",
    status: "active",
    birth_date: "2011/07/25",
    ijt: 52,
  },
  {
    id: "4",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    illness: "available",
    region: "Navoiy viloyati",
    status: "nonactive",
    birth_date: "2011/07/25",
    ijt: 48,
  },
  {
    id: "5",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    illness: "not_available",
    region: "Sirdaryo viloyati",
    status: "nonactive",
    birth_date: "2011/07/25",
    ijt: 10,
  },
  {
    id: "6",
    userName: "Umarova Zulayхo Хursanboyevna",
    userId: "ID: 000001",
    illness: "available",
    region: "Qoraqalpog`iston Respublikasi",
    status: "nonactive",
    birth_date: "2011/07/25",
    ijt: 10,
  },
];

export const RPCareHeaderData = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "name",
    columnLabel: "userTable.userName",
    sortEnabled: true,
  },
  {
    columnName: "birthday",
    columnLabel: "userTable.born",
    sortEnabled: true,
  },
  {
    columnName: "ijt",
    columnLabel: "ijt",
    sortEnabled: true,
  },

  {
    columnName: "region",
    columnLabel: "region",
    sortEnabled: true,
  },
  {
    columnName: "illness",
    columnLabel: "illness",
    sortEnabled: true,
  },
  {
    columnName: "actions",
    columnLabel: "actions",
    sortEnabled: true,
  },
];

export const person = {
  full_name: "Umarova Zulayxo Xursanboyevna",
  userId: "000001",
  phone_number: "+998971835353",
  contract_type: "in_the_state",
  id: "5",
  average_daily: 2.5,
  average_weekly: 10,
  average_monthly: 60,
  care: 100,
  start_date: "2011/07/25",
  end_date: "2011/07/25",
  status: "nonactive",
};

export const navLinks = [
  {
    title: "hisCare",
    name: "RPCare",
  },
  {
    title: "activity",
    name: "RPActivity",
  },
];
