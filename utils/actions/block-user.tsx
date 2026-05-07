import React, { useState } from "react";
import Button from "@/components/Button";
import { Icon } from "@/components/Themed";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Haptic from "@/components/Haptics";
import { useBlockUnblock } from "@/aws/useBlockUnblock";

export default function BlockUser({
  userID,
  blockedIDs,
}: {
  userID: string;
  blockedIDs: Maybe<string[]>;
}) {
  const router = useRouter();
  const [blocked, setBlocked] = useState(blockedIDs?.includes(userID));
  const { blockID, unBlockID, loading } = useBlockUnblock();

  async function onPress() {
    if (blocked) {
      await unBlockID(userID);
      setBlocked(false);
    } else {
      await blockID(userID);
      setBlocked(true);
      if (router.canDismiss()) router.dismissTo({ pathname: "/my-profile" });
    }
  }

  return (
    <Button
      title={blocked ? "Unblock" : "Block"}
      active={blocked}
      onPressIn={Haptic.select}
      onPress={onPress}
      onLongPress={() => router.push({ pathname: "/my-profile/bloacked-users" })}
      loading={loading}
    >
      <Icon size={24} light={blocked ? "white" : undefined}>
        <AntDesign name="flag" />
      </Icon>
    </Button>
  );
}
