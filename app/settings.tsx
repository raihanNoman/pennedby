import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "aws-amplify/auth";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Haptic from "@/components/Haptics";
import { Section } from "@/components/settings/section";
import SettingItem from "@/components/settings/SettingsItem";
import { ThemeSelector } from "@/components/settings/theme-selector";
import { Text, useThemeColor } from "@/components/Themed";
import { Alert } from "@/utils/Alert";

const SettingsScreen = () => {
  const router = useRouter();
  const tint = useThemeColor({ light: "#8B4513", dark: "#D2B48C" }, "tint");
  const bgColor = useThemeColor(
    { light: "#FDFCF8", dark: "#0f0f0f" },
    "background",
  );

  // Auth context (dummy for now)
  const isLoggedIn = true;

  const handleSignOut = async () => {
    Alert("End Session", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        onPress: async () => {
          await signOut();
          Haptic.success();
          router.dismissTo("/");
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bgColor }]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Brand Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: tint }]}>The Atelier</Text>
          <Text style={styles.headerSubtitle}>
            Customize your digital ink & presence
          </Text>
        </View>

        <Section>
          <Section.Title>Tools & Aesthetics</Section.Title>
          <SettingItem
            icon="feather"
            label="Ink Thickness & Style"
            onPress={() => {}}
          />
          <SettingItem
            icon="moon"
            label="Interface Theme"
            rightElement={<ThemeSelector />}
          />
          <SettingItem icon="bell" label="Letter Alerts" onPress={() => {}} />
        </Section>

        <Section>
          <Section.Title>Identity & Trust</Section.Title>
          <SettingItem
            icon={
              <MaterialCommunityIcons name="ethereum" size={20} color={tint} />
            }
            label="Solana Wallet"
            onPress={() => router.push("/wallet")}
          />
          <SettingItem
            icon="shield-check"
            label="Verified Signatures"
            onPress={() => router.push("/verify")}
          />
          <SettingItem
            icon="award"
            label="Certification Tiers"
            onPress={() => router.push("/pricing")}
          />
        </Section>

        <Section>
          <Section.Title>Support & Legal</Section.Title>
          <SettingItem
            icon="mail"
            label="Send Feedback"
            onPress={() => Linking.openURL("mailto:support@pennedby.me")}
          />
          <SettingItem
            icon="file-text"
            label="Terms of Service"
            onPress={() => {}}
          />
          <SettingItem
            icon="external-link"
            label="pennedby.me"
            onPress={() => Linking.openURL("https://pennedby.me")}
          />
        </Section>

        {isLoggedIn && (
          <Section>
            <Section.Title>Security</Section.Title>
            <SettingItem
              icon="log-out"
              label="Sign Out"
              onPress={handleSignOut}
            />
            <SettingItem
              icon="trash-2"
              label="Delete Archive"
              destructive
              onPress={() => {}}
            />
          </Section>
        )}
        {/* 
        <Text style={styles.versionText}>
          PennedBy.me v{version} {"\n"} Hand-crafted for your intent.
        </Text> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 60,
    maxWidth: 600, // For Tablet/Web
    alignSelf: "center",
    width: "100%",
  },
  header: {
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.5,
    marginTop: 4,
  },
  versionText: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 11,
    marginTop: 40,
    lineHeight: 18,
    letterSpacing: 0.5,
  },
});

export default SettingsScreen;
