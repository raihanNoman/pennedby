import { Path, SketchCanvas } from "@sourcetoad/react-native-sketch-canvas";
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { StyleSheet } from "react-native";
import { Point, StrokeItem } from "./toSVGpaths";
import { SketchProps, SketchRef } from "./type";
import useSketch from "./useSketch";

// Define the interface for the actions we want to expose to the parent

const Sketch = forwardRef<SketchRef, SketchProps>(
  (
    {
      strokeColor = "#888",
      strokeWidth = 6,
      bgColor = "black",
      onStrokeStart,
      onStrokeEnd,
      style,
    },
    ref,
  ) => {
    const { strokes, setStrokes, ensureBaseTime, strokeStartRef, clearTimers } =
      useSketch();
    const canvasRef = useRef<SketchCanvas>(null);
    const [isDistrictsMode, setDiatricsMode] = useState(false);

    // Internal state to track strokes if you want to expose them via ref

    // This hook defines what the parent sees when they use the ref
    useImperativeHandle(ref, () => ({
      clearCanvas: () => {
        canvasRef.current?.clear();
        clearTimers();
        setStrokes([]); // Clear local state
      },
      getStrokeItems: () => strokes,
      getStrokes: () => strokes.map((item) => item.points),
      setDiatricsMode: (enabled: boolean) => setDiatricsMode(enabled),
    }));

    const setStartTime = useCallback(() => {
      onStrokeStart?.();
      const base = ensureBaseTime();
      strokeStartRef.current = performance.now() - base;
    }, [onStrokeStart, ensureBaseTime, strokeStartRef]);

    const handleStrokeEnd = useCallback(
      (path: Path) => {
        if (!path?.path?.data?.length) return;

        const base = ensureBaseTime();
        const endRelative = performance.now() - base;

        const points: Point[] = path.path.data.map((str) => {
          const [xStr, yStr] = str.split(",");
          return { x: parseFloat(xStr), y: parseFloat(yStr) };
        });

        if (points.length < 1) return;

        const startTime = strokeStartRef.current ?? endRelative;

        const newItem: StrokeItem = {
          diatric: isDistrictsMode,
          points,
          startTime: Math.round(startTime),
          endTime: Math.round(endRelative),
        };

        // Update both the prop state and the internal ref state
        setStrokes((prev) => {
          const next = [...prev, newItem];
          queueMicrotask(() => onStrokeEnd?.(next));
          return next;
        });
        strokeStartRef.current = null;
      },
      [
        ensureBaseTime,
        setStrokes,
        strokeStartRef,
        onStrokeEnd,
        isDistrictsMode,
      ],
    );

    return (
      <SketchCanvas //
        ref={canvasRef}
        onStrokeStart={setStartTime}
        style={[styles.canvas, { backgroundColor: bgColor }, style]}
        strokeColor={isDistrictsMode ? "red" : strokeColor}
        strokeWidth={strokeWidth}
        onStrokeEnd={handleStrokeEnd}
      />
    );
  },
);

export default Sketch;

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignSelf: "center",
  },
});
