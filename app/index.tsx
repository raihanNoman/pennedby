import Features from "@/components/_main/features";
import Hero from "@/components/_main/hero";
import Button from "@/components/Button";
import Haptic from "@/components/Haptics";
import NewPostBtn from "@/components/NewPostBtn";
import { SVG_DATA } from "@/components/sketch/data";
import PreviewSVG from "@/components/sketch/PreviewSVG";
import { Card, Text, useThemeColor } from "@/components/Themed";
import { SAFE_SCREEN_WIDTH } from "@/constants/Platform";
import { useRouter } from "expo-router";
import { useCallback } from "react";
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

  const navWrite = useCallback(() => {
    router.push({ pathname: "/write/set-presets" });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Hero
          kicker="INTENTIONAL COMMUNICATION"
          title={`Proof of Life in the\nAge of Automation.`}
          subtitle=" In a world flooded by AI agents and instant templates, the stroke of a
        human hand is the ultimate proof of care. PennedBy.me turns your digital
        touch into a cinematic experience."
        />

        <Card id="Letter To User" style={styles.letter}>
          <PreviewSVG strokeItems={SVG_DATA[2]} loopDelayMS={800} isLooping />
        </Card>

        <Button
          title="Get Started"
          onPress={navWrite}
          onPressIn={Haptic.select}
          active
          containerStyle={{
            width: "100%",
            maxWidth: SAFE_SCREEN_WIDTH,
            marginBottom: 24,
          }}
        />

        <Features
          features={[
            {
              icon: "feather",
              title: "Handwritten Only",
              desc: "No fonts. No keyboards. Just the raw path of your hand, captured and replayed.",
            },
            {
              icon: "clock",
              title: "Slowed Down",
              desc: "Control the playback speed. Force the world to slow down and read your intent.",
            },
            {
              icon: "mic",
              title: "Voice & Ink",
              desc: "Sync your spoken words with your writing for a multisensory personal note.",
            },
            {
              icon: "code",
              title: "Founder Embeds",
              desc: "Integrate personal welcome notes directly into your website via our secure iframe.",
            },
          ]}
        />

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
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: subText }]}>
            PennedBy.me © 2026 {"\n"}Built for the few who still write.
          </Text>
        </View>
      </ScrollView>

      <NewPostBtn />
    </SafeAreaView>
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

  letter: {
    borderRadius: 20,
    marginBottom: 12,
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
