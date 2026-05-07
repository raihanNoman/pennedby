import { Text, useThemeColor } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import React, { ReactElement, ReactNode } from "react";
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, View } from "react-native";

type IoniconsName = React.ComponentProps<typeof Feather>["name"];

export default function SettingItem({
    icon,
    label,
    onPress,
    onLongPress,
    rightElement,
    destructive = false,
    loading = false,
}: {
    icon: IoniconsName | ReactElement; // Using Feather icon names
    label: string;
    onPress?: () => void;
    onLongPress?(): void;
    rightElement?: ReactNode;
    destructive?: boolean;
    loading?: boolean;
}) {
    const tint = useThemeColor({ light: "#8B4513", dark: "#D2B48C" }, "tint");
    const textColor = useThemeColor({ light: "#1a1a1a", dark: "#f1f1f1" }, "text");
    const borderColor = useThemeColor({ light: "#F0EBE0", dark: "#2A2A2A" }, "border");

    return (
        <TouchableOpacity
            style={[styles.item, { borderBottomColor: borderColor }]}
            onPress={onPress}
            onLongPress={onLongPress}
            disabled={!onPress || loading}
        >
            <View style={styles.itemLeft}>
                <View style={styles.iconContainer}>
                    {typeof icon === "string" ? (
                        <Feather name={icon as any} size={20} color={destructive ? "#FF3B30" : tint} />
                    ) : (
                        icon
                    )}
                </View>

                <Text
                    style={[
                        styles.label,
                        { color: textColor },
                        destructive && { color: "#FF3B30" },
                        {
                            fontFamily: Platform.OS === "ios" ? "Avenir Next" : "sans-serif",
                        },
                    ]}
                >
                    {label}
                </Text>
            </View>

            {loading ? (
                <ActivityIndicator size="small" color={tint} />
            ) : rightElement ? (
                rightElement
            ) : (
                <Feather name="chevron-right" size={16} color={textColor} style={{ opacity: 0.2 }} />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16, // More breathing room
        paddingHorizontal: 4,
        borderBottomWidth: 1,
    },
    itemLeft: { flexDirection: "row", alignItems: "center" },
    iconContainer: {
        width: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        fontSize: 16,
        marginLeft: 12,
        fontWeight: "500",
    },
});
