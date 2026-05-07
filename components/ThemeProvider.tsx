import { useAppSelector } from "@/_redux/hooks";
import { useColorScheme } from "@/components/useColorScheme";
import { DarkTheme, DefaultTheme } from "@/constants/Colors";
import * as Navigation from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { PropsWithChildren } from "react";
import { Platform } from "react-native";

export default function ThemeProvider({ children }: PropsWithChildren) {
    const { theme, forcedTheme } = useAppSelector((s) => s.app);
    const systemScheme = useColorScheme() ?? "light";
    const resolvedTheme = forcedTheme ?? (theme === "system" ? systemScheme : theme);
    const isDark = resolvedTheme === "dark";

    if (Platform.OS === "web") {
        document.documentElement.dataset.theme = resolvedTheme;
    }

    return (
        <Navigation.ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            <StatusBar
                /**  @android */
                backgroundColor={isDark ? "#000" : "#fff"}
                style={isDark ? "dark" : "light"}
            />
            {children}
        </Navigation.ThemeProvider>
    );
}
