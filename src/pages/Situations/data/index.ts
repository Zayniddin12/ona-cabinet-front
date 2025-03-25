import i18n from "@/core/plugins/i18n";

const { t } = i18n.global;

export const servicesHeaderData = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "title",
    columnLabel: "title",
  },
  {
    columnName: "serviceType",
    columnLabel: "types",
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
