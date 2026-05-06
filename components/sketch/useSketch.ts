import { useCallback, useRef, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import { StrokeItem } from "./toSVGpaths";

export default function useSketch() {
  const [strokes, setStrokes] = useState<StrokeItem[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const strokeStartRef = useRef<number | null>(null);

  const ensureBaseTime = useCallback(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }
    return startTimeRef.current;
  }, []);

  const clearTimers = useCallback(() => {
    startTimeRef.current = null;
    strokeStartRef.current = null;
    setStrokes([]);
  }, []);

  return {
    strokes,
    setStrokes,
    clearTimers,

    ensureBaseTime,
    strokeStartRef,
  };
}

export function useViewBox() {
  const viewBoxRef = useRef({ height: 0, width: 0 });
  const setViewBox = useCallback((event: LayoutChangeEvent) => {
    viewBoxRef.current = event.nativeEvent.layout;
  }, []);

  return { viewBoxRef, setViewBox };
}
