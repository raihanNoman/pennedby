import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { Icon, useThemeColor } from "../Themed";

export function NavSettings() {
    const backgroundColor = useThemeColor({ light: "#eee" }, "card");

    return (
        <Link asChild href={{ pathname: "/settings" }} style={[styles.circle, styles.spacing, { backgroundColor }]}>
            <Pressable>
                <Icon size={20}>
                    <Feather name="settings" />
                </Icon>
            </Pressable>
        </Link>
    );
}
const size = 25;
const styles = StyleSheet.create({
    row: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
    spacing: { marginRight: 12 },
    circle: {
        borderRadius: "50%",
        backgroundColor: "#8885",

        height: size * 1.5,
        width: size * 1.5,
        alignItems: "center",
        justifyContent: "center",
    },
});
