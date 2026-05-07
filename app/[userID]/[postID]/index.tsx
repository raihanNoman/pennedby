import Empty, { LoadingScreen } from "@/components/Empty";
import Haptic from "@/components/Haptics";
import { usePost } from "@/components/post/usePost";
import { useStrokeItems } from "@/components/post/useStrokeItems";
import PreviewSVG from "@/components/sketch/PreviewSVG";
import { useThemeColor } from "@/components/Themed";
import * as Linking from "expo-linking";
import { Stack, useLocalSearchParams } from "expo-router";
import { Pressable } from "react-native";

export default function PostIframe() {
    const color = useThemeColor({}, "text");
    const params = useLocalSearchParams() as { postID?: string; userID?: string };
    const penname = params.userID;
    const title = params.postID;

    const { post, loaindg } = usePost(params.postID || "");
    const strokeItems = useStrokeItems(post);

    function openLink() {
        const base = "http://localhost:8081";
        const link = `${base}/${penname}/${title}`;

        Linking.openURL(link);
        Haptic.success();
        // open this on a new tab that links to my website
    }

    if (loaindg)
        return <LoadingScreen fillScreen label="Fetching letter..." />; // todo: make clever animation
    else if (!post) return <Empty fillScreen label="No such letter" />;
    return (
        <Pressable onPress={openLink} style={{ flex: 1 }}>
            <Stack.Screen options={{ headerShown: false }} />
            <PreviewSVG
                viewBox={post.viewBox}
                strokeItems={strokeItems}
                stroke={post.color || color}
                strokeWidth={post.size || 3}
                loopDelayMS={3000}
                isLooping
            />
        </Pressable>
    );
}
