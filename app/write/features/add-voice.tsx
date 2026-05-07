import { Feather } from "@expo/vector-icons";
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder } from "expo-audio";
import { useRouter } from "expo-router";
import { AnimatePresence, MotiView } from "moti";
import { useEffect } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import Haptic from "@/components/Haptics";
import { Text, useThemeColor } from "@/components/Themed";
import { Alert } from "@/utils/Alert";

function usePermission() {
    useEffect(() => {
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                Alert("Permission to access microphone was denied");
            }
        })();
    }, []);
}

export default function AddVoicePage() {
    const router = useRouter();
    usePermission();

    // High-performance recorder from expo-audio
    const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

    const tint = useThemeColor({ light: "#8B4513", dark: "#D2B48C" }, "tint");
    const textColor = useThemeColor({ light: "#1a1a1a", dark: "#f1f1f1" }, "text");
    const bgColor = useThemeColor({ light: "#FDFCF8", dark: "#0f0f0f" }, "background");

    const startRecording = async () => {
        await setAudioModeAsync({
            playsInSilentMode: true,
            allowsRecording: true,
        });
        await recorder.prepareToRecordAsync({
            web: {
                mimeType: "audio/mp4",
            },
        });

        Haptic.success();
        recorder.record();
    };

    const stopRecording = async () => {
        Haptic.select();
        await recorder.stop();

        // The URI of the recorded file
        const uri = recorder.uri;
        console.log("Recording saved at:", uri);

        // Proceed to the next step
        router.push({
            pathname: "/write/features/set-rules",
            params: { voiceUri: uri },
        });
    };

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <View style={styles.header}>
                <Text style={[styles.label, { color: tint }]}>STEP 2: THE NARRATIVE</Text>
                <Text style={[styles.title, { color: textColor }]}>Speak your intent.</Text>
                <Text style={styles.subtitle}>
                    Your voice adds a soul to the stroke. Describe the philosophy behind this piece.
                </Text>
            </View>

            <View style={styles.recordContainer}>
                <AnimatePresence>
                    {recorder.isRecording && (
                        <MotiView
                            from={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.6, opacity: 0.15 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{
                                loop: true,
                                type: "timing",
                                duration: 1200,
                                repeatReverse: false,
                            }}
                            style={[styles.pulse, { backgroundColor: tint }]}
                        />
                    )}
                </AnimatePresence>

                <Pressable
                    onLongPress={startRecording}
                    onPressOut={recorder.isRecording ? stopRecording : undefined}
                    style={({ pressed }) => [
                        styles.recordButton,
                        { backgroundColor: recorder.isRecording ? "#FF3B30" : textColor },
                        pressed && { transform: [{ scale: 0.92 }] },
                    ]}
                >
                    <Feather name={recorder.isRecording ? "mic" : "mic"} size={34} color={bgColor} />
                </Pressable>

                <Text style={[styles.timer, { color: textColor, opacity: recorder.isRecording ? 1 : 0.3 }]}>
                    {recorder.isRecording ? formatTime(recorder.currentTime) : "Hold to Record"}
                </Text>
            </View>

            <View style={styles.footer}>
                {!recorder.isRecording && (
                    <Pressable
                        onPress={() => router.push({ pathname: "/write/features/set-rules" })}
                        style={styles.skipBtn}
                    >
                        <Text style={[styles.skipText, { color: textColor }]}>Skip Narration</Text>
                        <Feather name="chevron-right" size={16} color={textColor} style={{ opacity: 0.4 }} />
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: "space-between" },
    header: { marginTop: 60 },
    label: { fontSize: 11, fontWeight: "900", letterSpacing: 2, marginBottom: 8 },
    title: {
        fontSize: 34,
        fontWeight: "700",
        fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
        letterSpacing: -0.5,
    },
    subtitle: { fontSize: 16, opacity: 0.5, marginTop: 12, lineHeight: 24 },
    recordContainer: { alignItems: "center", justifyContent: "center", flex: 1 },
    recordButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            web: { boxShadow: "0 8px 30px rgba(0,0,0,0.12)" },
        }),
    },
    pulse: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50,
        zIndex: 1,
    },
    timer: {
        marginTop: 32,
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1,
        fontVariant: ["tabular-nums"], // Keeps numbers from jumping
    },
    footer: { marginBottom: 40, alignItems: "center" },
    skipBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
    skipText: { fontSize: 14, fontWeight: "600", opacity: 0.6 },
});
