import { isWeb } from "@/constants/Platform";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "../Themed";

type Feature = {
  icon: string;
  title: string;
  desc: string;
};

export default function Features({ features }: { features: Feature[] }) {
  return (
    <View style={styles.grid}>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          desc={feature.desc}
        />
      ))}
    </View>
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
    width: isWeb ? "45%" : "100%",
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
});
