import { setAppTheme } from "@/_redux/app";
import { useAppDispatch, useAppSelector } from "@/_redux/hooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];
type ThemeMode = "system" | "light" | "dark";

const themeConfig: Record<
  ThemeMode,
  { icon: IoniconsName; label: string; next: ThemeMode; color: string }
> = {
  system: {
    icon: "contrast-outline",
    label: "System",
    next: "light",
    color: "#888",
  },
  light: { icon: "sunny", label: "Light", next: "dark", color: "#FFB800" },
  dark: { icon: "moon", label: "Dark", next: "system", color: "#7E57C2" },
};

export function ThemeSelector() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.app.theme);
  const current = themeConfig[theme];

  const handleCycle = useCallback(() => {
    dispatch(setAppTheme(current.next));
  }, [dispatch, current.next]);

  return (
    <Pressable
      onPress={handleCycle}
      style={({ pressed }) => [
        styles.cycleButton,
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <Ionicons name={current.icon} size={24} color={current.color} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  cycleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cycleText: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 50, // Prevents layout jump when text changes
    textAlign: "center",
  },
});
