import Haptic from "@/components/Haptics";
import { SVG_DATA } from "@/components/sketch/data";
import PreviewSVG from "@/components/sketch/PreviewSVG";
import { BASE_URL } from "@/constants/url";
import * as Clipboard from "expo-clipboard";
import { Pressable, StyleSheet } from "react-native";

// react
// on click go to my website
// on copy react and html.

// ! `X-Frame-Options: DENY` <= turn this to ALLOW

/**
 ```yaml
customHeaders:
  - pattern: '/embed/*'
    headers:
      - key: 'Content-Security-Policy'
        value: "frame-ancestors *" # Allows any site to iframe your embed routes
      - key: 'X-Frame-Options'
        value: 'ALLOWALL'
 */

const handleCopyEmbed = async () => {
    const src = `${BASE_URL}/embed`;
    const embedCode = `<iframe src="${src}" width="100%" style="aspect-ratio: 1/1; border: none;" loading="lazy"></iframe>`;

    await Clipboard.setStringAsync(embedCode);
    Haptic.success();
    alert("Embed code copied to clipboard!");
};

export default function EmbedView() {
    return (
        <Pressable onPress={handleCopyEmbed} style={{ flex: 1, backgroundColor: "gray" }}>
            <PreviewSVG strokeItems={SVG_DATA[2]} loopDelayMS={800} isLooping />
        </Pressable>
    );
}

const styles = StyleSheet.create({});
