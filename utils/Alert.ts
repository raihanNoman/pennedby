import {
    AlertButton,
    AlertOptions,
    Platform,
    Alert as RNAlert,
} from "react-native";

/**
 * A robust polyfill for Alert.alert that works on Web, iOS, and Android.
 * Built to handle dynamic button arrays, missing onPress handlers, and the
 * default 'OK' behavior of React Native.
 */
export const Alert = (
  title: string,
  message?: string,
  buttons?: AlertButton[],
  options?: AlertOptions,
): void => {
  if (Platform.OS !== "web") {
    RNAlert.alert(title, message, buttons, options);
    return;
  }

  // WEB LOGIC
  const alertBody = message ? `${title}\n\n${message}` : title;

  // 1. If no buttons are provided, React Native defaults to a single "OK" button.
  if (!buttons || buttons.length === 0) {
    window.alert(alertBody);
    options?.onDismiss?.();
    return;
  }

  // 2. If exactly one button is provided
  if (buttons.length === 1) {
    const btn = buttons[0];
    window.alert(alertBody);
    btn.onPress?.();
    options?.onDismiss?.();
    return;
  }

  // 3. If two or more buttons are provided, use window.confirm
  // RN Logic for 2 buttons: [Cancel, Positive]
  // RN Logic for 3 buttons: [Neutral, Negative, Positive]
  // We map the last button as "OK" (Positive) and the second to last as "Cancel" (Negative).
  const positiveButton = buttons[buttons.length - 1];
  const negativeButton = buttons[buttons.length - 2];

  // Note: window.confirm UI text (OK/Cancel) is browser-controlled and cannot be changed.
  const result = window.confirm(
    `${alertBody}\n\n[OK: ${positiveButton.text || "OK"}] / [Cancel: ${negativeButton.text || "Cancel"}]`,
  );

  if (result) {
    positiveButton.onPress?.();
  } else {
    negativeButton.onPress?.();
  }

  options?.onDismiss?.();
};
