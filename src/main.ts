// Main demo style scss
import "./assets/sass/plugins.scss";
import "./assets/sass/style.scss";

import CKEditor from "@ckeditor/ckeditor5-vue";
//RTL version styles
// import "./assets/css/style.rtl.css";
import { createApp } from "vue";

import definePlugins from "@/plugins";

import App from "./App.vue";
import router from "./router/index";
import store from "./store";

const app = createApp(App);

app.use(store);
app.use(router);
app.use(CKEditor);
// Define your plugins inside @/plugins.ts. It is required for storybook support.
definePlugins(app);
app.mount("#app");
