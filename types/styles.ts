import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { AnimatedStyle } from "react-native-reanimated";

export type AnimatedViewStyle_ = StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
export type AnimatedTextStyle = StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
export type ViewStyle_ = StyleProp<ViewStyle>;
export type TextStyle_ = StyleProp<TextStyle>;

export type TextBox = {
  boxStyle?: ViewStyle_;
  txtStyle?: TextStyle_;
};

export interface IconProps {
  color: string;
  size: number;
}

export type Icon = IconProps & { style: Text };
