import { Post } from "@/utils/aws/types";
import { useEffect, useState } from "react";
import { isStrokeItems } from "../sketch/guard";
import { StrokeItem } from "../sketch/type";

export function useStrokeItems(post: Post | undefined | null) {
    const [strokeItems, setStrokeItems] = useState<StrokeItem[]>([]);

    useEffect(() => {
        try {
            if (!post) throw "no such post";
            let points = JSON.parse(post.points.toString());
            if (!isStrokeItems(points)) throw "invalid stroke items";
            setStrokeItems(points);
        } catch (e) {
            console.log("❌ err getting stroke items", e);
        }
    }, [post]);

    return strokeItems;
}
