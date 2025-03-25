export const DocMenuConfig = [
  {
    pages: [
      {
        heading: "menus.general_statistics",
        route: "/dashboard",
        svgIcon: "/assets/icons/menu/menu-statistics.svg",
        fontIcon: "bi-archieve",
        meta: {
          role: "super_admin",
        },
      },
      {
        sectionTitle: "menus.participants",
        route: "/dashboard/participants",
        svgIcon: "/assets/icons/menu/menu-briefcase.svg",
        fontIcon: "bi-person",
        sub: [
          {
            heading: "menus.active_participants",
            route: "/dashboard/participants/active",
          },
          {
            heading: "menus.no_active_participants",
            route: "/dashboard/participants/in-active",
          },
          {
            heading: "menus.archive_participants",
            route: "/dashboard/participants/archived",
          },
          {
            heading: "menus.finally_change",
            route: "/dashboard/participants/recent-changes",
          },
        ],
      },
      {
        sectionTitle: "menus.services",
        route: "/programs",
        svgIcon: "/assets/icons/menu/menu-ecommerce.svg",
        fontIcon: "bi-person",
        sub: [
          {
            heading: "menus.active_services",
            route: "/programs",
          },
          {
            heading: "menus.archive_services",
            route: "/programs/archived",
          },
        ],
      },
      {
        sectionTitle: "menus.responsible_people",
        route: "/responsible-person",
        svgIcon: "/assets/icons/menu/menu-basket.svg",
        fontIcon: "bi-archieve",
        sub: [
          {
            heading: "active_responsible_person",
            route: "/responsible-person",
          },
          {
            heading: "nonactive_responsible_person",
            route: "/responsible-person/nonactive",
          },
        ],
      },

      {
        sectionTitle: "menus.contract",
        route: "/contracts",
        svgIcon: "/assets/icons/menu/menu-users.svg",
        fontIcon: "bi-person",
        sub: [
          {
            heading: "menus.active_contract",
            route: "/contracts",
          },
          {
            heading: "menus.archive_contract",
            route: "/contracts/archived",
          },
        ],
      },
      {
        heading: "history_of_support",
        route: "/dashboard/financial",
        svgIcon: "/assets/icons/menu/menu-transactions.svg",
        fontIcon: "bi-archieve",
      },

      {
        heading: "menus.transactions",
        route: "/dashboard/moderators",
        svgIcon: "/assets/icons/menu/menu-moderator.svg",
        fontIcon: "bi-archieve",
      },
      {
        heading: "menus.cashiers",
        route: "/partners",
        svgIcon: "/assets/icons/menu/menu-partner.svg",
        fontIcon: "bi-archieve",
      },
      {
        heading: "menus.cashback",
        link: "https://cloud.ona.uicgroup.tech/login",
        route: "",
        svgIcon: "/assets/icons/menu/menu-percentage.svg",
        fontIcon: "bi-archieve",
      },
      // {
      //   heading: "menus.archive",
      //   route: "dashboard/discounts",
      //   svgIcon: "/assets/icons/menu/menu-cash.svg",
      //   fontIcon: "bi-archieve",
      // },
      {
        heading: "menus.tasks",
        route: "/dashboard/task",
        svgIcon: "/assets/icons/menu/menu-doc.svg",
        fontIcon: "bi-archieve",
      },
    ],
    settingItem: [
      {
        sectionTitle: "menus.setting",
        route: "/dashboard/setting",
        svgIcon: "/assets/icons/menu/settings.svg",
        fontIcon: "bi-person",
        sub: [
          {
            heading: "menus.type_of_supports",
            route: "/dashboard/type-of-supports",
            svgIcon: "/assets/icons/menu/menu-supports.svg",
            fontIcon: "bi-archieve",
          },
          {
            heading: "menus.relative",
            route: "/dashboard/relative",
            svgIcon: "/assets/icons/menu/relative.svg",
            fontIcon: "bi-archieve",
          },
          {
            heading: "menus.situation",
            route: "/dashboard/situations",
            svgIcon: "/assets/icons/menu/Flag.svg",
            fontIcon: "bi-archieve",
          },
        ],
      },
      {
        heading: "conditions",
        route: "/dashboard/conditions",
        svgIcon: "/assets/icons/menu/info.svg",
        fontIcon: "bi-archieve",
      },
    ],
  },
];

export const DocMenuConfigAuth = [
  {
    pages: [
      {
        heading: "menus.general_statistics",
        route: "/dashboard",
        svgIcon: "/assets/icons/menu/menu-statistics.svg",
        fontIcon: "bi-archieve",
        meta: {
          role: "super_admin",
        },
      },
      {
        sectionTitle: "menus.participants",
        route: "/dashboard/participants",
        svgIcon: "/assets/icons/menu/menu-briefcase.svg",
        fontIcon: "bi-person",
        sub: [
          {
            heading: "menus.active_participants",
            route: "/dashboard/participants/active",
          },
          {
            heading: "menus.no_active_participants",
            route: "/dashboard/participants/in-active",
          },
          {
            heading: "menus.archive_participants",
            route: "/dashboard/participants/archived",
          },
        ],
      },
      {
        sectionTitle: "menus.services",
        route: "/programs",
        svgIcon: "/assets/icons/menu/menu-ecommerce.svg",
        fontIcon: "bi-person",
        sub: [
          {
            heading: "menus.active_services",
            route: "/programs",
          },
          {
            heading: "menus.archive_services",
            route: "/programs/archived",
          },
        ],
      },
      {
        sectionTitle: "menus.responsible_people",
        route: "/responsible-person",
        svgIcon: "/assets/icons/menu/menu-basket.svg",
        fontIcon: "bi-archieve",
        sub: [
          {
            heading: "active_responsible_person",
            route: "/responsible-person",
          },
          {
            heading: "nonactive_responsible_person",
            route: "/responsible-person/nonactive",
          },
        ],
      },

      {
        sectionTitle: "menus.contract",
        route: "/contracts",
        svgIcon: "/assets/icons/menu/menu-users.svg",
        fontIcon: "bi-person",
        sub: [
          {
            heading: "menus.active_contract",
            route: "/contracts",
          },
          {
            heading: "menus.archive_contract",
            route: "/contracts/archived",
          },
        ],
      },

      {
        heading: "menus.type_of_supports",
        route: "/dashboard/type-of-supports",
        svgIcon: "/assets/icons/menu/supports.svg",
        fontIcon: "bi-archieve",
      },

      {
        heading: "history_of_support",
        route: "/dashboard/financial",
        svgIcon: "/assets/icons/menu/menu-transactions.svg",
        fontIcon: "bi-archieve",
      },
      {
        heading: "menus.cashiers",
        route: "/partners",
        svgIcon: "/assets/icons/menu/menu-partner.svg",
        fontIcon: "bi-archieve",
      },
      {
        heading: "menus.cashback",
        link: "https://cloud.ona.uicgroup.tech/login",
        route: "",
        svgIcon: "/assets/icons/menu/menu-percentage.svg",
        fontIcon: "bi-archieve",
      },
      // {
      //   heading: "menus.archive",
      //   route: "dashboard/discounts",
      //   svgIcon: "/assets/icons/menu/menu-cash.svg",
      //   fontIcon: "bi-archieve",
      // },
      {
        heading: "menus.tasks",
        route: "/dashboard/task",
        svgIcon: "/assets/icons/menu/menu-doc.svg",
        fontIcon: "bi-archieve",
      },
    ],
    settingItem: [
      {
        heading: "menus.relative",
        route: "/dashboard/relative",
        svgIcon: "/assets/icons/menu/relative.svg",
        fontIcon: "bi-archieve",
      },
      {
        heading: "menus.situation",
        route: "/dashboard/situations",
        svgIcon: "/assets/icons/menu/Flag.svg",
        fontIcon: "bi-archieve",
      },
      {
        heading: "conditions",
        route: "/dashboard/conditions",
        svgIcon: "/assets/icons/menu/info.svg",
        fontIcon: "bi-archieve",
      },
    ],
  },
];

export const ResponsiblePersonMenus = [
  {
    pages: [
      {
        heading: "menus.general_statistics",
        route: "/dashboard",
        svgIcon: "/assets/icons/menu/menu-statistics.svg",
        fontIcon: "bi-archieve",
        meta: {
          role: "super_admin",
        },
      },
      {
        sectionTitle: "menus.participants",
        route: "/dashboard/participants",
        svgIcon: "/assets/icons/menu/menu-briefcase.svg",
        fontIcon: "bi-person",
        sub: [
          {
            heading: "menus.active_participants",
            route: "/dashboard/participants/active",
          },
          {
            heading: "menus.no_active_participants",
            route: "/dashboard/participants/in-active",
          },
          {
            heading: "menus.archive_participants",
            route: "/dashboard/participants/archived",
          },
        ],
      },
      {
        sectionTitle: "menus.services",
        route: "/programs",
        svgIcon: "/assets/icons/menu/menu-ecommerce.svg",
        fontIcon: "bi-person",
        sub: [
          {
            heading: "menus.active_services",
            route: "/programs",
          },
          {
            heading: "menus.archive_services",
            route: "/programs/archived",
          },
        ],
      },
      {
        sectionTitle: "menus.responsible_people",
        route: "/responsible-person",
        svgIcon: "/assets/icons/menu/menu-basket.svg",
        fontIcon: "bi-archieve",
        sub: [
          {
            heading: "active_responsible_person",
            route: "/responsible-person",
          },
          {
            heading: "nonactive_responsible_person",
            route: "/responsible-person/nonactive",
          },
        ],
      },

      {
        sectionTitle: "menus.contract",
        route: "/contracts",
        svgIcon: "/assets/icons/menu/menu-users.svg",
        fontIcon: "bi-person",
        sub: [
          {
            heading: "menus.active_contract",
            route: "/contracts",
          },
          {
            heading: "menus.archive_contract",
            route: "/contracts/archived",
          },
        ],
      },
      {
        heading: "history_of_support",
        route: "/dashboard/financial",
        svgIcon: "/assets/icons/menu/menu-transactions.svg",
        fontIcon: "bi-archieve",
      },
      {
        heading: "menus.tasks",
        route: "/dashboard/task",
        svgIcon: "/assets/icons/menu/menu-doc.svg",
        fontIcon: "bi-archieve",
      },
    ],
  },
];
