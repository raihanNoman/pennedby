import { useAppSelector } from "@/_redux/hooks";
import { isPhone } from "@/constants/Platform";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MotiPressable } from "moti/interactions";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Haptic from "../Haptics";
import { Icon, useThemeColor } from "../Themed";

export function NewPostBtn() {
    const router = useRouter();

    const isLoggedIn = useAppSelector((s) => s.auth.isLoggedIn);
    // Using primary color for that "fancy" look, falling back to tabIconDefault
    const primaryColor = useThemeColor({}, "tabIconDefault");
    const iconColor = "#fff";

    const navNewPost = useCallback(() => router.push({ pathname: "/write" }), [router]);

    const myAccount = useCallback(() => router.push({ pathname: "/my-account" }), [router]);

    return (
        <SafeAreaView edges={["bottom"]} style={styles.pos}>
            <MotiPressable
                onPress={navNewPost}
                onPressIn={Haptic.select}
                animate={({ hovered, pressed }) => {
                    "worklet";
                    return {
                        scale: pressed ? 0.9 : hovered ? 1.1 : 1,
                    };
                }}
                transition={{
                    type: "timing",
                    duration: 150,
                }}
                style={[styles.btn, { backgroundColor: primaryColor }]}
            >
                <Icon size={size / 2} color={iconColor}>
                    <MaterialCommunityIcons name="draw" />
                </Icon>
            </MotiPressable>

            {isLoggedIn && (
                <MotiPressable
                    onPressIn={Haptic.success}
                    onPress={myAccount}
                    animate={({ hovered, pressed }) => {
                        "worklet";
                        return {
                            scale: pressed ? 0.9 : hovered ? 1.1 : 1,
                            backgroundColor: pressed ? primaryColor : primaryColor,
                        };
                    }}
                    transition={{
                        type: "timing",
                        duration: 150,
                    }}
                    style={styles.btn}
                >
                    <Icon size={size / 2} color={iconColor}>
                        <MaterialCommunityIcons name="account" />
                    </Icon>
                </MotiPressable>
            )}
        </SafeAreaView>
    );
}

const size = 56; // Increased slightly for better tap target/visuals

const styles = StyleSheet.create({
    pos: {
        flexDirection: isPhone ? "column" : "row",
        position: "absolute",
        right: isPhone ? 16 : 24,
        bottom: 16,
        zIndex: 11,
    },
    btn: {
        height: size,
        width: size,
        borderRadius: size / 2,
        margin: 6,
        alignItems: "center",
        justifyContent: "center",
        // Adding a slight shadow for depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
});
