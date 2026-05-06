import { useThemeColor } from "@/components/Themed";
import React, { useEffect, useMemo, useState } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path, SvgProps } from "react-native-svg";
import { scheduleOnRN } from "react-native-worklets";
import { svgPathProperties } from "svg-path-properties";
import { DEFAULT_CANVAS } from "./data";
import { StrokeItem, toSVGpaths } from "./toSVGpaths";

interface props extends SvgProps {
  strokeItems: StrokeItem[];

  onFinish?: () => void;
  isLooping?: boolean;
  loopDelayMS?: number;
  viewBox?: string;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function PreviewSVG({
  strokeItems,
  stroke: strokeColor,
  strokeWidth,
  onFinish,
  isLooping = false,
  viewBox,
  loopDelayMS = 0,
  ...props
}: props) {
  const clock = useSharedValue(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // FIX 1: Add a safety check here.
    // If strokeItems is undefined or empty, do nothing.
    if (!strokeItems || strokeItems.length === 0) {
      setReady(false);
      return;
    }

    let isCancelled = false;
    const totalDuration = getTotalDuration(strokeItems);
    const startTime = strokeItems[0].startTime ?? 0;

    const runAnimation = () => {
      if (isCancelled) return;

      // Reset the clock to the very beginning
      clock.value = startTime;

      clock.value = withTiming(
        totalDuration,
        {
          duration: totalDuration,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished && !isCancelled) {
            // Trigger the onFinish callback
            if (onFinish) {
              // Move to JS thread to call the function
              scheduleOnRN(onFinish);
            }

            // Handle Looping
            if (isLooping) {
              if (loopDelayMS > 0) {
                // Delay then restart
                setTimeout(() => {
                  scheduleOnRN(runAnimation);
                }, loopDelayMS);
              } else {
                scheduleOnRN(runAnimation);
              }
            }
          }
        },
      );
    };

    setReady(false);
    cancelAnimation(clock);

    requestAnimationFrame(() => {
      if (isCancelled) return;
      setReady(true);
      runAnimation();
    });

    return () => {
      isCancelled = true;
      cancelAnimation(clock);
    };
  }, [strokeItems, isLooping, loopDelayMS]); // Re-run if loop settings change

  // ... rest of your memoized paths and rendering remains the same
  const paths = useMemo(() => {
    // FIX 2: Ensure we don't call .map on undefined
    if (!strokeItems || strokeItems.length === 0) return [];

    return strokeItems.map((stroke) => {
      const d = toSVGpaths([stroke.points])[0];
      // Safety check for empty paths
      if (!d) return { d: "", length: 0, start: 0, end: 0 };

      const properties = new svgPathProperties(d);
      const length = properties.getTotalLength();
      return {
        d,
        length,
        start: stroke.startTime ?? 0,
        end: stroke.endTime ?? 0,
      };
    });
  }, [strokeItems]);

  // FIX 3: Robust return check
  if (!strokeItems || strokeItems.length === 0) return null;
  return (
    <Svg
      key={strokeItems.length}
      viewBox={
        viewBox || `0 0 ${DEFAULT_CANVAS.width} ${DEFAULT_CANVAS.height}`
      }
      width="100%"
      height="100%"
      {...props}
    >
      {ready &&
        paths?.map(({ d, length, start, end }, i) => {
          return (
            <AnimatedStroke
              key={i}
              length={length}
              d={d}
              start={start}
              end={end}
              clock={clock}
              strokeColor={strokeColor}
              strokeWidth={strokeWidth}
            />
          );
        })}
    </Svg>
  );
}

function AnimatedStroke({
  d,
  length,
  start,
  end,
  clock,
  strokeColor,
  strokeWidth = 14,
}: {
  d: string;
  length: number;
  start: number;
  end: number;
  clock: SharedValue<number>;
  strokeColor: SvgProps["stroke"];
  strokeWidth?: SvgProps["strokeWidth"];
}) {
  strokeColor = strokeColor ?? useThemeColor({}, "text");

  const animatedProps = useAnimatedProps(() => {
    const currentTime = clock.value;

    if (currentTime <= start) {
      return { strokeDashoffset: length };
    }

    if (currentTime >= end) {
      return { strokeDashoffset: 0 };
    }

    const duration = end - start;

    if (duration <= 0) {
      return { strokeDashoffset: 0 };
    }

    const progress = duration > 0 ? (currentTime - start) / duration : 1;

    return {
      strokeDashoffset: length * (1 - progress),
    };
  });

  return (
    <AnimatedPath
      d={d}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={length}
      strokeDashoffset={length} // 👈 THIS FIXES THE FLASH
      animatedProps={animatedProps}
    />
  );
}

function getTotalDuration(strokes: StrokeItem[]) {
  if (!strokes || strokes.length === 0) return 0;

  const firstStroke = strokes?.[0];
  const lastStroke = strokes?.[strokes.length - 1];

  if (!firstStroke || !lastStroke) return 0;

  const startTime = firstStroke.startTime ?? 0;
  const endTime = lastStroke.endTime ?? 0;

  return Math.max(0, endTime - startTime);
}
