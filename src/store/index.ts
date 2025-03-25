import { createStore } from "vuex";
import { config } from "vuex-module-decorators";

import AuthModule from "@/store/modules/AuthModule";
import BodyModule from "@/store/modules/BodyModule";
import BreadcrumbsModule from "@/store/modules/BreadcrumbsModule";
import ConfigModule from "@/store/modules/ConfigModule";
import GlobalModule from "@/store/modules/GlobalModule";
import ParticipantsModule from "@/store/modules/ParticipantsModule";
import ProgramModule from "@/store/modules/ProgramModule";
import ThemeModeModule from "@/store/modules/ThemeModeModule";

config.rawError = true;

const store = createStore({
  modules: {
    AuthModule,
    BodyModule,
    BreadcrumbsModule,
    ConfigModule,
    ThemeModeModule,
    ParticipantsModule,
    GlobalModule,
    ProgramModule,
  },
});

export default store;
