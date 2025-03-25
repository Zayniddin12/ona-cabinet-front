import i18n from "@/core/plugins/i18n";

const { t } = i18n.global;

export const servicesHeaderData = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "participant",
    columnLabel: "participant",
  },
  {
    columnName: "akt_number",
    columnLabel: "akt_ID",
  },

  {
    columnName: "akt_date",
    columnLabel: "akt_date",
  },

  {
    columnName: "action",
    columnLabel: "actions",
  },
];

export const tableLabels = [
  {
    color: "green",
    title: t("active"),
  },
  {
    color: "grey",
    title: t("inactive"),
  },
];
