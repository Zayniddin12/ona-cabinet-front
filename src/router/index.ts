import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import JwtService from "@/core/services/JwtService";
import store from "@/store";
import { Actions, Mutations } from "@/store/enums/StoreEnums";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        component: () => import("@/pages/Dashboard/PDashboard.vue"),
      },
      {
        path: "/dashboard/participants",
        name: "Participants",
        component: () => import("@/pages/PUser/PUsersList/PIndex.vue"),
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        children: [
          {
            path: "/dashboard/participants/active",
            name: "ActiveParticipants",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () =>
              import("@/pages/PUser/PUsersList/PActiveUsers.vue"),
          },
          {
            path: "/dashboard/participants/in-active",
            name: "InActiveParticipants",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () =>
              import("@/pages/PUser/PUsersList/PInActiveUsers.vue"),
          },
          {
            path: "/dashboard/participants/archived",
            name: "ArchivedParticipants",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () =>
              import("@/pages/PUser/PUsersList/PArchivedUsers.vue"),
          },
        ],
      },

      {
        path: "/dashboard/participants/:id/edit",
        name: "ParticipantsEdit",
        meta: {
          roles: ["superadmin", "admin", "moderator", "responsible_person"],
        },
        component: () => import("@/pages/PUser/PEdit.vue"),
      },

      {
        path: "/dashboard/participants/add",
        name: "ParticipantsAdd",
        meta: {
          roles: ["superadmin", "admin", "moderator", "responsible_person"],
        },
        component: () => import("@/pages/PUser/PAdd.vue"),
      },
      {
        path: "/dashboard/participants/recent-changes",
        name: "RecentChanges",
        meta: {
          roles: ["superadmin", "admin", "moderator", "responsible_person"],
        },
        component: () => import("@/pages/PUser/PUsersList/PRecentChanges.vue"),
      },
      {
        path: "/dashboard/participants/recent-changes/:id",
        name: "RecentChangesSingle",
        meta: {
          roles: ["superadmin", "admin", "moderator", "responsible_person"],
        },
        component: () =>
          import("@/pages/PUser/PUsersList/PRecentChangesSingle.vue"),
      },
      {
        path: "/dashboard/participants/:id",
        name: "UserSingle",
        component: () => import("@/pages/PUser/Single/PIndex.vue"),
        redirect: { name: "userMain" },
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        children: [
          {
            path: "/dashboard/participants/:id/main",
            name: "userMain",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/PUser/Single/PMain.vue"),
          },
          {
            path: "/dashboard/participants/:id/family",
            name: "userFamily",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/PUser/Single/PFamily.vue"),
          },
          {
            path: "/dashboard/participants/:id/medic",
            name: "userMedic",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/PUser/Single/PMedic.vue"),
          },

          {
            path: "/dashboard/participants/:id/history-of-support",
            name: "userHistorySupport",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/PUser/Single/PHistorySupport.vue"),
          },

          {
            path: "/dashboard/participants/:id/conditions",
            name: "userConditions",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/PUser/Single/PConditions.vue"),
          },
          {
            path: "/dashboard/participants/:id/financial",
            name: "userFinancial",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/PUser/Single/PFinancial.vue"),
          },
          {
            path: "/dashboard/participants/:id/tasks",
            name: "userTasks",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/PUser/Single/PTasks.vue"),
          },
          {
            path: "/dashboard/participants/:id/responsible",
            name: "userResponsible",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/PUser/Single/PResponsible.vue"),
          },
          {
            path: "/dashboard/participants/:id/supports",
            name: "userSupports",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/PUser/Single/PSupports.vue"),
          },
          {
            path: "/dashboard/participants/:id/comments",
            name: "userComments",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/PUser/Single/PCurator.vue"),
          },
          {
            path: "/dashboard/participants/:id/contract",
            name: "userContract",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/PUser/Single/PContract.vue"),
          },
        ],
      },

      {
        path: "/dashboard/participants/:id/tasks/:task",
        name: "userTasksSingle",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        component: () => import("@/pages/PUser/Single/PTaskSingle.vue"),
      },
      //TASKS
      {
        path: "/dashboard/task",
        redirect: { name: "AllTasks" },
        name: "Task",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        component: () => import("@/pages/Tasks/PIndex.vue"),
        children: [
          {
            path: "all",
            name: "AllTasks",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/Tasks/Child/PAll.vue"),
          },
          {
            path: "late",
            name: "LateTasks",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/Tasks/Child/PLate.vue"),
          },
          {
            path: "undone",
            name: "UndoneTasks",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/Tasks/Child/PUndone.vue"),
          },
          {
            path: "done",
            name: "DoneTasks",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/Tasks/Child/PDone.vue"),
          },
        ],
      },

      //Responsible Person
      {
        path: "/responsible-person",
        name: "ResponsiblePerson",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        component: () => import("@/pages/PRPerson/PActive.vue"),
      },
      {
        path: "/responsible-person/nonactive",
        name: "NonActiveResponsiblePerson",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        component: () => import("@/pages/PRPerson/PNonActive.vue"),
      },
      {
        path: "/responsible-person/:id",
        name: "SingleResponsiblePerson",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        redirect: { name: "RPCare" },
        component: () => import("@/pages/PRPerson/PSingle.vue"),
        children: [
          {
            path: "care",
            name: "RPCare",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () => import("@/pages/PRPerson/Child/PRPersonCare.vue"),
          },
          {
            path: "activity",
            name: "RPActivity",
            meta: {
              roles: [
                "superadmin",
                "admin",
                "moderator",
                "user",
                "responsible_person",
              ],
            },
            component: () =>
              import("@/pages/PRPerson/Child/PRPersonActivity.vue"),
          },
        ],
      },

      // Programs

      {
        path: "/programs",
        name: "Programs",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        component: () => import("@/pages/Programs/PActive.vue"),
      },
      {
        path: "/programs/archived",
        name: "ArchivedPrograms",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        component: () => import("@/pages/Programs/PArchived.vue"),
      },
      {
        path: "/programs/:id",
        name: "ProgramSingle",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        component: () => import("@/pages/Programs/PSingle.vue"),
      },
      //SPONSORS

      {
        path: "/partners",
        name: "Partners",
        meta: {
          roles: ["superadmin", "admin", "moderator", "user"],
        },
        component: () => import("@/pages/Partners/PIndex.vue"),
      },
      {
        path: "/partners/:id",
        name: "PartnerSingle",
        meta: {
          roles: ["superadmin", "admin", "moderator", "user"],
        },
        component: () => import("@/pages/Partners/PSingle.vue"),
      },

      //Contracts

      {
        path: "/contracts",
        name: "Contracts",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        component: () => import("@/pages/Contracts/PActive.vue"),
      },
      {
        path: "/contracts/archived",
        name: "ContractsArchived",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        component: () => import("@/pages/Contracts/PArchived.vue"),
      },
      {
        path: "/contracts/:id",
        name: "ContractSingle",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        component: () => import("@/pages/Contracts/PSingle.vue"),
      },

      // Situtations
      {
        path: "/dashboard/situations",
        name: "Situations",
        meta: {
          roles: ["superadmin", "admin", "moderator", "user"],
        },
        component: () => import("@/pages/Situations/PIndex.vue"),
      },
      // Relative
      {
        path: "/dashboard/relative",
        name: "Relative",
        meta: {
          roles: ["superadmin", "admin", "moderator", "user"],
        },
        component: () => import("@/pages/Relative/PIndex.vue"),
      },
      // Relative
      {
        path: "/dashboard/conditions",
        name: "Condition",
        meta: {
          roles: ["superadmin", "admin", "moderator", "user"],
        },
        component: () => import("@/pages/Conditions/PIndex.vue"),
      },
      // Financiala AID
      {
        path: "/dashboard/financial",
        name: "Financial",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        component: () => import("@/pages/Financial/PIndex.vue"),
      },
      {
        path: "/dashboard/financial/:id",
        name: "FinancialId",
        meta: {
          roles: [
            "superadmin",
            "admin",
            "moderator",
            "user",
            "responsible_person",
          ],
        },
        component: () => import("@/pages/Financial/PSingle.vue"),
      },
      {
        path: "/dashboard/financialCreate",
        name: "financialCreate",
        meta: {
          roles: ["superadmin", "admin", "moderator", "responsible_person"],
        },
        component: () => import("@/pages/Financial/PCreate.vue"),
      },
      {
        path: "/dashboard/financialEdit",
        name: "financialEdit",
        meta: {
          roles: ["superadmin", "admin", "moderator", "responsible_person"],
        },
        component: () => import("@/pages/Financial/PEdit.vue"),
      },
      //   Moderators
      {
        path: "/dashboard/moderators",
        name: "Moderators",
        meta: {
          roles: ["superadmin", "admin", "moderator"],
        },
        component: () => import("@/pages/Moderators/PIndex.vue"),
      },
      //Type of supports
      {
        path: "/dashboard/type-of-supports",
        name: "TypeOfSupports",
        meta: {
          roles: ["superadmin", "admin", "moderator", "responsible_person"],
        },
        component: () => import("@/pages/TypeOfSupports/PIndex.vue"),
      },
      //   End

      /**
       * Partners
       */
      {
        path: "/dashboard/partners/all",
        meta: {
          roles: ["superadmin", "admin", "moderator", "user"],
        },
        component: () => import("@/views/Partners/PIndex.vue"),
      },
      {
        path: "/dashboard/partners/add",
        meta: {
          roles: ["superadmin", "admin", "moderator", "user"],
        },
        component: () => import("@/views/Partners/PAdd.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/components/page-layouts/LAuth.vue"),
    children: [
      {
        path: "/auth",
        name: "sign-in",
        meta: {
          roles: ["superadmin", "admin", "moderator", "user"],
        },
        component: () => import("@/pages/PLogin.vue"),
      },
    ],
  },

  {
    // the 404 route, when none of the above matches
    path: "/404",
    name: "404",
    component: () => import("@/views/crafted/authentication/Error404.vue"),
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/crafted/authentication/Error500.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const scrollTop = () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
};
router.beforeEach(async (to, from, next) => {
  if (["404", "403", "500"].includes((to.name || "").toString())) {
    next();
  }

  if (typeof store.state.AuthModule.user.id != "number") {
    // reset config to initial state
    store.commit(Mutations.RESET_LAYOUT_CONFIG);

    await store.dispatch(Actions.VERIFY_AUTH, {
      api_token: JwtService.getToken(),
    });
  }

  const authUser = store.state.AuthModule.user;
  // check user debug

  const checkUserRole = ((to.meta?.roles ?? []) as string[]).some(
    (e: string) => e == authUser.type
  );

  if (to.name == "sign-in") {
    if (authUser.is_active) {
      next({ name: "Dashboard" });
      return;
    } else {
      next();
      return;
    }
  }

  if (typeof authUser.id != "number") {
    next({ name: "sign-in" });
    return;
  }

  if (!checkUserRole) {
    next({ name: "404" });
    return;
  }

  next();

  scrollTop();

  return;
});

export default router;
