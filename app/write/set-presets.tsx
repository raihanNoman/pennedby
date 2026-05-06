import Haptic from "@/components/Haptics";
import { Text, useThemeColor } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// On web, we want a narrower "phone-like" card, on mobile we use the full screen width minus padding
const CARD_WIDTH = Platform.OS === "web" ? 400 : SCREEN_WIDTH - 48;
const GAP = 16;
const INTERVAL = CARD_WIDTH + GAP;

const MODES = [
  {
    id: "romantic",
    title: "Romantic",
    subtitle: "Soft ink, flowing strokes, and poetic playback.",
    colors: ["#FF9A9E", "#FAD0C4"],
    icon: "heart",
  },
  {
    id: "business",
    title: "Business",
    subtitle: "Structured memos, fast playback, and official seals.",
    colors: ["#F5F7FA", "#B8C6DB"], // Light yellow/silver vibe
    darkColors: ["#2C3E50", "#000000"],
    icon: "briefcase",
  },
  {
    id: "philosophy",
    title: "Philosophy",
    subtitle: "Deep ink, slow build, and permanent record.",
    colors: ["#4FACFE", "#00F2FE"],
    icon: "anchor",
  },
];

export default function NewWriting() {
  const router = useRouter();
  const textColor = useThemeColor(
    { light: "#1a1a1a", dark: "#f1f1f1" },
    "text",
  );
  const bgColor = useThemeColor(
    { light: "#FDFCF8", dark: "#0b0b0b" },
    "background",
  );

  const handleSelect = (modeId: string) => {
    Haptic.success();
    router.push({ pathname: "/write", params: { mode: modeId } });
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: textColor, opacity: 0.5 }]}>
          STEP 1: SELECT INTENT
        </Text>
        <Text style={[styles.title, { color: textColor }]}>
          Choose your canvas.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={INTERVAL}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {MODES.map((mode, index) => (
          <MotiView
            key={mode.id}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 100, type: "spring" }}
            style={[styles.cardContainer, { width: CARD_WIDTH }]}
          >
            <Pressable
              onPress={() => handleSelect(mode.id)}
              style={styles.pressable}
            >
              <LinearGradient
                colors={
                  ["#FFF9E5", "#F5E6AD"]
                  //    light: ["#FFF9E5", "#F5E6AD"],
                  //                   dark: ["#232323", "#111"],
                }
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardHeader}>
                  <Feather
                    name={mode.icon as any}
                    size={28}
                    color={mode.id === "business" ? "#8B4513" : "white"}
                  />
                  <View style={styles.activeIndicator} />
                </View>

                <View>
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: mode.id === "business" ? "#4A3728" : "white" },
                    ]}
                  >
                    {mode.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardSubtitle,
                      {
                        color:
                          mode.id === "business"
                            ? "#6D5D50"
                            : "rgba(255,255,255,0.8)",
                      },
                    ]}
                  >
                    {mode.subtitle}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          </MotiView>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={[styles.footerHint, { color: textColor }]}>
          Swipe to explore moods
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  scrollContent: {
    paddingHorizontal: 24, // Matches header
    alignItems: "center",
    paddingRight: Platform.OS === "web" ? 100 : 24,
  },
  cardContainer: {
    height: 450,
    marginRight: GAP,
    borderRadius: 24,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      web: { boxShadow: "0 20px 40px rgba(0,0,0,0.1)" },
    }),
  },
  pressable: { flex: 1 },
  gradient: {
    flex: 1,
    padding: 32,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  cardTitle: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -1,
  },
  cardSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    marginTop: 40,
  },
  footerHint: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.3,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
