import { Alert } from "@/utils/Alert";
import * as Linking from "expo-linking";
import { getCurrentUser } from "aws-amplify/auth";

export async function openEmail() {
    let userID: string = "";
    try {
        const res = await getCurrentUser();
        userID = res.userId;
    } catch (e) {}

    const email = "support@quran600.com";
    const subject = "Support Request: quran600 App";
    const body = `Assalamu Alaikum,

I need help with...


${userID ? `User ID: ${userID}` : ""}`;
    // Construct the URL with encoded characters for spaces/new lines
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch((err) => {
        Alert("Error", "Could not open your email app. Please email us at support@quran600.com");
        console.error("Failed to open email:", err);
    });
}
