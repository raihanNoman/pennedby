import NewPostBtn from "@/components/NewPostBtn";
import { Text, useThemeColor } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MotiText, MotiView } from "moti";
import React from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function HomePage() {
  const router = useRouter();
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 1000 }}
          >
            <Text style={[styles.kicker, { color: tintColor }]}>
              INTENTIONAL COMMUNICATION
            </Text>
          </MotiView>

          <MotiText
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200 }}
            style={[styles.headline, { color: textColor }]}
          >
            Proof of Life in the{"\n"}Age of Automation.
          </MotiText>

          <MotiText
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 400 }}
            style={[styles.subheadline, { color: subText }]}
          >
            In a world flooded by AI agents and instant templates, the stroke of
            a human hand is the ultimate proof of care. PennedBy.me turns your
            digital touch into a cinematic experience.
          </MotiText>
        </View>

        {/* Feature Grid */}
        <View style={styles.grid}>
          <FeatureCard
            icon="feather"
            title="Handwritten Only"
            desc="No fonts. No keyboards. Just the raw path of your hand, captured and replayed."
          />
          <FeatureCard
            icon="clock"
            title="Slowed Down"
            desc="Control the playback speed. Force the world to slow down and read your intent."
          />
          <FeatureCard
            icon="mic"
            title="Voice & Ink"
            desc="Sync your spoken words with your writing for a multisensory personal note."
          />
          <FeatureCard
            icon="code"
            title="Founder Embeds"
            desc="Integrate personal welcome notes directly into your website via our secure iframe."
          />
        </View>

        {/* The Manifesto Section */}
        <View style={[styles.manifesto, { borderTopColor: tintColor + "33" }]}>
          <Text style={[styles.manifestoText, { color: textColor }]}>
            “The keyboard is for efficiency.{"\n"}The pen is for{" "}
            <Text style={{ color: tintColor, fontStyle: "italic" }}>
              meaning.
            </Text>
            ”
          </Text>
        </View>

        {/* Call to Action Area */}
        <View style={styles.ctaSection}>
          <Text style={[styles.ctaHint, { color: subText }]}>
            Ready to leave your mark?
          </Text>
          <NewPostBtn />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: subText }]}>
            PennedBy.me © 2026 {"\n"}Built for the few who still write.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  const tintColor = useThemeColor(
    { light: "#8B4513", dark: "#D2B48C" },
    "tint",
  );
  const textColor = useThemeColor(
    { light: "#1a1a1a", dark: "#f1f1f1" },
    "text",
  );
  const cardBg = useThemeColor(
    { light: "#f8f8f8", dark: "#1a1a1a" },
    "background",
  );

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      style={[styles.card, { backgroundColor: cardBg }]}
    >
      <Feather name={icon} size={24} color={tintColor} />
      <Text style={[styles.cardTitle, { color: textColor }]}>{title}</Text>
      <Text style={[styles.cardDesc, { color: textColor, opacity: 0.6 }]}>
        {desc}
      </Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    alignItems: "center",
  },
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
    fontSize: Platform.OS === "web" ? 64 : 42,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: Platform.OS === "web" ? 72 : 48,
    letterSpacing: -1,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  subheadline: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 24,
    lineHeight: 28,
    maxWidth: 600,
    fontWeight: "400",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 20,
    width: "100%",
    maxWidth: 1000,
  },
  card: {
    width: Platform.OS === "web" ? "45%" : "100%",
    minWidth: 300,
    padding: 30,
    borderRadius: 20,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },
  cardDesc: {
    fontSize: 15,
    lineHeight: 22,
  },
  manifesto: {
    marginTop: 80,
    paddingVertical: 60,
    paddingHorizontal: 30,
    borderTopWidth: 1,
    width: "80%",
    alignItems: "center",
  },
  manifestoText: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "300",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  ctaSection: {
    marginTop: 40,
    alignItems: "center",
    gap: 16,
  },
  ctaHint: {
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    marginTop: 100,
    paddingBottom: 40,
    opacity: 0.5,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
  },
});
