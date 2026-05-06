import NewPostBtn from "@/components/NewPostBtn";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyAccount() {
  return (
    <SafeAreaView>
      <Text>MyAccount</Text>

      <NewPostBtn />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
