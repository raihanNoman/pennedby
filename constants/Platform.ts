import { useHeaderHeight as useHeaderHeight_ } from "@react-navigation/elements";
import Constants from "expo-constants";
import { Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const STATUS_BAR_HEIGHT = Constants.statusBarHeight;

export const useHeaderHeight = useHeaderHeight_;
export const useSadeHeaderHeight = () =>
  useSafeAreaInsets().top + STATUS_BAR_HEIGHT;
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

export const isPhone = isIOS || isAndroid;
export const isWeb = Platform.OS === "web";

export const SCREEN = Dimensions.get("window");
export const isPhoneScreen = isPhone || SCREEN.width < 480;

export const MAX_PHONE_WIDTH = 600;
export const SAFE_SCREEN_WIDTH = isPhone ? SCREEN.width : MAX_PHONE_WIDTH;

export const SIZE = {
  VerseItem: 200,
};

export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
