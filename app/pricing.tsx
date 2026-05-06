import { Text, useThemeColor } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import React from "react";
import {
    Dimensions,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Pricing() {
  const tint = useThemeColor({ light: "#8B4513", dark: "#D2B48C" }, "tint");
  const cardBg = useThemeColor(
    { light: "#fdfdfd", dark: "#1a1a1a" },
    "background",
  );
  const textColor = useThemeColor(
    { light: "#1a1a1a", dark: "#f1f1f1" },
    "text",
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={styles.header}
      >
        <Text style={[styles.title, { color: textColor }]}>
          Choose Your Impact
        </Text>
        <Text style={styles.subtitle}>
          From romantic whispers to certified business legacy.
        </Text>
      </MotiView>

      <View style={styles.tierGrid}>
        {/* Tier 1: The Scribe */}
        <View
          style={[
            styles.tierCard,
            { backgroundColor: cardBg, borderColor: tint + "33" },
          ]}
        >
          <Text style={[styles.tierName, { color: tint }]}>THE SCRIBE</Text>
          <Text style={styles.price}>
            $1<Text style={styles.period}>/mo</Text>
          </Text>
          <Text style={styles.priceYearly}>or $10/year</Text>

          <View style={styles.featureList}>
            <FeatureItem icon="send" text="Unlimited Personal Letters" />
            <FeatureItem icon="eye-off" text="Romantic Mode (Disappearing)" />
            <FeatureItem icon="clock" text="Business Mode (24hr Life)" />
            <FeatureItem icon="link" text="Shareable SVG Links" />
          </View>

          <Pressable style={[styles.button, { backgroundColor: tint }]}>
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </View>

        {/* Tier 2: The Authority (Solana) */}
        <View
          style={[
            styles.tierCard,
            { backgroundColor: cardBg, borderColor: tint, borderWidth: 2 },
          ]}
        >
          <View style={[styles.premiumBadge, { backgroundColor: tint }]}>
            <Text style={styles.premiumBadgeText}>SOLANA POWERED</Text>
          </View>
          <Text style={[styles.tierName, { color: tint }]}>THE AUTHORITY</Text>
          <Text style={styles.price}>
            $15<Text style={styles.period}>/mint</Text>
          </Text>
          <Text style={styles.priceYearly}>On-chain Certification</Text>

          <View style={styles.featureList}>
            <FeatureItem icon="shield" text="Solana Signed Wallet Auth" />
            <FeatureItem icon="cpu" text="Mint as NFT (Permanent Legacy)" />
            <FeatureItem icon="lock" text="Secret Certified Messages" />
            <FeatureItem icon="users" text="Live Digital Book Signings" />
            <FeatureItem icon="code" text="Commercial Iframe Embeds" />
          </View>

          <Pressable style={[styles.button, { backgroundColor: textColor }]}>
            <Text style={styles.buttonText}>Certify a Letter</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const FeatureItem = ({ icon, text }: { icon: any; text: string }) => (
  <View style={styles.featureRow}>
    <Feather name={icon} size={16} color="#888" style={{ marginRight: 10 }} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, alignItems: "center", paddingBottom: 100 },
  header: { alignItems: "center", marginBottom: 40, marginTop: 40 },
  title: { fontSize: 32, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 16, opacity: 0.6, marginTop: 8, textAlign: "center" },
  tierGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: 20,
    width: "100%",
    maxWidth: 900,
  },
  tierCard: {
    flex: 1,
    padding: 30,
    borderRadius: 24,
    borderWidth: 1,
    position: "relative",
    overflow: "hidden",
  },
  tierName: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 12,
  },
  price: { fontSize: 48, fontWeight: "800" },
  period: { fontSize: 18, opacity: 0.5 },
  priceYearly: { fontSize: 14, opacity: 0.5, marginBottom: 30 },
  featureList: { gap: 16, marginBottom: 40 },
  featureRow: { flexDirection: "row", alignItems: "center" },
  featureText: { fontSize: 14, fontWeight: "500" },
  button: {
    width: "100%",
    padding: 18,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  premiumBadge: {
    position: "absolute",
    top: 15,
    right: -35,
    transform: [{ rotate: "45deg" }],
    width: 150,
    alignItems: "center",
    paddingVertical: 4,
  },
  premiumBadgeText: { color: "#FFF", fontSize: 9, fontWeight: "900" },
});
