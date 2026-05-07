import { useThemeColor } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import {
    Authenticator,
    defaultDarkModeOverride,
    ThemeProvider,
} from "@aws-amplify/ui-react-native";
import { PropsWithChildren } from "react";

/**
 * @reference
 * https://ui.docs.amplify.aws/react-native/connected-components/authenticator/customization
 */

export default function AuthProvider({ children }: PropsWithChildren) {
  const colorMode = useColorScheme();
  const primary = useThemeColor({}, "primary");
  const border = useThemeColor({ light: "#8883" }, "border");
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");

  return (
    <ThemeProvider
      // colorMode={colorMode === "unspecified" ? "system" : colorMode}
      colorMode={colorMode}
      theme={{
        overrides: [defaultDarkModeOverride],
        components: {
          textField: {
            //field: { color: textPrimary },
            fieldContainer: {
              borderColor: border,
              width: "100%",
              backgroundColor: background,
            },
          },
          button: {
            textPrimary: { color: text },
            containerPrimary: { backgroundColor: primary },
          },
        },
        tokens: {
          colors: {
            primary: {
              "10": primary,
              "20": primary,
              "40": primary,
              "60": primary,
              "80": primary,
              "90": primary,
              "100": primary,
            },
          },
          radii: { small: "14px" },
        },
      }}
    >
      <Authenticator.Provider>{children}</Authenticator.Provider>
    </ThemeProvider>
  );
}
