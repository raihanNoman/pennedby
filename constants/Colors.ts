import type { Theme } from "@react-navigation/native";
import * as Navigation from "@react-navigation/native";

const tintColorLight = "#2E333B"; // "#2f95dc";
const tintColorDark = "#fff";

const HEADER_LOGO_BG_COLOR = "#00861f"; // "rgb(2, 188, 135)";
const HEADER_LOGO_BG_DARK_COLOR = "#174c00"; //"rgb(0, 147, 105)";

export const Q600_COLORS = {
  primary: "#01995E",
  secondary: "#FFCC00",
};
export const MAX_COLORS = {
  primary: "#990104",
  secondary: "#FFCC00",
};

export const DefaultTheme: Theme = {
  ...Navigation.DefaultTheme,
  dark: false,
  colors: {
    primary: HEADER_LOGO_BG_COLOR,
    background: "#fff", //'rgb(242, 242, 242)'
    card: "#fff", //"rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    border: "#eee9", // "rgb(216, 216, 216)",
    notification: "rgb(255, 59, 48)",
  },
};
export const DarkTheme: Theme = {
  ...Navigation.DarkTheme,
  dark: true,
  colors: {
    primary: HEADER_LOGO_BG_DARK_COLOR,
    background: "#000", // "#121212",
    card: "#212121",
    text: "rgb(188, 188, 188)",
    border: "rgb(39, 39, 41)",
    notification: "rgb(255, 69, 58)",
  },
};

export const PRIMARY_SHADES = {
  "50": "#fffbea",
  "100": "#fff2c5",
  "200": "hsla(48, 100%, 76%, 1.00)",
  "300": "#ffd246",
  "400": "#ffbe1aff",
  "500": "hsla(43, 100%, 55%, 1.00)",
  "600": "hsla(43, 100%, 55%, 1.00)",
  "700": "hsla(43, 100%, 55%, 1.00)",
  "800": "hsla(43, 100%, 55%, 1.00)",
  "900": "hsla(43, 100%, 55%, 1.00)",
  "950": "hsla(43, 100%, 55%, 1.00)",
};

export default {
  light: {
    shadow: "#0003",
    track: "#ddd",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,

    campaign: HEADER_LOGO_BG_COLOR,

    correct: "#0fe800",
    wrong: "#f00",
    warning: "#fb0",
    ios: "#007AFF",

    ...DefaultTheme.colors,
  },
  dark: {
    campaign: "#14AE5C",

    correct: "#0b9f00",
    wrong: "#c80000",
    warning: "#dda200",
    ios: "#03509dff",

    track: "#121212",
    shadow: "#0009",
    tint: tintColorDark,
    tabIconDefault: "#6e6e6e",
    tabIconSelected: tintColorDark,
    ...DarkTheme.colors,
  },
};
