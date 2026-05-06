import { isWeb } from "@/constants/Platform";
import { MotiText, MotiView } from "moti";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "../Themed";

export default function Hero({
  kicker = "Summerb",
  title = "Page Title",
  subtitle = "A longer subtitle explainig what this website is about",
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  const tintColor = useThemeColor(
    { light: "#8B4513", dark: "#D2B48C" },
    "tint",
  );
  const textColor = useThemeColor(
    { light: "#1a1a1a", dark: "#f1f1f1" },
    "text",
  );
  const subText = useThemeColor({ light: "#666", dark: "#aaa" }, "text");

  return (
    <View style={styles.hero}>
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 1000 }}
      >
        <Text style={[styles.kicker, { color: tintColor }]}>{kicker}</Text>
      </MotiView>

      <MotiText
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200 }}
        style={[styles.headline, { color: textColor }]}
      >
        {title}
      </MotiText>

      <MotiText
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 400 }}
        style={[styles.subheadline, { color: subText }]}
      >
        {subtitle}
      </MotiText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 30,
    paddingVertical: 80,
    alignItems: "center",
    textAlign: "center",
    maxWidth: 800,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 20,
  },
  headline: {
    fontSize: isWeb ? 64 : 42,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: isWeb ? 72 : 48,
    letterSpacing: -1,
    fontFamily: isWeb ? "Georgia" : "serif",
  },
  subheadline: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 24,
    lineHeight: 28,
    maxWidth: 600,
    fontWeight: "400",
  },
});
