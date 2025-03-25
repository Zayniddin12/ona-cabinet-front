import "@/core/plugins/prismjs";
import "vue-toastification/dist/index.css";

import ElementPlus from "element-plus";
import Maska from "maska";
import { DatePicker } from "v-calendar";
import { App } from "vue";
import Toast from "vue-toastification";

import { initApexCharts } from "@/core/plugins/apexcharts";
import i18n from "@/core/plugins/i18n";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import ApiService from "@/core/services/ApiService";
import SCloseToast from "@/stories/Common/Toast/SCloseToast.vue";

export default function definePlugins(app: App): App {
  app.use(ElementPlus);

  //Toast Notification
  const options = {
    position: "top-right",
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    maxToasts: 3,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    icon: true,
    rtl: false,
    closeButton: SCloseToast,
  };
  app.use(Toast, options);

  ApiService.init(app);
  initApexCharts(app);
  initInlineSvg(app);
  initVeeValidate();

  app.component("TheDatePicker", DatePicker);
  app.use(i18n);
  app.use(Maska);

  return app;
}
