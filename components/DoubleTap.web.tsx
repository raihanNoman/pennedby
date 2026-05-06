import React, { PropsWithChildren, useCallback, useRef } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface props extends PropsWithChildren {
    onPress?: () => void;
    onDoubleTap?: () => void;
    onLongPress?: () => void;
    onPressIn?: () => void; // Added
    onPressOut?: () => void; // Added
    style?: StyleProp<ViewStyle>;
}

const DOUBLE_TAP_DELAY = 300;
const LONG_PRESS_DELAY = 500;

export default function DoubleTap({ children, onPress, onDoubleTap, onLongPress, onPressIn, onPressOut, style }: props) {
    const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
    const singleTapTimeout = useRef<NodeJS.Timeout | null>(null);
    const lastTapTime = useRef<number>(0);
    const isLongPress = useRef<boolean>(false);
    const isInteracting = useRef<boolean>(false); // Track active touch/click

    const handlePressStart = useCallback(() => {
        isInteracting.current = true;
        isLongPress.current = false;

        // Trigger PressIn immediately
        onPressIn?.();

        if (onLongPress) {
            longPressTimeout.current = setTimeout(() => {
                isLongPress.current = true;
                onLongPress();
            }, LONG_PRESS_DELAY);
        }
    }, [onLongPress, onPressIn]);

    const handlePressEnd = useCallback(() => {
        if (!isInteracting.current) return;
        isInteracting.current = false;

        // Trigger PressOut immediately
        onPressOut?.();

        if (longPressTimeout.current) {
            clearTimeout(longPressTimeout.current);
            longPressTimeout.current = null;
        }
    }, [onPressOut]);

    const handleTap = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            if (isLongPress.current) {
                return;
            }

            const now = Date.now();
            const timeSinceLastTap = now - lastTapTime.current;

            if (timeSinceLastTap < DOUBLE_TAP_DELAY) {
                if (singleTapTimeout.current) {
                    clearTimeout(singleTapTimeout.current);
                    singleTapTimeout.current = null;
                }
                onDoubleTap?.();
            } else {
                lastTapTime.current = now;
                singleTapTimeout.current = setTimeout(() => {
                    onPress?.();
                    singleTapTimeout.current = null;
                }, DOUBLE_TAP_DELAY);
            }
        },
        [onPress, onDoubleTap],
    );

    const divProps: React.DOMAttributes<HTMLDivElement> = {
        onMouseDown: handlePressStart,
        onMouseUp: (e) => {
            handleTap(e);
            handlePressEnd();
        },
        onMouseLeave: handlePressEnd, // Ensure PressOut fires if mouse drags away
        onTouchStart: (e) => {
            handlePressStart();
        },
        onTouchEnd: (e) => {
            handleTap(e);
            handlePressEnd();
            // Only preventDefault if you want to swallow standard click behavior
            // which is usually desired for custom gesture handlers
            if (e.cancelable) e.preventDefault();
        },
        onContextMenu: (e) => e.preventDefault(),
    };

    return (
        <View {...(divProps as any)} style={[style, { cursor: "pointer" }]}>
            {children}
        </View>
    );
}
