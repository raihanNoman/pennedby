import { useAppDispatch } from "@/_redux/hooks";
import Button from "@/components/Button";
import Haptic from "@/components/Haptics";
import { Alert } from "@/utils/Alert";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "expo-router";
import { useState } from "react";

export function useSignOut() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  function onSignOut() {
    try {
      signOut();

      //  dispatch(resetMyProfile());
      Haptic.success();
      router.dismissTo("/");
    } catch (e) {
      console.log("🚩err signing out", e);
      Alert("Error", "Could not sign out.");
    } finally {
      setLoading(false);
    }
  }

  return { loading, onSignOut };
}

export default function SignOut() {
  const { loading, onSignOut } = useSignOut();
  return <Button loading={loading} title="Sign Out" onPress={onSignOut} />;
}
