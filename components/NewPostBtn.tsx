import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewPostBtn() {
  const router = useRouter();

  const navNewPost = useCallback(() => {
    router.push({ pathname: "/write" });
  }, []);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.pos}>
      <Pressable onPress={navNewPost} style={styles.btn}>
        <FontAwesome6 name="pen-nib" size={size / 2} />
      </Pressable>
    </SafeAreaView>
  );
}

const size = 50;

const styles = StyleSheet.create({
  pos: {
    flexDirection: "row",
    position: "absolute",
    right: 12,
    bottom: 0,
    zIndex: 11,
  },
  btn: {
    height: size,
    width: size,
    borderRadius: size / 2,
    margin: 4,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#888",
  },
});
