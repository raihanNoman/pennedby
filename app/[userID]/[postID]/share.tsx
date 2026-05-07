import Haptic from "@/components/Haptics";
import { blurhash } from "@/constants/image-blur-hash";
import { BASE_URL } from "@/constants/url";
import { client } from "@/utils/aws";
import { getCurrentUser } from "aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SharePage() {
    const params = useLocalSearchParams() as { postID?: string; userID?: string };
    const penname = params.userID;
    const title = params.postID;

    const link = `${BASE_URL}/${penname}/${title}`;

    const [gifLink, setGifLink] = useState<string>();
    const [loadingGif, setloadingGif] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const user = await getCurrentUser();

                if (!title) throw "no such post";

                // check if gif exists
                const post = await client.models.Post.get({ id: title });
                if (post.data?.gifKey) {
                    const s3url = await getUrl({ path: post.data?.gifKey });
                    setGifLink(s3url.url.toString());
                    return;
                }

                // create girf
                const { data: s3key, errors } = await client.mutations.createGif({
                    iframeUrl: link,
                    title: title,
                    userID: user.userId,
                    postID: title,
                });

                if (!s3key || errors) {
                    console.log("graph ql err");
                    console.log(errors?.[0]);
                    throw "failed to execute createGif lamba";
                }

                // new girl link
                const s3url = await getUrl({ path: s3key });
                setGifLink(s3url.url.toString());
            } catch (e) {
                console.log("err", e);
            } finally {
                setloadingGif(false);
            }
        })();
    }, []);

    const copyIframe = async () => {
        const embedCode = `<iframe src="${link}" width="100%" style="aspect-ratio: 1/1; border: none;" loading="lazy"></iframe>`;

        await Clipboard.setStringAsync(embedCode);
        Haptic.success();
        alert("Embed code copied to clipboard!"); // make this toast
    };

    const copyGifLink = async () => {
        if (!gifLink) return;
        console.warn("This is signed url. you need downloadable url to share via email");
        // this will expire though. ..so you need adownloadable one?
        await Clipboard.setStringAsync(gifLink);
        Haptic.success();
        alert("Embed code copied to clipboard!"); // make this toast
    };

    return (
        <View>
            <Stack.Screen options={{ title: title || "Letter by Anonymous" }} />

            <TouchableOpacity onPress={copyIframe}>
                <Text>Share on Your Website</Text>
                <View>
                    <Text>Iframs</Text>
                </View>

                <Text>Press to copy iframe</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={copyGifLink}>
                <Text>Share As Email</Text>

                <Image
                    style={styles.image}
                    source="https://picsum.photos/seed/696/3000/2000"
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={1000}
                />

                <Text>Press to copy iframe</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: "100%",
        backgroundColor: "#0553",
    },
});
