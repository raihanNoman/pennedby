import { isIOS, isWeb } from "@/constants/Platform";
import { Post } from "@/utils/aws/types";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Card, useThemeColor } from "../Themed";
import PreviewSVG from "../sketch/PreviewSVG";
import { isStrokeItems } from "../sketch/guard";
import { StrokeItem } from "../sketch/type";

const { width, height } = Dimensions.get("window");
export const useColors = () => {
    const themeBg = useThemeColor({ light: "#F9F7F2" }, "background"); //isDark ? colors.darkBackground : colors.background;
    const themeText = useThemeColor({}, "text");
    return {
        background: "#F9F7F2", // Light Parchment
        darkBackground: "#121212", // Deep Slate
        text: "#2C2C2C",
        accent: "#8B4513", // Ink Brown
        card: "#FFFFFF",
        border: "#E0DCCF",
        themeBg,
        themeText,
    };
};

export default function PostItem({ post }: { post: Post }) {
    const { themeBg, themeText, ...colors } = useColors();
    const isDark = useTheme().dark;
    const date = formatDate(new Date(post.createdAt));

    const [strokeItems, setStrokeItems] = useState<StrokeItem[]>([]);

    useEffect(() => {
        if (!post) return;

        try {
            let points = JSON.parse(post.points.toString());
            if (!isStrokeItems(points)) throw "invalid stroke items";
            setStrokeItems(points);
        } catch (e) {
            console.log("❌ invalid data recieved", e);
        }
    }, [post]);

    return (
        <View style={[styles.pageContainer, { height: height * 0.8, backgroundColor: themeBg }]}>
            <Card style={[styles.letterCard]}>
                {/* Letter Header */}
                <View style={styles.letterHeader}>
                    <View>
                        <Text style={[styles.pennedLabel, { color: colors.accent }]}>Penned by</Text>
                        <Text style={[styles.userName, { color: themeText }]}>Jay</Text>
                    </View>
                    <View style={styles.metaInfo}>
                        <Text style={styles.dateText}>{date}</Text>
                        {post.audioDuration && (
                            <View style={styles.audioBadge}>
                                <Feather name="mic" size={12} color={colors.accent} />
                                <Text style={styles.audioText}>{post.audioDuration}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* The "Handwriting" Canvas Area */}
                <View style={styles.canvasPreview}>
                    {post ? (
                        <PreviewSVG
                            viewBox={post.viewBox}
                            strokeItems={strokeItems}
                            stroke={post.color || themeText}
                            strokeWidth={post.size || 3}
                            loopDelayMS={3000}
                            isLooping
                        />
                    ) : (
                        <View style={styles.placeholderInk}>
                            {/* This is where your SVG / Canvas component would animate */}
                            <Text style={[styles.italicText, { color: isDark ? "#555" : "#CCC" }]}>
                                [Handwritten Content Preview...]
                            </Text>
                        </View>
                    )}
                </View>

                {/* Title & Interaction */}
                <View style={styles.letterFooter}>
                    <Text style={[styles.letterTitle, { color: themeText }]}>{post.title}</Text>
                    <Pressable style={[styles.playButton, { backgroundColor: colors.accent }]}>
                        <Feather name="play" size={20} color="#FFF" />
                        <Text style={styles.playButtonText}>Watch Ink</Text>
                    </Pressable>
                </View>
            </Card>
        </View>
    );
}
const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    profileHeader: {
        padding: 20,
        alignItems: "center",
    },
    brandTitle: {
        fontSize: 22,
        fontWeight: "800",
        letterSpacing: -0.5,
    },
    listContent: {
        paddingHorizontal: isWeb ? width * 0.2 : 0, // Wide margins on web for iPad look
    },
    pageContainer: {
        width: width,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    letterCard: {
        width: "100%",
        maxWidth: 500, // Keeps it looking like a letter on iPad/Web
        height: "90%",
        borderRadius: 12,
        padding: 24,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: { elevation: 5 },
            web: { boxShadow: "0px 10px 30px rgba(0,0,0,0.05)" },
        }),
    },
    letterHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 30,
    },
    pennedLabel: {
        fontSize: 12,
        textTransform: "uppercase",
        fontWeight: "700",
        letterSpacing: 1,
    },
    userName: {
        fontSize: 24,
        fontWeight: "700",
        fontFamily: isIOS ? "Georgia" : "serif", // Sophisticated touch
    },
    metaInfo: {
        alignItems: "flex-end",
    },
    dateText: {
        fontSize: 12,
        color: "#999",
    },
    audioBadge: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        backgroundColor: "rgba(139, 69, 19, 0.1)",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    audioText: {
        fontSize: 10,
        fontWeight: "600",
        marginLeft: 4,
        color: "#8B4513",
    },
    canvasPreview: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
        marginBottom: 20,
    },
    placeholderInk: {
        opacity: 0.5,
    },
    italicText: {
        fontStyle: "italic",
        fontSize: 16,
    },
    letterFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    letterTitle: {
        fontSize: 18,
        fontWeight: "600",
        flex: 1,
        marginRight: 10,
    },
    playButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25,
    },
    playButtonText: {
        color: "#FFF",
        fontWeight: "700",
        marginLeft: 8,
    },
});
