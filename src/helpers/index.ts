import dayjs from "dayjs";
import { parsePhoneNumber } from "libphonenumber-js";
import { useToast } from "vue-toastification";

import i18n from "@/core/plugins/i18n";
import router from "@/router";
import { IObject, TErrors } from "@/types";

const { t } = i18n.global;

export function formatNumber(number: string | number) {
  return number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function minutesToHours(minutes: number) {
  return Math.round(minutes / 60);
}

export function parseDate(date: Date) {
  return dayjs(date).format("DD.MM.YYYY");
}

export function isPhone(value: string) {
  if (!value?.length) {
    return true;
  }
  const phoneNumber = parsePhoneNumber(value, "UZ");
  return phoneNumber.isValid();
}

export function handleError(errors: TErrors) {
  const toast = useToast();
  const errorMessage = t(errors?.errors[0]?.error || "Error");

  toast.error(errorMessage, {
    icon: {
      iconClass: "error-icon",
      iconTag: "div",
    },
  });
}

const timeouts: IObject = {};

const cTimeout = (key = "key") => {
  if (timeouts[key]) {
    clearTimeout(timeouts[key]);
    timeouts[key] = undefined;
  }
};

export const debounce = (key = "key", fn = () => {}, timeout = 500) => {
  const sTimeout = (key: string, fn: any, timeout: number) => {
    cTimeout(key);

    timeouts[key] = setTimeout(() => {
      try {
        fn();
      } catch (e) {
        console.log(e);
      }

      timeouts[key] = undefined;
    }, timeout);
  };

  return sTimeout(key, fn, timeout);
};

export function updateQueryParams(
  newQuery: IObject,
  clearBeforeUpdate = false
) {
  const currentRoute = router.currentRoute.value;

  const queryParams = { ...currentRoute.query, ...newQuery };

  function replaceRoute() {
    router.replace({ ...currentRoute, query: queryParams });
  }

  return new Promise((resolve, reject) => {
    if (clearBeforeUpdate) {
      router
        .replace({ ...currentRoute, query: {} })
        .then((res) => {
          replaceRoute();
          resolve(res);
        })
        .catch((err) => reject(err));
    } else {
      replaceRoute();
      resolve(router.currentRoute.value);
    }
  });
}

export const removeSpaces = (text: string) => {
  return text?.replace(/ /g, "");
};

export const calcTabIndex = (index: number, offset: number) => offset + index;

export function formatPhoneNumber(number: string) {
  const format = number
    ?.replace(/\D/g, "")
    .match(/(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
  return `+${format && format[1] ? format[1] : ""}
          ${format && format[2] ? format[2] : ""}
          ${format && format[3] ? format[3] : ""}
          ${format && format[4] ? format[4] : ""}
          ${format && format[5] ? format[5] : ""}`;
}

export function formatPhoneNumberInput(number: string) {
  const format = number
    ?.replace(/\D/g, "")
    .match(/(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
  return `${format && format[1] ? format[1] : ""} ${
    format && format[2] ? format[2] : ""
  } ${format && format[3] ? format[3] : ""} ${
    format && format[4] ? format[4] : ""
  }`;
}

export function formatCardNumber(number: string) {
  const firstFourNumber = number?.slice(0, 4);
  const secondFourNumber = number?.slice(4, 8);
  const thirdFourNumber = number?.slice(8, 12);
  const lastFourNumber = number?.slice(12, 16);

  return `${firstFourNumber} ${secondFourNumber} ${thirdFourNumber} ${lastFourNumber}`;
}

export function formatMoneyDecimal(number: any, fix = 2, option = "decimal") {
  let style: string;
  if (["USD", "RUB"].includes(option)) {
    style = "currency";
  } else if (["kilogram", "meter", "percent"].includes(option)) {
    style = "unit";
  } else {
    style = "";
  }

  const newStyle: string = style;
  const option2 = {
    newStyle, //  unit currency percent decimal
    [newStyle]: option,
    maximumFractionDigits: fix,
    minimumFractionDigits: fix,
  };
  return number
    ? new Intl.NumberFormat("ru-RU", option2).format(number)
    : "0,00";
}

export const formatDateTime = (date: string | Date) => {
  return dayjs(date).format("DD.MM.YYYY \n hh:mm");
};

export const formatDate = (date: string | Date) => {
  return dayjs(date).format("DD.MM.YYYY");
};
export const formatDateWithMonth = (date: string | Date) => {
  const day = dayjs(date).format("DD");
  const month = t(`months[${new Date(date).getMonth()}]`);
  const year = dayjs(date).format("YYYY-") + t("year");
  return `${day}-${month}, ${year}`;
};

export function moneyMask() {
  return [
    "#",
    "##",
    "###",
    "# ###",
    "## ###",
    "### ###",
    "# ### ###",
    "## ### ###",
    "### ### ###",
    "# ### ### ###",
    "## ### ### ###",
    "### ### ### ###",
    "# ### ### ### ###",
    "## ### ### ### ###",
    "### ### ### ### ###",
  ];
}

export function moneyMaskMln() {
  return ["#", "##", "###", "# ###", "## ###", "### ###", "# ### ###"];
}

export function isValidDate(date: string) {
  return dayjs(date, "DD.MM.YYYY", true).isValid();
}

export function replaceZero(value?: string | number | boolean | number[]) {
  return value === 0 ||
    !value ||
    (Array.isArray(value) && value.includes(0)) ||
    (typeof value !== "number" &&
      typeof value !== "boolean" &&
      value?.length === 0)
    ? undefined
    : value;
}

export function downloadFile(data: any, filename: string) {
  const blob = new Blob([data]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

export function customRuRule(choice: number) {
  if (choice === 0) {
    return 0;
  }
  const endsWithOne = choice % 10 === 1 && choice !== 11 && choice < 2000;

  const endsWithFew =
    (choice % 10 === 2 || choice % 10 === 3 || choice % 10 === 4) &&
    (choice < 10 || choice > 20) &&
    choice < 2000;

  if (endsWithOne) {
    return 1;
  }

  if (endsWithFew) {
    return 2;
  }

  return 3;
}

export function customEnRule(choice: number) {
  return Number(choice) === 1 ? 0 : 1;
}
