import Haptic from "@/components/Haptics";
import { Text, useThemeColor } from "@/components/Themed";
import { MODES } from "@/constants/Presets";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { MotiView } from "moti";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function NewWriting() {
  const router = useRouter();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isDark = useTheme().dark;

  // Adaptive logic for sizing
  const CARD_WIDTH = Platform.select({
    web: SCREEN_WIDTH > 800 ? 380 : SCREEN_WIDTH * 0.8,
    default: SCREEN_WIDTH - 60,
  });
  const GAP = 20;
  const SNAP_INTERVAL = CARD_WIDTH + GAP;

  const textColor = useThemeColor(
    { light: "#1a1a1a", dark: "#f1f1f1" },
    "text",
  );
  const bgColor = useThemeColor(
    { light: "#FDFCF8", dark: "#0b0b0b" },
    "background",
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Stack.Screen options={{ headerTransparent: true, title: "" }} />

      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        style={styles.header}
      >
        <Text style={[styles.label, { color: textColor, opacity: 0.5 }]}>
          STEP 1: SELECT INTENT
        </Text>
        <Text style={[styles.title, { color: textColor }]}>
          Choose your canvas.
        </Text>
      </MotiView>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={SNAP_INTERVAL}
          snapToAlignment="start"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2 },
          ]}
          scrollEventThrottle={16}
        >
          {MODES.map((mode, index) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              index={index}
              width={CARD_WIDTH}
              isDark={isDark}
              onSelect={() => {
                Haptic.success();
                router.push({ pathname: "/write", params: { mode: mode.id } });
              }}
            />
          ))}
        </ScrollView>
      </View>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 600 }}
        style={styles.footer}
      >
        <Feather
          name="chevron-right"
          size={16}
          color={textColor}
          style={{ opacity: 0.3 }}
        />
        <Text style={[styles.footerHint, { color: textColor }]}>
          Swipe to explore moods
        </Text>
      </MotiView>
    </View>
  );
}

function ModeCard({ mode, index, width, isDark, onSelect }: any) {
  const scale = useSharedValue(1);

  // Choose correct color set based on theme
  const currentColors = isDark ? mode.darkColors : mode.colors;

  // Logic to determine if text should be dark or light based on the mode
  const isBusinessLight = !isDark && mode.id === "business";
  const contentColor = isBusinessLight ? "#4A3728" : "#FFFFFF";

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{
        delay: index * 150,
        type: "spring",
        damping: 15,
      }}
      style={[styles.cardWrapper, { width }]}
    >
      <AnimatedPressable
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onSelect}
        style={[styles.pressable, animatedStyle]}
      >
        <LinearGradient
          colors={currentColors}
          style={[StyleSheet.absoluteFill, styles.gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: "rgba(255,255,255,0.2)" },
              ]}
            >
              <Feather name={mode.icon} size={24} color={contentColor} />
            </View>
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: contentColor },
              ]}
            />
          </View>

          <View>
            <Text style={[styles.cardTitle, { color: contentColor }]}>
              {mode.title}
            </Text>
            <Text
              style={[
                styles.cardSubtitle,
                { color: contentColor, opacity: 0.8 },
              ]}
            >
              {mode.subtitle}
            </Text>
          </View>
        </LinearGradient>
      </AnimatedPressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  header: {
    paddingHorizontal: 32,
    marginBottom: 40,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -0.5,
    ...Platform.select({
      ios: { fontFamily: "Helvetica Neue" },
      android: { fontFamily: "sans-serif-medium" },
    }),
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  cardWrapper: {
    height: 480,
    marginHorizontal: 10,
    borderRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
      web: { cursor: "pointer", boxShadow: "0 20px 40px rgba(0,0,0,0.12)" },
    }),
  },
  pressable: {
    flex: 1,
    borderRadius: 32,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    padding: 32,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconBox: {
    padding: 12,
    borderRadius: 16,
  },
  activeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 14,
  },
  cardTitle: {
    fontSize: 42,
    fontWeight: "900",
    marginBottom: 12,
    letterSpacing: -1.5,
  },
  cardSubtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    gap: 8,
  },
  footerHint: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
