import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
const isWeb = Platform.OS == "web";

const { Heavy, Medium, Light, Rigid } = Haptics.ImpactFeedbackStyle;
const { Success, Error, Warning } = Haptics.NotificationFeedbackType;

const Haptic = {
  select: () => Haptics.selectionAsync(),

  heavy: () => Haptics.impactAsync(Heavy),
  mid: () => Haptics.impactAsync(Medium),
  lite: () => Haptics.impactAsync(Light),
  rigid: () => Haptics.impactAsync(Rigid),

  success: () => Haptics.notificationAsync(Success),
  err: () => Haptics.notificationAsync(Error),
  warn: () => Haptics.notificationAsync(Warning),
};

export default Haptic;
