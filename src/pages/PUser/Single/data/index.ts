export const tabListUserSingle = [
  {
    id: 1,
    title: "main_details",
    path: "userMain",
  },
  {
    id: 2,
    title: "info_family",
    path: "userFamily",
  },
  {
    id: 3,
    title: "medic_conclusions",
    path: "userMedic",
  },
  {
    id: 4,
    title: "financial_assistance_user",
    path: "userHistorySupport",
  },
  {
    id: 5,
    title: "conditions",
    path: "userConditions",
  },
  {
    id: 6,
    title: "financial_assistance",
    path: "userFinancial",
  },
  {
    id: 7,
    title: "tasks",
    path: "userTasks",
  },
  {
    id: 8,
    title: "curator_comments",
    path: "userComments",
  },
  {
    id: 9,
    title: "responsible_person",
    path: "userResponsible",
  },
  {
    id: 10,
    title: "history_of_support_user",
    path: "userSupports",
  },
  {
    id: 11,
    title: "menus.contract",
    path: "userContract",
  },
];

export const user = {
  full_name: "Umarova Zulayxo Xursanboyevna",
  id: "000001",
  birthdate: "1970-01-15",
  phone: "998997747744",
  series: "AA 2560059",
  programs: [
    {
      id: 1,
      title: "Ayollar va bolalarni qo‘llab quvvatlash",
    },
    {
      id: 2,
      title: "Ta'lim grantlari",
    },
    {
      id: 3,
      title: "Muassasalar bilan hamkorlik",
    },
  ],
  ijt: 240,
};

export const userTasksHeaderData = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "title",
    columnLabel: "title_task",
  },
  {
    columnName: "akt",
    columnLabel: "akt_number",
  },
  {
    columnName: "status",
    columnLabel: "status_task",
  },
  {
    columnName: "responsible",
    columnLabel: "responsible_person",
  },
  {
    columnName: "deadline",
    columnLabel: "period",
  },
  {
    columnName: "actions",
    columnLabel: "actions",
  },
];

export const userCommentsHeaderData = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "comment",
    columnLabel: "comment",
  },
  {
    columnName: "commenter",
    columnLabel: "commenter",
  },
  {
    columnName: "date",
    columnLabel: "comment_date",
  },
  {
    columnName: "actions",
    columnLabel: "actions",
  },
];
