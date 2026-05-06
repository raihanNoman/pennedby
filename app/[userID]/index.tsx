import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mocking "ThemedColor" hook behavior
const useThemedColors = () => ({
  background: "#F9F7F2", // Light Parchment
  darkBackground: "#121212", // Deep Slate
  text: "#2C2C2C",
  accent: "#8B4513", // Ink Brown
  card: "#FFFFFF",
  border: "#E0DCCF",
});

const { width, height } = Dimensions.get("window");

// --- Types ---
type Post = {
  id: string;
  title: string;
  previewPoints: string;
  audioDuration?: string;
  createdAt: string;
};

// --- Dummy Data ---
const DUMMY_POSTS: Post[] = [
  {
    id: "1",
    title: "A Note to Mr.Beast",
    previewPoints: "...",
    audioDuration: "0:45",
    createdAt: "2h ago",
  },
  {
    id: "2",
    title: "Midnight Thoughts",
    previewPoints: "...",
    audioDuration: "1:12",
    createdAt: "1d ago",
  },
  {
    id: "3",
    title: "Collab Proposal",
    previewPoints: "...",
    audioDuration: "0:30",
    createdAt: "3d ago",
  },
];

export default function UserProfile() {
  const params = useLocalSearchParams() as { userID: string };
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>(DUMMY_POSTS);
  const colors = useThemedColors();

  // Logic for dark/light (In real app, use useColorScheme)
  const isDark = false;
  const themeBg = isDark ? colors.darkBackground : colors.background;
  const themeText = isDark ? "#E0E0E0" : colors.text;

  useEffect(() => {
    // Simulating API call logic
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const renderPost = ({ item }: { item: Post }) => (
    <View
      style={[
        styles.pageContainer,
        { height: height * 0.8, backgroundColor: themeBg },
      ]}
    >
      <View
        style={[
          styles.letterCard,
          {
            backgroundColor: isDark ? "#1E1E1E" : "#FFF",
            borderColor: colors.border,
          },
        ]}
      >
        {/* Letter Header */}
        <View style={styles.letterHeader}>
          <View>
            <Text style={[styles.pennedLabel, { color: colors.accent }]}>
              Penned by
            </Text>
            <Text style={[styles.userName, { color: themeText }]}>Jay</Text>
          </View>
          <View style={styles.metaInfo}>
            <Text style={styles.dateText}>{item.createdAt}</Text>
            {item.audioDuration && (
              <View style={styles.audioBadge}>
                <Feather name="mic" size={12} color={colors.accent} />
                <Text style={styles.audioText}>{item.audioDuration}</Text>
              </View>
            )}
          </View>
        </View>

        {/* The "Handwriting" Canvas Area */}
        <View style={styles.canvasPreview}>
          <View style={styles.placeholderInk}>
            {/* This is where your SVG / Canvas component would animate */}
            <Text
              style={[styles.italicText, { color: isDark ? "#555" : "#CCC" }]}
            >
              [Handwritten Content Preview...]
            </Text>
          </View>
        </View>

        {/* Title & Interaction */}
        <View style={styles.letterFooter}>
          <Text style={[styles.letterTitle, { color: themeText }]}>
            {item.title}
          </Text>
          <Pressable
            style={[styles.playButton, { backgroundColor: colors.accent }]}
          >
            <Feather name="play" size={20} color="#FFF" />
            <Text style={styles.playButtonText}>Watch Ink</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: themeBg }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeBg }]}>
      <View style={styles.profileHeader}>
        <Text style={[styles.brandTitle, { color: themeText }]}>
          PennedBy<Text style={{ color: colors.accent }}>.me</Text>
        </Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        pagingEnabled // Snaps like TikTok/Reels
        showsVerticalScrollIndicator={false}
        snapToInterval={height * 0.8}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    padding: 20,
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: Platform.OS === "web" ? width * 0.2 : 0, // Wide margins on web for iPad look
  },
  pageContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  letterCard: {
    width: "100%",
    maxWidth: 500, // Keeps it looking like a letter on iPad/Web
    height: "90%",
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 5 },
      web: { boxShadow: "0px 10px 30px rgba(0,0,0,0.05)" },
    }),
  },
  letterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  pennedLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", // Sophisticated touch
  },
  metaInfo: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  audioBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    backgroundColor: "rgba(139, 69, 19, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  audioText: {
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 4,
    color: "#8B4513",
  },
  canvasPreview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    marginBottom: 20,
  },
  placeholderInk: {
    opacity: 0.5,
  },
  italicText: {
    fontStyle: "italic",
    fontSize: 16,
  },
  letterFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  letterTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  playButtonText: {
    color: "#FFF",
    fontWeight: "700",
    marginLeft: 8,
  },
});
