import { Text, useThemeColor } from "@/components/Themed";
import { isWeb } from "@/constants/Platform";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function About() {
  const tint = useThemeColor({ light: "#8B4513", dark: "#D2B48C" }, "tint");
  const textColor = useThemeColor(
    { light: "#1a1a1a", dark: "#f1f1f1" },
    "text",
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.aboutHero}>
        <Text style={[styles.aboutTitle, { color: textColor }]}>
          The Philosophy of the Stroke
        </Text>
        <View style={[styles.divider, { backgroundColor: tint }]} />

        <Text style={styles.bodyText}>
          In 2026, text is cheap. AI can simulate empathy, draft proposals, and
          write "love letters" in milliseconds. When pixels are infinite, they
          become worthless.
        </Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: "bold", color: tint }}>PennedBy.me</Text>{" "}
          is a return to digital scarcity. By forcing the use of a stylus, we
          capture the micro-tremors, the pressure, and the hesitation of a human
          hand.
        </Text>

        <View style={styles.modeGrid}>
          <ModeInfo
            title="Romantic"
            desc="Ephemeral. Like a whisper in the wind, these notes disappear after viewing. Designed for intimacy that doesn't need to be archived."
          />
          <ModeInfo
            title="Business"
            desc="Professional and urgent. Stays alive for 24 hours to ensure your lead or collaborator acts with the same intent you wrote with."
          />
          <ModeInfo
            title="Philosophy"
            desc="Permanent. On-chain records of your thoughts, signed with your wallet, remaining as long as the ledger exists."
          />
        </View>

        <Text style={[styles.quote, { color: tint }]}>
          "A signature isn't just a name; it's a commitment of time."
        </Text>
      </View>
    </ScrollView>
  );
}

const ModeInfo = ({ title, desc }: { title: string; desc: string }) => (
  <View style={styles.modeItem}>
    <Text style={styles.modeTitle}>{title} Mode</Text>
    <Text style={styles.modeDesc}>{desc}</Text>
  </View>
);

// Add to your stylesheet:
// aboutHero: { maxWidth: 700, marginTop: 60 },
// aboutTitle: { fontSize: 42, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
// bodyText: { fontSize: 18, lineHeight: 28, marginTop: 24, opacity: 0.8 },
// modeGrid: { marginTop: 40, gap: 24 },
// modeTitle: { fontSize: 20, fontWeight: '700' },
// modeDesc: { fontSize: 15, opacity: 0.6, marginTop: 4 },
// quote: { fontSize: 24, fontStyle: 'italic', marginTop: 60, textAlign: 'center', fontWeight: '300' }

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, alignItems: "center", paddingBottom: 100 },

  divider: {},
  modeItem: {},
  aboutHero: { maxWidth: 700, marginTop: 60 },
  aboutTitle: {
    fontSize: 42,
    fontWeight: "800",
    fontFamily: isWeb ? "Georgia" : "serif",
  },
  bodyText: { fontSize: 18, lineHeight: 28, marginTop: 24, opacity: 0.8 },
  modeGrid: { marginTop: 40, gap: 24 },
  modeTitle: { fontSize: 20, fontWeight: "700" },
  modeDesc: { fontSize: 15, opacity: 0.6, marginTop: 4 },
  quote: {
    fontSize: 24,
    fontStyle: "italic",
    marginTop: 60,
    textAlign: "center",
    fontWeight: "300",
  },
});
