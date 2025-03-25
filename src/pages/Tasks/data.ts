export const navLinks = [
  {
    title: "all",
    name: "AllTasks",
  },
  {
    title: "late",
    name: "LateTasks",
  },
  {
    title: "undone",
    name: "UndoneTasks",
  },
  {
    title: "done",
    name: "DoneTasks",
  },
];

export const AllTasksHeaderData = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "task_name",
    columnLabel: "task_name",
  },
  {
    columnName: "akt_number",
    columnLabel: "akt_number",
  },
  {
    columnName: "task_status",
    columnLabel: "task_status",
  },
  {
    columnName: "responsible_person",
    columnLabel: "responsible_person",
  },
  {
    columnName: "deadline",
    columnLabel: "deadline",
  },
  {
    columnName: "actions",
    columnLabel: "actions",
  },
];

export const breadcrumbs = [
  {
    name: "main",
    route: "/",
    link: false,
  },
  {
    name: "menus.tasks",
    route: "/dashboard/task/all",
    link: false,
  },
];
