/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  TextInput as DefaultTextInput,
  View as DefaultView,
  Pressable,
  TextProps as RNTextProps,
  StyleSheet,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";

import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { BlurTint, BlurView } from "expo-blur";
import React, {
  ComponentProps,
  forwardRef,
  PropsWithChildren,
  useRef,
} from "react";
import Animated, { AnimatedProps } from "react-native-reanimated";
import { shadow_ } from "./styleShadow";

import type { IconProps } from "@/types/styles";

export type ThemeProps = { light?: string; dark?: string };
export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName,
  overrideTheme?: "dark" | "light" | null,
) {
  const theme = overrideTheme || useTheme().dark ? "dark" : "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

interface QuickTextProps {
  weight?: TextStyle["fontWeight"];
  opacity?: TextStyle["opacity"];
  align?: TextStyle["textAlign"];
}
interface TextProps_ extends TextProps, Partial<IconProps>, QuickTextProps {}

export function Text({
  light,
  dark,
  size,
  weight,
  opacity,
  color,
  style,
  ...btn
}: TextProps_) {
  color = color || useThemeColor({ light, dark }, "text");
  return (
    <DefaultText
      style={[{ color, fontSize: size, fontWeight: weight, opacity }, style]}
      {...btn}
    />
  );
}
interface AnimatedTextProps
  extends
    AnimatedProps<RNTextProps>,
    Partial<IconProps>,
    QuickTextProps,
    ThemeProps {}

Text.Animated = ({
  light,
  dark,
  size,
  weight,
  opacity,
  color,
  style,
  ...btn
}: AnimatedTextProps) => {
  color = color || useThemeColor({ light, dark }, "text");
  return (
    <Animated.Text
      style={[{ color, fontSize: size, fontWeight: weight, opacity }, style]}
      {...btn}
    />
  );
};

export function Card({
  shadow = true,
  ...props
}: ViewProps & { shadow?: boolean }) {
  const { light, dark, ...otherProps } = props;
  const style = props.style as ViewStyle;
  const backgroundColor = useThemeColor({ light, dark }, "card");
  const shadowColor = useThemeColor({}, "shadow");

  const shadowStyle = shadow_({
    color: shadowColor,
    elevation: 5,
    offset: { height: 4, width: 0 },
    opacity: 0.8,
    radius: 8,
  });

  return (
    <DefaultView
      {...otherProps}
      style={[
        { backgroundColor, overflow: "visible" },
        shadow && shadowStyle,
        style,
      ]}
    />
  );
}

export const useTextInputRef = () => useRef<DefaultTextInput>(null);

export const TextInput = forwardRef<
  DefaultTextInput,
  TextInputProps & ThemeProps
>(({ style, dark, light, ...props }, ref) => {
  const color = useThemeColor({}, "text");
  const borderColor = useTheme().colors.border;
  const backgroundColor = useThemeColor({ light, dark }, "background");
  const placeholderTextColor = useThemeColor(
    { light: "#bbb", dark: "#666" },
    "text",
  );

  return (
    <DefaultTextInput
      ref={ref}
      {...props}
      placeholderTextColor={placeholderTextColor}
      style={[styles.input, { color, backgroundColor, borderColor }, style]}
    />
  );
});
TextInput.displayName = "TextInput";

export function Icon({
  children,
  dark,
  light,
  color,
  size = 25,
}: PropsWithChildren & ThemeProps & Partial<IconProps>) {
  const icon = children as any | undefined | null;
  color = color || useThemeColor({ light, dark }, "text");

  const Icon =
    icon &&
    React.cloneElement<any>(icon, {
      size: size || icon?.props?.size,
      color: color,
    });

  return Icon as React.ReactElement;
}

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
  input: {
    padding: 10,
    fontSize: 16,
    margin: 10,
    borderRadius: 10,
  },
});
export const inputStyles = styles.input;

export function Blur(props: ComponentProps<typeof BlurView>) {
  const isDark = useTheme().dark;
  const theme: BlurTint = isDark ? "dark" : "light";
  return <BlurView tint={theme} {...props} />;
}

export default { Icon, TextInput, Text, Card };
