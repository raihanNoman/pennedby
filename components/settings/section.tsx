import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useThemeColor } from "../Themed";

export function Section({ children }: PropsWithChildren) {
    const backgroundColor = useThemeColor({}, "card");
    const borderColor = useThemeColor({}, "border");
    return <View style={[styles.section, { backgroundColor, borderColor }]}>{children}</View>;
}

Section.Title = ({ children = "Section" }: PropsWithChildren) => <Text style={styles.sectionTitle}>{children}</Text>;

const styles = StyleSheet.create({
    section: {
        backgroundColor: "#FFF",
        borderRadius: 20,
        overflow: "hidden",
        padding: 8,
        paddingBottom: 0,

        marginBottom: 20,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: "#C6C6C8",
    },
    sectionTitle: {
        fontSize: 13,
        color: "#6E6E73",
        marginLeft: 20,
        marginVertical: 8,
        textTransform: "uppercase",
    },
});
