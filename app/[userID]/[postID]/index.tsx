import { Preview } from "@/_redux/new-post";
import Empty, { LoadingScreen } from "@/components/Empty";
import { isStrokeItems } from "@/components/sketch/guard";
import PreviewSVG from "@/components/sketch/PreviewSVG";
import { useThemeColor } from "@/components/Themed";
import { client } from "@/utils/aws";
import { Post } from "@/utils/aws/types";
import { Feather } from "@expo/vector-icons";
import { getCurrentUser } from "aws-amplify/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function usePost() {
    const parms = useLocalSearchParams() as { postID?: string };
    const [post, setPost] = useState<Post>();
    const [loaindg, setLoaindg] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                if (!parms.postID) throw "no post ID";
                const user = await getCurrentUser();
                const { data, errors } = await client.models.Post.get({
                    id: parms.postID,
                });

                if (!data || errors) {
                    console.log("🚩 graph ql err", errors);
                    throw "err getting post";
                }

                setPost(data);
            } catch (e) {
                console.log("❌ err getting post", e);
            } finally {
                setLoaindg(false);
            }
        })();
    }, []);

    return { post, loaindg };
}

function usePreview(post: Post | undefined) {
    const [preview, setPreview] = useState<Preview>();
    const defaultColor = useThemeColor({}, "text");
    useEffect(() => {
        if (!post) return;

        try {
            if (!isStrokeItems(post.points)) throw "invalid stroke items";
            setPreview({
                strokeItems: post.points,
                viewBox: post.viewBox,
                size: post.size || 3,
                color: post.color || defaultColor,
            });
        } catch (e) {
            console.log("❌ invalid data recieved", e);
        }
    }, [post]);

    return preview;
}
export default function PostItemPage() {
    const router = useRouter();
    const { post, loaindg } = usePost();
    const preview = usePreview(post);
    const { cardBg, textColor, tintColor, bgColor, borderColor } = useColors();

    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1); // The receiver controls speed

    if (loaindg) return <LoadingScreen loading label="Getting post" />;
    else if (!post) return <Empty label={`No such post`} />;
    else if (!preview) return <Empty label={`Invalid letter data`} />;
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
            {/* Top Navigation */}
            <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} style={styles.nav}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color={textColor} />
                </Pressable>
                <Text style={[styles.brandText, { color: textColor }]}>
                    PennedBy<Text style={{ color: tintColor }}>.me</Text>
                </Text>
                <Pressable style={styles.shareBtn}>
                    <Feather name="share-2" size={22} color={textColor} />
                </Pressable>
            </MotiView>

            <View style={styles.content}>
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "timing", duration: 600 }}
                    style={[styles.letterPaper, { backgroundColor: cardBg, borderColor: borderColor }]}
                >
                    {/* Letterhead */}
                    <View style={styles.letterhead}>
                        <View>
                            <Text style={[styles.label, { color: tintColor }]}>FROM THE DESK OF</Text>
                            <Text style={[styles.authorName, { color: textColor }]}>Jay</Text>
                        </View>
                        <View style={styles.dateBox}>
                            <Text style={[styles.dateText, { color: textColor, opacity: 0.5 }]}>MAY 05, 2026</Text>
                        </View>
                    </View>

                    {/* SVG Canvas Area */}
                    <View style={styles.canvasContainer}>
                        {/* 
                This is where your SVG / Reanimated logic goes. 
                You would map `speed` to your stroke animation duration.
             */}
                        <PreviewSVG
                            viewBox={preview.viewBox}
                            strokeItems={preview.strokeItems}
                            stroke={preview.color}
                            strokeWidth={preview.size}
                            loopDelayMS={3000}
                            isLooping
                        />

                        {!isPlaying && (
                            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.playOverlay}>
                                <Pressable
                                    onPress={() => setIsPlaying(true)}
                                    style={[styles.mainPlayBtn, { backgroundColor: tintColor }]}
                                >
                                    <Feather name="play" size={32} color="white" />
                                </Pressable>
                                <Text style={[styles.hintText, { color: textColor }]}>Tap to watch the ink flow</Text>
                            </MotiView>
                        )}

                        {isPlaying && (
                            <Text style={{ color: textColor, opacity: 0.3, fontStyle: "italic" }}>
                                [Animated SVG Path Playing at {speed}x...]
                            </Text>
                        )}
                    </View>

                    {/* Controls Footer */}
                    <View style={[styles.controls, { borderTopColor: borderColor }]}>
                        <View style={styles.speedRow}>
                            <Text style={[styles.controlLabel, { color: textColor }]}>Playback Speed</Text>
                            <View style={styles.speedToggles}>
                                {[0.5, 1, 2].map((s) => (
                                    <Pressable
                                        key={s}
                                        onPress={() => setSpeed(s)}
                                        style={[styles.speedBtn, speed === s && { backgroundColor: tintColor }]}
                                    >
                                        <Text
                                            style={[styles.speedBtnText, { color: speed === s ? "white" : textColor }]}
                                        >
                                            {s}x
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Audio Section */}
                        <Pressable style={[styles.audioPlayer, { backgroundColor: bgColor }]}>
                            <Feather name="volume-2" size={20} color={tintColor} />
                            <View style={styles.audioTrack}>
                                <View style={[styles.audioProgress, { backgroundColor: tintColor, width: "40%" }]} />
                            </View>
                            <Text style={[styles.audioTime, { color: textColor }]}>0:12 / 0:45</Text>
                        </Pressable>
                    </View>
                </MotiView>
            </View>
        </SafeAreaView>
    );
}
function useColors() {
    // Theme Colors
    const textColor = useThemeColor({ light: "#1a1a1a", dark: "#f1f1f1" }, "text");
    const bgColor = useThemeColor({ light: "#FDFCF8", dark: "#0f0f0f" }, "background");
    const tintColor = useThemeColor({ light: "#8B4513", dark: "#D2B48C" }, "tint");
    const borderColor = useThemeColor({ light: "#E5E0D0", dark: "#333" }, "border");
    const cardBg = useThemeColor({ light: "#FFFFFF", dark: "#1A1A1A" }, "card");
    return { cardBg, textColor, tintColor, bgColor, borderColor };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    nav: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        height: 60,
    },
    backBtn: { padding: 8 },
    shareBtn: { padding: 8 },
    brandText: {
        fontSize: 18,
        fontWeight: "800",
        letterSpacing: -0.5,
    },
    content: {
        flex: 1,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    letterPaper: {
        width: "100%",
        maxWidth: 600, // iPad/Web Optimization
        height: "90%",
        borderRadius: 8,
        borderWidth: 1,
        padding: 24,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.05,
                shadowRadius: 20,
            },
            web: { boxShadow: "0 20px 40px rgba(0,0,0,0.05)" },
        }),
    },
    letterhead: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 40,
    },
    label: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 2,
        marginBottom: 4,
    },
    authorName: {
        fontSize: 28,
        fontWeight: "700",
        fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    },
    dateBox: {
        paddingTop: 12,
    },
    dateText: {
        fontSize: 11,
        fontWeight: "600",
    },
    canvasContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    playOverlay: {
        alignItems: "center",
    },
    mainPlayBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    hintText: {
        fontSize: 14,
        opacity: 0.6,
        fontWeight: "500",
    },
    controls: {
        borderTopWidth: 1,
        paddingTop: 20,
    },
    speedRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    controlLabel: {
        fontSize: 13,
        fontWeight: "600",
        opacity: 0.8,
    },
    speedToggles: {
        flexDirection: "row",
        gap: 8,
    },
    speedBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "transparent",
    },
    speedBtnText: {
        fontSize: 12,
        fontWeight: "700",
    },
    audioPlayer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 12,
        gap: 12,
    },
    audioTrack: {
        flex: 1,
        height: 4,
        backgroundColor: "rgba(0,0,0,0.05)",
        borderRadius: 2,
        overflow: "hidden",
    },
    audioProgress: {
        height: "100%",
    },
    audioTime: {
        fontSize: 11,
        fontWeight: "600",
        opacity: 0.7,
    },
});
