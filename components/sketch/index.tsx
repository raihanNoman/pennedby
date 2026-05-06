// import Button from "@/components/Button";
import { Card, useThemeColor } from "@/components/Themed";
import { SAFE_SCREEN_WIDTH } from "@/constants/Platform";
import print from "@/utils/print";
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Sketch from "./Sketch";
import { SketchRef } from "./type";
import { useViewBox } from "./useSketch";

export default function SketchDemo() {
  const sketchRef = useRef<SketchRef>(null);
  const { viewBoxRef, setViewBox } = useViewBox();
  const color = useThemeColor({ dark: "#fff" }, "text");

  function clearCanvas() {
    sketchRef.current?.clearCanvas();
  }

  function getSketch() {
    const strokes = sketchRef.current?.getStrokeItems();

    const res = {
      strokes: strokes, // Array of "M... L..." strings
      viewBox: `0 0 ${viewBoxRef.current.width} ${viewBoxRef.current.height}`,
      width: viewBoxRef.current.width,
      height: viewBoxRef.current.height,
    };

    print(res);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Card
        onLayout={setViewBox}
        style={{
          alignSelf: "center",
          borderRadius: styles.canvasWrapper.borderRadius,
        }}
      >
        <View
          style={[
            styles.canvasWrapper,
            {
              aspectRatio: 1,
              width: SAFE_SCREEN_WIDTH - 32,
              overflow: "hidden",
            },
          ]}
        >
          <Sketch
            ref={sketchRef}
            strokeColor={color}
            strokeWidth={7}
            bgColor="transparent"
          />
        </View>
      </Card>

      {/* <Button title="Reset" onPressIn={Haptic.heavy} onPress={clearCanvas} />
      <Button
        title="Get"
        active
        onPressIn={Haptic.success}
        onPress={getSketch}
      /> */}
    </SafeAreaView>
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
  },
});
