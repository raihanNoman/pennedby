import { StyleSheet } from "react-native";
import React, { useCallback, useRef, useImperativeHandle, forwardRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef, type CanvasPath } from "react-sketch-canvas";
import { StrokeItem } from "@/arabic/letters/toSVGpaths";
import useSketch from "./useSketch";
import { SketchRef, SketchProps } from "./type";

const Sketch = forwardRef<SketchRef, SketchProps>(
    ({ strokeColor = "#888", strokeWidth = 6, bgColor = "black" }, ref) => {
        // Accessing logic from your hook just like the mobile version
        const { strokes, setStrokes, ensureBaseTime, strokeStartRef, clearTimers } = useSketch();

        const canvasRef = useRef<ReactSketchCanvasRef>(null);
        const lastPathCountRef = useRef(0);
        const [isDistrictsMode, setDiatricsMode] = useState(false);

        // Expose the same API to the parent
        useImperativeHandle(ref, () => ({
            clearCanvas: () => {
                canvasRef.current?.clearCanvas();
                clearTimers();
                setStrokes([]);
                lastPathCountRef.current = 0;
            },
            getStrokeItems: () => strokes,
            getStrokes: () => strokes.map((item) => item.points),
            setDiatricsMode: (enabled: boolean) => setDiatricsMode(enabled),
        }));

        const onChange_Web = useCallback(
            (updatedPaths: CanvasPath[]) => {
                const prevCount = lastPathCountRef.current;
                const nextCount = updatedPaths.length;

                // Detect NEW stroke start
                if (nextCount > prevCount) {
                    const base = ensureBaseTime();
                    strokeStartRef.current = performance.now() - base;
                }

                lastPathCountRef.current = nextCount;
            },
            [ensureBaseTime, strokeStartRef],
        );

        const handleStrokeEnd_Web = useCallback(
            (path: CanvasPath) => {
                // Web-specific check: path.paths contains the points
                if (!path?.paths || path.paths.length < 2) return;

                const base = ensureBaseTime();
                const endRelative = performance.now() - base;

                const item: StrokeItem = {
                    diatric: isDistrictsMode,
                    points: path.paths, // ReactSketchCanvas points already match {x, y}
                    startTime: strokeStartRef.current ?? endRelative,
                    endTime: endRelative,
                };

                setStrokes((prev) => [...prev, item]);
                strokeStartRef.current = null;
            },
            [ensureBaseTime, setStrokes, strokeStartRef, isDistrictsMode],
        );

        return (
            <ReactSketchCanvas
                ref={canvasRef}
                onStroke={handleStrokeEnd_Web}
                onChange={onChange_Web}
                style={{ ...styles.canvas, ...border }}
                strokeWidth={strokeWidth}
                canvasColor={bgColor}
                strokeColor={isDistrictsMode ? "red" : strokeColor}
            />
        );
    },
);

export default Sketch;

const border = {
    border: "0.0625rem solid #9c9c9c",
    borderRadius: "0.25rem",
};

const styles = StyleSheet.create({
    canvas: {
        flex: 1,
        height: "10%",
        width: "100%",
        alignSelf: "center",
    },
});
