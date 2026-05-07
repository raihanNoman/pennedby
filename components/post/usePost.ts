import { client } from "@/utils/aws";
import { Post } from "@/utils/aws/types";
import { useEffect, useState } from "react";

export function usePost(postID: string) {
    const [post, setPost] = useState<Post>();
    const [loaindg, setLoaindg] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                if (!postID) throw "no post ID";
                console.log("fetching post ... ", postID);
                const { data, errors } = await client.models.Post.get({ id: postID });

                if (!data || errors) {
                    console.log("🚩 graph ql err", errors);
                    throw "err getting post";
                }

                setPost(data);

                console.log("✅ fetched post", postID);
            } catch (e) {
                console.log("❌ err getting post", e);
            } finally {
                setLoaindg(false);
            }
        })();
    }, []);

    return { post, loaindg };
}
