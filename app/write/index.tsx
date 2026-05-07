import { useAppDispatch } from "@/_redux/hooks";
import { setPreview } from "@/_redux/new-post";
import Button from "@/components/Button";
import Haptic from "@/components/Haptics";
import Sketch from "@/components/sketch/Sketch";
import { SketchRef } from "@/components/sketch/type";
import { useViewBox } from "@/components/sketch/useSketch";
import { Card } from "@/components/Themed";
import { SAFE_SCREEN_WIDTH } from "@/constants/Platform";
import { getMode } from "@/constants/Presets";
import { Alert } from "@/utils/Alert";
import { getArrayByRange, getSafeIdx } from "@/utils/get";
import { Octicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const colors = ["#000", "#000dff"];
const darkColors = ["#fff", "#009dff"];
const widths = getArrayByRange(1, 10);
const size = 20;

export default function NewWriting() {
    const dispatch = useAppDispatch();
    const params = useLocalSearchParams() as { mode?: string };
    const mode = useMemo(() => getMode(params.mode ? params.mode : "business")!, []);
    const router = useRouter();
    const isDark = useTheme().dark;
    const sketchRef = useRef<SketchRef>(null);
    const { viewBoxRef, setViewBox } = useViewBox();
    const [color, setColor] = useState(isDark ? darkColors[0] : colors[0]);
    const [strokeWidth, setStrokeWidth] = useState(5);

    // actions
    const undoStroke = useCallback(() => sketchRef.current?.clearCanvas(), []);
    const clearCanvas = useCallback(() => sketchRef.current?.clearCanvas(), []);
    const incrementSize = useCallback(() => setStrokeWidth((prev) => getSafeIdx(prev, widths.length).increment()), []);
    const decrementSize = useCallback(() => setStrokeWidth((prev) => getSafeIdx(prev, widths.length).decrement()), []);
    const changeColor = useCallback(() => {
        setColor((prev) => {
            const palette = isDark ? darkColors : colors;

            const currentIndex = palette.indexOf(prev);
            const safeIndex = currentIndex === -1 ? 0 : currentIndex;

            const nextIndex = (safeIndex + 1) % palette.length;

            return palette[nextIndex];
        });
    }, [isDark]);

    const navPreview = () => {
        const strokes = sketchRef.current?.getStrokeItems();

        if (!strokes) {
            Alert("Cannot Preview Empty Letter", "Try writing something down with your styles.");
            return;
        }

        dispatch(
            setPreview({
                viewBox: `0 0 ${viewBoxRef.current.width} ${viewBoxRef.current.height}`,
                strokeItems: strokes,
                color: color,
                size: strokeWidth,
            }),
        );

        // router.push({ pathname: "/write/add-voice" }); // todo: future : add rules and recording
        router.push({ pathname: "/write/preview", params });
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerTransparent: true, title: "" }} />

            <LinearGradient
                colors={isDark ? mode.colors : mode?.darkColors}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <View style={styles.mainContent}>
                <Card onLayout={setViewBox} style={styles.cardContainer}>
                    <View style={styles.canvasWrapper}>
                        <Sketch ref={sketchRef} strokeColor={color} strokeWidth={strokeWidth} bgColor="transparent" />
                    </View>
                </Card>

                {/* REFINED ACTION TOOLBAR */}
                <View style={styles.actionBox}>
                    <Pressable onPress={undoStroke} onPressIn={Haptic.warn} style={styles.actionBtn}>
                        <Octicons name="undo" size={size} color={isDark ? "#fff" : "#000"} />
                    </Pressable>

                    <Pressable onPress={incrementSize} onPressIn={Haptic.success} style={styles.actionBtn}>
                        <Octicons name="plus" size={size} color={isDark ? "#fff" : "#000"} />
                    </Pressable>

                    {/* Color Indicator with Border for visibility */}
                    <Pressable onPress={changeColor} onPressIn={Haptic.select} style={styles.colorBtn}>
                        <View style={[styles.colorPreview, { backgroundColor: color }]} />
                    </Pressable>

                    <Pressable onPress={decrementSize} onPressIn={Haptic.mid} style={styles.actionBtn}>
                        <Octicons name="dash" size={size} color={isDark ? "#fff" : "#000"} />
                    </Pressable>

                    <Pressable onPress={clearCanvas} onPressIn={Haptic.heavy} style={styles.actionBtn}>
                        <Octicons name="trash" size={size} color="#ff4444" />
                    </Pressable>
                </View>
            </View>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <Button
                    title="Preview Letter"
                    active
                    onPressIn={Haptic.success}
                    onPress={navPreview}
                    style={styles.submitBtn}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 40,
    },
    cardContainer: {
        borderRadius: 24,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    canvasWrapper: {
        width: SAFE_SCREEN_WIDTH - 40,
        aspectRatio: 1, // Keeps it square and responsive
        overflow: "hidden",
        borderRadius: 24,
    },
    actionBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(255, 255, 255, 0.15)", // Glass effect
        backdropFilter: "blur(10px)", // For web support
        padding: 8,
        borderRadius: 40,
        marginTop: 30,
        width: Math.min(SAFE_SCREEN_WIDTH - 60, 400), // Constraint for Tablets
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    actionBtn: {
        height: 48,
        width: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        // Use semi-transparent background for buttons
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    colorBtn: {
        height: 54,
        width: 54,
        borderRadius: 27,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.5)",
    },
    colorPreview: {
        height: 36,
        width: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: "#fff",
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    submitBtn: {
        width: "100%",
        maxWidth: 500,
        alignSelf: "center",
    },
});
