import { LoadingScreen } from "@/components/Empty";
import PostItem, { useColors } from "@/components/post/item";
import { isWeb, SCREEN } from "@/constants/Platform";
import { client } from "@/utils/aws";
import { Post, User } from "@/utils/aws/types";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

// Mocking "ThemedColor" hook behavior

function useUserPosts() {
    const parms = useLocalSearchParams() as { userID?: string };
    const [user, setUser] = useState<User>();
    const [posts, setPost] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                console.log("fetching user ...", parms.userID);
                if (!parms.userID) throw "no user ID";

                const { data, errors } = await client.models.User.get({ id: parms.userID });

                if (!data || errors) {
                    console.log("🚩graph ql err", errors);
                    throw "err getting post";
                }

                setUser(data);
                console.log("✅ fetched user");

                console.log("fetching posts...");
                const posts = await data?.posts();

                if (posts?.data) {
                    setPost(posts.data);
                    console.log("✅ fetched posts", posts.data.length);
                } else if (posts?.errors) {
                    console.log("❌ err getting posts", posts.errors);
                }
            } catch (e) {
                console.log("❌ err getting post", e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return { posts, user, loading };
}
export default function UserProfile() {
    const { posts, user, loading } = useUserPosts();
    const { themeBg, themeText, accent } = useColors();

    // Logic for dark/light (In real app, use useColorScheme)

    if (loading) return <LoadingScreen loading label="Getting letters" />;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeBg }]}>
            <Stack.Screen options={{ title: user?.name || "Anonymous Author" }} />
            <ScrollView
                pagingEnabled
                decelerationRate={"fast"}
                snapToInterval={SCREEN.height * 0.8}
                contentContainerStyle={styles.listContent}
                style={{ alignSelf: "center" }}
            >
                <View style={styles.profileHeader}></View>

                {posts?.map((item) => (
                    <PostItem post={item} key={item.id} />
                ))}
            </ScrollView>
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
        paddingHorizontal: isWeb ? SCREEN.width * 0.2 : 0, // Wide margins on web for iPad look
    },
    pageContainer: {
        width: SCREEN.width,
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
