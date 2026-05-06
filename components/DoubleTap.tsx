import React, { memo, PropsWithChildren, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Haptic from "./Haptics";

interface props extends PropsWithChildren {
  onPress?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onPressIn?: () => void; // Added
  onPressOut?: () => void; // Added
  style?: StyleProp<ViewStyle>;
  delayDoublePress?: number;
  delayLongPress?: number;
}

function _DoubleTap({
  children,
  onPress,
  onDoubleTap,
  onLongPress,
  onPressIn,
  onPressOut,
  style,
  delayDoublePress = 200, // Adjusted to 200ms (standard for double tap detection)
  delayLongPress = 350,
}: props) {
  const multiTap = useMemo(() => {
    // 1. Base gesture to handle PressIn / PressOut globally
    const touchHandler = Gesture.Manual()
      .onTouchesDown(() => {
        onPressIn?.();
      })
      .onTouchesUp(() => {
        onPressOut?.();
      })
      .onTouchesCancelled(() => {
        onPressOut?.();
      })
      .runOnJS(true);

    const longPress = Gesture.LongPress()
      .minDuration(delayLongPress)
      .onStart(() => {
        onLongPress?.();
        Haptic.heavy();
      })
      .runOnJS(true);

    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onStart(() => {
        onDoubleTap?.();
        Haptic.success();
      })
      .maxDelay(delayDoublePress)
      .runOnJS(true);

    const singleTap = Gesture.Tap()
      .requireExternalGestureToFail(doubleTap)
      .onStart(() => {
        Haptic.select();
        onPress?.();
      })
      .runOnJS(true);

    // Use Simultaneous so touchHandler tracks "In/Out" while the others handle the logic
    return Gesture.Simultaneous(
      touchHandler,
      Gesture.Race(longPress, Gesture.Exclusive(doubleTap, singleTap)),
    );
  }, [
    onPress,
    onDoubleTap,
    onLongPress,
    onPressIn,
    onPressOut,
    delayLongPress,
    delayDoublePress,
  ]);

  return (
    <GestureDetector gesture={multiTap}>
      <Animated.View pointerEvents={"box-only"} style={style}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const DoubleTap = memo(_DoubleTap);
DoubleTap.displayName = "DoubleTapButton";
export default DoubleTap;
