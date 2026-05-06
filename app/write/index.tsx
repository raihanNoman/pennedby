import { useAppDispatch } from "@/_redux/hooks";
import { setPreview } from "@/_redux/new-post";
import Button from "@/components/Button";
import Haptic from "@/components/Haptics";
import Sketch from "@/components/sketch/Sketch";
import { SketchRef } from "@/components/sketch/type";
import { useViewBox } from "@/components/sketch/useSketch";
import { Card, Icon } from "@/components/Themed";
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
  const mode = useMemo(
    () => getMode(params.mode ? params.mode : "business")!,
    [],
  );
  // bg color vibes
  const router = useRouter();
  const isDark = useTheme().dark;
  const sketchRef = useRef<SketchRef>(null);
  const { viewBoxRef, setViewBox } = useViewBox();
  const [color, setColor] = useState(isDark ? darkColors[0] : colors[0]);
  const [strokeWidth, setStrokeWidth] = useState(5);

  // actions
  const undoStroke = useCallback(() => sketchRef.current?.clearCanvas(), []);
  const clearCanvas = useCallback(() => sketchRef.current?.clearCanvas(), []);
  const incrementSize = useCallback(
    () => setStrokeWidth((prev) => getSafeIdx(prev, widths.length).increment()),
    [],
  );
  const decrementSize = useCallback(
    () => setStrokeWidth((prev) => getSafeIdx(prev, widths.length).decrement()),
    [],
  );
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
      Alert(
        "Cannot Preview Empty Letter",
        "Try writing something down with your styles.",
      );
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
    router.push({ pathname: "/write/preview" });
  };

  return (
    <View>
      <Stack.Screen options={{ headerShadowVisible: false, title: "" }} />

      <LinearGradient
        colors={isDark ? mode.colors : mode?.darkColors}
        style={[StyleSheet.absoluteFill, styles.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Card
        onLayout={setViewBox}
        style={{
          alignSelf: "center",
          borderRadius: styles.canvasWrapper.borderRadius,
        }}
      >
        <View style={[styles.canvasWrapper]}>
          <Sketch
            ref={sketchRef}
            strokeColor={color}
            strokeWidth={strokeWidth}
            bgColor="transparent"
          />
        </View>
      </Card>

      <View style={styles.actionBox}>
        <Pressable
          onPress={undoStroke}
          onPressIn={Haptic.warn}
          style={styles.actionBtn}
        >
          <Icon size={size}>
            <Octicons name="undo" />
          </Icon>
        </Pressable>

        <Pressable
          onPress={clearCanvas}
          onPressIn={Haptic.heavy}
          style={styles.actionBtn}
        >
          <Icon size={size}>
            <Octicons name="x" />
          </Icon>
        </Pressable>

        <Pressable
          onPress={incrementSize}
          onPressIn={Haptic.success}
          style={styles.actionBtn}
        >
          <Icon size={size}>
            <Octicons name="plus" />
          </Icon>
        </Pressable>
        <Pressable
          onPress={decrementSize}
          onPressIn={Haptic.mid}
          style={styles.actionBtn}
        >
          <Icon size={size}>
            <Octicons name="dash" />
          </Icon>
        </Pressable>

        <Pressable
          onPress={changeColor}
          onPressIn={Haptic.select}
          style={styles.actionBtn}
        >
          <View style={[StyleSheet.absoluteFill, { backgroundColor: color }]} />
        </Pressable>
      </View>

      <Button title="Reset" onPressIn={Haptic.heavy} onPress={clearCanvas} />
      <Button
        title="Get"
        active
        onPressIn={Haptic.success}
        onPress={navPreview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  canvasWrapper: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    alignSelf: "center",
    margin: 4,

    width: SAFE_SCREEN_WIDTH - 32,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    padding: 32,
    justifyContent: "space-between",
  },
  actionBox: { justifyContent: "space-evenly" },
  actionBtn: {
    height: size * 1.5,
    width: size * 1.5,
    borderRadius: (size * 1.5) / 2,
  },
});
