import Haptic from "@/components/Haptics";
import { Text, useThemeColor } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function SetRulesForNewPost() {
    const router = useRouter();
    const [viewLimit, setViewLimit] = useState("unlimited");
    const [privacyTier, setPrivacyTier] = useState("public");

    const tint = useThemeColor({ light: "#8B4513", dark: "#D2B48C" }, "tint");
    const textColor = useThemeColor({ light: "#1a1a1a", dark: "#f1f1f1" }, "text");
    const cardBg = useThemeColor({ light: "#FFF", dark: "#1A1A1A" }, "card");
    const bgColor = useThemeColor({ light: "#FDFCF8", dark: "#0f0f0f" }, "background");

    const handleContinue = () => {
        Haptic.select();
        router.push({ pathname: "/write/preview" });
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: bgColor }]} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: textColor }]}>Delivery Rules</Text>
                <Text style={styles.subtitle}>How should this message exist in the world?</Text>
            </View>

            {/* View Limit Selection */}
            <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: tint }]}>EPHEMERALITY</Text>
                <View style={styles.pickerRow}>
                    {["1", "10", "unlimited"].map((val) => (
                        <Pressable
                            key={val}
                            onPress={() => {
                                setViewLimit(val);
                                Haptic.lite();
                            }}
                            style={[styles.chip, { borderColor: tint }, viewLimit === val && { backgroundColor: tint }]}
                        >
                            <Text style={[styles.chipText, { color: viewLimit === val ? bgColor : textColor }]}>
                                {val === "unlimited" ? "Forever" : `${val} View${val === "1" ? "" : "s"}`}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Privacy Tiers */}
            <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: tint }]}>PRIVACY TIER</Text>

                <RuleCard
                    active={privacyTier === "public"}
                    onPress={() => setPrivacyTier("public")}
                    icon="globe"
                    title="Public Access"
                    desc="Anyone with the link can watch your ink flow."
                />

                <RuleCard
                    active={privacyTier === "private"}
                    onPress={() => setPrivacyTier("private")}
                    icon="lock"
                    title="Password Protected"
                    desc="Recipient must enter a phrase to unlock the letter."
                />

                <RuleCard
                    active={privacyTier === "solana"}
                    onPress={() => setPrivacyTier("solana")}
                    icon="shield-check"
                    title="Solana Certified"
                    desc="Only a specific Wallet Address can open this. Signed on-chain."
                    isPremium
                />
            </View>

            <Pressable onPress={handleContinue} style={[styles.continueBtn, { backgroundColor: textColor }]}>
                <Text style={[styles.continueBtnText, { color: bgColor }]}>Review Draft</Text>
                <Feather name="arrow-right" size={20} color={bgColor} />
            </Pressable>
        </ScrollView>
    );
}

function RuleCard({ title, desc, icon, active, onPress, isPremium }: any) {
    const tint = useThemeColor({ light: "#8B4513", dark: "#D2B48C" }, "tint");
    const textColor = useThemeColor({ light: "#1a1a1a", dark: "#f1f1f1" }, "text");
    const cardBg = useThemeColor({ light: "#FFF", dark: "#1A1A1A" }, "card");

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.ruleCard,
                { backgroundColor: cardBg, borderColor: active ? tint : "transparent" },
                active && styles.activeCard,
            ]}
        >
            <View style={styles.ruleIcon}>
                <Feather
                    name={icon}
                    size={22}
                    color={active ? tint : textColor}
                    style={{ opacity: active ? 1 : 0.3 }}
                />
            </View>
            <View style={styles.ruleContent}>
                <View style={styles.titleRow}>
                    <Text style={[styles.ruleTitle, { color: textColor }]}>{title}</Text>
                    {isPremium && (
                        <View style={[styles.solBadge, { backgroundColor: tint }]}>
                            <Text style={styles.solText}>SOL</Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.ruleDesc, { color: textColor }]}>{desc}</Text>
            </View>
            {active && (
                <MotiView from={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Feather name="check-circle" size={20} color={tint} />
                </MotiView>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 24, paddingBottom: 60 },
    header: { marginBottom: 40, marginTop: 20 },
    title: {
        fontSize: 32,
        fontWeight: "800",
        fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    },
    subtitle: { fontSize: 16, opacity: 0.5, marginTop: 8 },
    section: { marginBottom: 32 },
    sectionLabel: {
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 2,
        marginBottom: 16,
    },
    pickerRow: { flexDirection: "row", gap: 12 },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
    },
    chipText: { fontSize: 14, fontWeight: "700" },
    ruleCard: {
        flexDirection: "row",
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        alignItems: "center",
        borderWidth: 2,
    },
    activeCard: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    ruleIcon: { width: 40 },
    ruleContent: { flex: 1, paddingRight: 10 },
    titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    ruleTitle: { fontSize: 17, fontWeight: "700" },
    ruleDesc: { fontSize: 13, opacity: 0.5, marginTop: 4, lineHeight: 18 },
    solBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    solText: { color: "#FFF", fontSize: 9, fontWeight: "900" },
    continueBtn: {
        flexDirection: "row",
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        gap: 12,
    },
    continueBtnText: { fontSize: 18, fontWeight: "700" },
});
