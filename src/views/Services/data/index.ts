import i18n from "@/core/plugins/i18n";

const { t } = i18n.global;

export const servicesHeaderData = [
  {
    columnName: "id",
    columnLabel: "№",
  },
  {
    columnName: "merchant",
    columnLabel: "merchant",
  },
  {
    columnName: "nameOfService",
    columnLabel: "name_of_service",
  },
  {
    columnName: "serviceType",
    columnLabel: "service_type",
  },
  {
    columnName: "percent",
    columnLabel: "percent",
  },
  {
    columnName: "deadline",
    columnLabel: "deadline",
  },
  {
    columnName: "benefitingResidents",
    columnLabel: "benefiting_residents",
  },
  {
    columnName: "action",
    columnLabel: "action",
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
