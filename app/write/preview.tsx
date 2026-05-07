import { useAppSelector } from "@/_redux/hooks";
import Button from "@/components/Button";
import Empty from "@/components/Empty";
import Haptic from "@/components/Haptics";
import PreviewSVG from "@/components/sketch/PreviewSVG";
import { Text, useThemeColor } from "@/components/Themed";
import { getMode } from "@/constants/Presets";
import { Alert } from "@/utils/Alert";
import { client } from "@/utils/aws";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { getCurrentUser } from "aws-amplify/auth";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useMemo, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function PreviewMyWriting() {
    const router = useRouter();
    const params = useLocalSearchParams() as { mode?: string };
    const mode = useMemo(() => getMode(params.mode ? params.mode : "business")!, []);
    const isDark = useTheme().dark;

    const preview = useAppSelector((s) => s.newPost.preview);
    const tint = useThemeColor({ light: "#8B4513", dark: "#D2B48C" }, "tint");
    const textColor = useThemeColor({ light: "#1a1a1a", dark: "#f1f1f1" }, "text");
    const cardBg = useThemeColor({ light: "#FFF", dark: "#1A1A1A" }, "card");
    const secondaryBg = useThemeColor({ light: "#F5F2E9", dark: "#252525" }, "background");
    const [sending, setSending] = useState(false);

    const handleFinalPost = async () => {
        if (sending) return;
        else if (!preview) {
            Alert("No such letter to send", "Letter content is empty", [
                { text: "Ok" },
                {
                    text: "Write New Letter",
                    onPress: () => router.navigate({ pathname: "/write" }),
                },
            ]);
            return;
        }

        try {
            setSending(true);

            try {
                await getCurrentUser();
                console.log("✅ signed in");
            } catch (e) {
                console.log("❌ not signed in. redirecting to auth route", e);
                router.push({ pathname: "/auth" });
                return;
            }

            //  print({ pointsTOUpload: preview.strokeItems });

            const user = await getCurrentUser();
            const { data, errors } = await client.models.Post.create({
                points: JSON.stringify(preview.strokeItems),
                viewBox: preview.viewBox,
                color: preview.color,
                size: preview.size,
                userID: user.userId,
            });

            if (errors) {
                console.log("🚩graph ql err", errors);
                throw "err sending letter";
            }

            // give them a link

            console.log("Post Minted/Created", data?.id);
            Haptic.success();
            if (router.canDismiss()) router.dismissTo({ pathname: "/my-account" });
            else router.navigate({ pathname: "/my-account" });
        } catch (e) {
            console.log("❌ failed to send", e);
            Haptic.err();
        } finally {
            setSending(false);
        }
    };

    if (!preview)
        return <Empty label="No letter to preview" icon={<MaterialCommunityIcons name="note-remove-outline" />} />;
    return (
        <View style={[styles.container, { backgroundColor: secondaryBg }]}>
            <Stack.Screen options={{ headerTransparent: true, title: "" }} />

            <LinearGradient
                colors={isDark ? mode.colors : mode?.darkColors}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Header Info */}
            <View style={styles.header}>
                <Text style={[styles.label, { color: tint }]}>FINAL PREVIEW</Text>
                <Text style={[styles.title, { color: textColor }]}>Review your intent.</Text>
            </View>

            {/* The Letter Preview Canvas */}
            <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={[styles.previewCanvas, { backgroundColor: cardBg }]}
            >
                <View style={styles.canvasHeader}>
                    <Feather name="edit-3" size={16} color={tint} />
                    <Text style={[styles.canvasStatus, { color: tint }]}>Handwritten Draft</Text>
                </View>

                <View style={styles.drawingArea}>
                    <PreviewSVG
                        viewBox={preview.viewBox}
                        strokeItems={preview.strokeItems}
                        stroke={preview.color}
                        strokeWidth={preview.size}
                        loopDelayMS={3000}
                        isLooping
                    />
                    {/* 
              This is where your <SkiaView> or SVG Path animation component lives.
              For now, a placeholder for the "Playback" 
            */}
                    <MaterialCommunityIcons name="gesture-spread" size={48} color={tint} style={{ opacity: 0.2 }} />
                    <Text style={[styles.placeholderText, { color: textColor }]}>Tap to Replay Stroke</Text>
                </View>

                <View style={styles.canvasFooter}>
                    <View style={styles.meta}>
                        <Feather name="clock" size={12} color={textColor} style={{ opacity: 0.5 }} />
                        <Text style={[styles.metaText, { color: textColor }]}>45s Playback</Text>
                    </View>
                    <View style={styles.meta}>
                        <Feather name="mic" size={12} color={textColor} style={{ opacity: 0.5 }} />
                        <Text style={[styles.metaText, { color: textColor }]}>Audio Attached</Text>
                    </View>
                </View>
            </MotiView>

            <Button onPress={handleFinalPost} onPressIn={Haptic.select} active arrow title="Seal & Send" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
    },
    header: {
        marginBottom: 32,
        alignItems: "center",
    },
    label: {
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 2,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    },
    previewCanvas: {
        width: "100%",
        maxHeight: "75%",
        aspectRatio: 0.75, // Like a sheet of paper
        borderRadius: 16,
        marginBottom: 24,
        alignSelf: "center",
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            },
            web: { boxShadow: "0 20px 40px rgba(0,0,0,0.1)" },
        }),
    },
    canvasHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        opacity: 0.8,
    },
    canvasStatus: {
        fontSize: 10,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    drawingArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        marginTop: 12,
        fontSize: 14,
        opacity: 0.4,
        fontStyle: "italic",
    },
    canvasFooter: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        paddingTop: 16,
        borderTopWidth: 0.5,
        borderTopColor: "#00000010",
    },
    meta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        fontWeight: "600",
        opacity: 0.6,
    },
    actionSection: {
        marginTop: 40,
        gap: 20,
    },
    optionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    option: {
        alignItems: "flex-start",
    },
    optionLabel: {
        fontSize: 10,
        opacity: 0.5,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    optionValue: {
        fontSize: 13,
        fontWeight: "600",
        marginTop: 2,
    },
    postButton: {
        flexDirection: "row",
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    postButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "800",
        letterSpacing: -0.5,
    },
    editBtn: {
        alignItems: "center",
        padding: 10,
    },
    editBtnText: {
        fontSize: 14,
        fontWeight: "600",
        opacity: 0.5,
    },
});
