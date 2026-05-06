import Haptic from "@/components/Haptics";
import { Text, useThemeColor } from "@/components/Themed";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function PreviewMyWriting() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const tint = useThemeColor({ light: "#8B4513", dark: "#D2B48C" }, "tint");
  const textColor = useThemeColor(
    { light: "#1a1a1a", dark: "#f1f1f1" },
    "text",
  );
  const cardBg = useThemeColor({ light: "#FFF", dark: "#1A1A1A" }, "card");
  const secondaryBg = useThemeColor(
    { light: "#F5F2E9", dark: "#252525" },
    "background",
  );

  const handleFinalPost = () => {
    Haptic.success();
    // Logic to mint on Solana or post to AWS Amplify Gen 2
    console.log("Post Minted/Created");
    router.push("/success");
  };

  return (
    <View style={[styles.container, { backgroundColor: secondaryBg }]}>
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={[styles.label, { color: tint }]}>FINAL PREVIEW</Text>
        <Text style={[styles.title, { color: textColor }]}>
          Review your intent.
        </Text>
      </View>

      {/* The Letter Preview Canvas */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={[styles.previewCanvas, { backgroundColor: cardBg }]}
      >
        <View style={styles.canvasHeader}>
          <Feather name="edit-3" size={16} color={tint} />
          <Text style={[styles.canvasStatus, { color: tint }]}>
            Handwritten Draft
          </Text>
        </View>

        <View style={styles.drawingArea}>
          {/* 
              This is where your <SkiaView> or SVG Path animation component lives.
              For now, a placeholder for the "Playback" 
            */}
          <MaterialCommunityIcons
            name="gesture-spread"
            size={48}
            color={tint}
            style={{ opacity: 0.2 }}
          />
          <Text style={[styles.placeholderText, { color: textColor }]}>
            Tap to Replay Stroke
          </Text>
        </View>

        <View style={styles.canvasFooter}>
          <View style={styles.meta}>
            <Feather
              name="clock"
              size={12}
              color={textColor}
              style={{ opacity: 0.5 }}
            />
            <Text style={[styles.metaText, { color: textColor }]}>
              45s Playback
            </Text>
          </View>
          <View style={styles.meta}>
            <Feather
              name="mic"
              size={12}
              color={textColor}
              style={{ opacity: 0.5 }}
            />
            <Text style={[styles.metaText, { color: textColor }]}>
              Audio Attached
            </Text>
          </View>
        </View>
      </MotiView>

      {/* Action Area */}
      <View style={styles.actionSection}>
        <View style={styles.optionsRow}>
          <View style={styles.option}>
            <Text style={[styles.optionLabel, { color: textColor }]}>Mode</Text>
            <Text style={[styles.optionValue, { color: tint }]}>
              Philosophy (Permanent)
            </Text>
          </View>
          <View style={styles.option}>
            <Text style={[styles.optionLabel, { color: textColor }]}>
              Security
            </Text>
            <Text style={[styles.optionValue, { color: tint }]}>
              Solana Certified
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleFinalPost}
          style={({ pressed }) => [
            styles.postButton,
            { backgroundColor: textColor, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <MotiView animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <Text style={styles.postButtonText}>Seal & Send</Text>
          </MotiView>
          <Feather name="send" size={18} color={secondaryBg} />
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.editBtn}>
          <Text style={[styles.editBtnText, { color: textColor }]}>
            Back to Edit
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  previewCanvas: {
    width: "100%",
    aspectRatio: 0.75, // Like a sheet of paper
    borderRadius: 16,
    padding: 20,
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
  canvasHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    opacity: 0.8,
  },
  canvasStatus: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  drawingArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.4,
    fontStyle: "italic",
  },
  canvasFooter: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: "#00000010",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "600",
    opacity: 0.6,
  },
  actionSection: {
    marginTop: 40,
    gap: 20,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  option: {
    alignItems: "flex-start",
  },
  optionLabel: {
    fontSize: 10,
    opacity: 0.5,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  optionValue: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  postButton: {
    flexDirection: "row",
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  postButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  editBtn: {
    alignItems: "center",
    padding: 10,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.5,
  },
});
