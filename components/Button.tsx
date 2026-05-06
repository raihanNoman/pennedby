// import { FONT } from "@/assets/fonts/useFonts";
// import { MAX_COLORS } from "@/constants/Colors";
// import { isWeb } from "@/constants/Platform";
// import type { IconProps } from "@/types/styles";
// import { Entypo } from "@expo/vector-icons";
// import { MotiPressable } from "moti/interactions";
// import React, {
//     ComponentProps,
//     ReactNode,
//     useEffect,
//     useMemo,
//     useState,
// } from "react";
// import {
//     ActivityIndicator,
//     Pressable,
//     StyleProp,
//     StyleSheet,
//     Text,
//     TextStyle,
//     View,
//     ViewStyle,
// } from "react-native";
// import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";
// import { Icon, useThemeColor } from "./Themed";

// type ButtonIcon = (p: IconProps, isActive: boolean) => ReactNode;
// interface ButtonProps extends ComponentProps<typeof MotiPressable> {
//   title?: string;
//   active?: boolean;
//   loading?: boolean;
//   arrow?: boolean | "left";
//   textStyle?: StyleProp<TextStyle>;
//   icon?: ButtonIcon;
//   iconStyle?: StyleProp<ViewStyle>;
//   max?: boolean;
// }

// export default function Button({
//   title = "Continue",
//   onPress,
//   loading = false,
//   disabled = false,
//   arrow = false,
//   active = false,
//   icon,
//   iconStyle,
//   children,
//   max,
//   style,
//   ...props
// }: ButtonProps) {
//   const ACTIVE = max ? MAX_COLORS.primary : useThemeColor({}, "primary");
//   const IN_ACTIVE = useThemeColor(
//     { light: "#f4f4f4", dark: "#121212" },
//     "card",
//   );

//   const ACTIVE_TXT = max
//     ? MAX_COLORS.secondary
//     : useThemeColor({ light: "#fff" }, "text");
//   const IN_ACTIVE_TXT = useThemeColor({ dark: "#888" }, "text");
//   const BACKGORUND = useThemeColor({}, "background");

//   const colors = useMemo(() => {
//     if (active) return { text: ACTIVE_TXT, bg: ACTIVE };
//     else return { text: IN_ACTIVE_TXT, bg: IN_ACTIVE };
//   }, [active, ACTIVE]);

//   return (
//     <MotiPressable
//       animate={({ hovered, pressed }) => {
//         "worklet";

//         return {
//           scale: pressed ? 0.9 : 1,
//           //   backgroundColor: pressed ? undefined : colors.bg,
//           borderColor: hovered ? IN_ACTIVE_TXT : "transparent",
//           borderWidth: isWeb ? 1 : 0,
//         };
//       }}
//       style={[
//         styles.button,
//         max && { borderRadius: 12 },
//         {
//           opacity: loading ? 0.8 : disabled ? 0.5 : 1,
//           backgroundColor: colors.bg,
//         },
//         style,
//       ]}
//       onPress={onPress}
//       disabled={loading || disabled}
//       {...props}
//     >
//       {icon && (
//         <View style={[styles.icon, { backgroundColor: BACKGORUND }, iconStyle]}>
//           {icon({ size: BORDER_RADIUS, color: IN_ACTIVE_TXT }, active)}
//         </View>
//       )}

//       <Text
//         style={[
//           styles.text,
//           { color: colors.text },
//           max && { fontFamily: FONT.Orbitron._700 },
//           ,
//           props.textStyle,
//         ]}
//       >
//         {title}
//       </Text>

//       {loading ? (
//         <ActivityIndicator
//           style={[
//             { position: "absolute" },
//             arrow === "left" ? { left: 12 } : { right: 12 },
//           ]}
//           color={colors.text}
//         />
//       ) : arrow === "left" ? (
//         <ArrowLeft color={colors.text} />
//       ) : (
//         arrow && <ArrowRight color={colors.text} />
//       )}

//       {children as ReactNode}
//     </MotiPressable>
//   );
// }

// const arrowSize = 30;
// const ArrowLeft = ({ color }: { color: string }) => (
//   <Animated.View
//     entering={FadeInRight}
//     style={{ position: "absolute", left: 8 }}
//   >
//     <Icon color={color} size={arrowSize}>
//       <Entypo name="chevron-thin-left" />
//     </Icon>
//   </Animated.View>
// );
// const ArrowRight = ({ color }: { color: string }) => (
//   <Animated.View
//     entering={FadeInLeft}
//     style={{ position: "absolute", right: 8 }}
//   >
//     <Icon color={color} size={arrowSize}>
//       <Entypo name="chevron-thin-right" />
//     </Icon>
//   </Animated.View>
// );

// Button.Icon = ({
//   children,
//   style,
//   iconProps,
//   ...props
// }: ComponentProps<typeof Pressable> & {
//   iconProps?: ComponentProps<typeof Icon>;
// }) => {
//   return (
//     <Pressable {...props} style={[styles.rightIcon, style as ViewStyle]}>
//       <Icon size={25} {...iconProps}>
//         {children as ReactNode}
//       </Icon>
//     </Pressable>
//   );
// };

// export type { ButtonIcon, ButtonProps };
// const BORDER_RADIUS = 24;
// const styles = StyleSheet.create({
//   button: {
//     marginHorizontal: 16,
//     marginVertical: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: BORDER_RADIUS,
//     flexDirection: "row",
//   },
//   rightIcon: {
//     height: "100%",
//     aspectRatio: 1,

//     position: "absolute",
//     right: 0,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 20,
//     opacity: 0.5,
//   },
//   icon: {
//     marginLeft: 8,
//     padding: 8,
//     backgroundColor: "#8885",
//     borderRadius: BORDER_RADIUS,
//   },
//   text: { padding: 18, fontSize: 18, fontWeight: "600", textAlign: "center" },
//   loading: { position: "absolute", right: 12 },
//   arrow: { position: "absolute" },
// });

// export const useDelayedActive = (
//   delay: number,
//   run?: () => void,
//   enabled = true,
// ) => {
//   const [active, setActive] = useState(false);

//   useEffect(() => {
//     if (!enabled) return;

//     const timer = setTimeout(() => {
//       setActive(true);
//       run?.();
//     }, delay);

//     return () => {
//       clearTimeout(timer);
//     };
//   }, [delay, enabled]);

//   return active;
// };
// //   const Icon = icon && (
// //     <MotiView
// //       animate={iconAnimation}
// //       style={{
// //         backgroundColor: BACKGORUND,
// //         padding: BORDER_RADIUS / 4,
// //         borderRadius: BORDER_RADIUS,
// //         marginLeft: BORDER_RADIUS / 2,
// //       }}
// //     >
// //       {React.cloneElement<any>(icon, {
// //         size: icon?.props?.size, // Default size
// //         color: icon?.props?.color || IN_ACTIVE_TXT, // Default color
// //         style: icon?.props?.style, // Merge opacity and existing styles
// //       })}
// //     </MotiView>
// //   );
