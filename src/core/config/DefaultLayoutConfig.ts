import LayoutConfigTypes from "@/core/config/LayoutConfigTypes";

const config: LayoutConfigTypes = {
  themeName: "Metronic",
  themeVersion: "8.1.1",
  demo: "demo1",
  main: {
    type: "default",
    primaryColor: "#009EF7",
    logo: {
      dark: "/assets/logos/default-dark.svg",
      light: "/assets/logos/default.svg",
    },
  },
  illustrations: {
    set: "sketchy-1",
  },
  loader: {
    logo: "/assets/logos/default-dark.svg",
    display: true,
    type: "default",
  },
  scrollTop: {
    display: true,
  },
  header: {
    display: true,
    menuIcon: "font",
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true,
    },
  },
  toolbar: {
    display: true,
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true,
    },
  },
  aside: {
    display: true,
    theme: "dark",
    fixed: true,
    menuIcon: "svg",
    minimized: false,
    minimize: true,
    hoverable: false,
  },
  content: {
    width: "fixed",
  },
  footer: {
    width: "fluid",
  },
};

export default config;
