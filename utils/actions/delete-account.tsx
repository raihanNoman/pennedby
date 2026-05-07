import { useAppDispatch, useAppSelector } from "@/_redux/hooks";
import Button from "@/components/Button";
import Haptic from "@/components/Haptics";
import { Alert } from "@/utils/Alert";
import { deleteUser, getCurrentUser } from "aws-amplify/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { deletePersonalState, deleteProfile } from "./delete-data";

//   const handleDeleteAccount = () => {
//     Alert("Delete Account", "This is permanent. All your Quran progress will be lost.", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete My Data",
//         style: "destructive",
//         onPress: async () => {
//           try {
//             await deleteUser();
//             router.replace("/login");
//           } catch (e) {
//             Alert("Error", "Please sign in again to delete your account.");
//           }
//         },
//       },
//     ]);
//   };

export function useDeleteAccount() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const isLoggedIn = useAppSelector((s) => s.auth.isLoggedIn);

    async function deleteAccount() {
        if (loading) return;
        Haptic.select();

        try {
            setLoading(true);

            if (!isLoggedIn) return;

            const { userId } = await getCurrentUser();

            setStatus("❌ Deleting profile data...");
            await deleteProfile(userId);
            Haptic.select();

            setStatus("❌ Deleting progress...");
            await deletePersonalState(userId);
            Haptic.select();

            setStatus("❌ Deleting account...");
            await deleteUser(); // Cognito
            Haptic.success();

            setStatus("❎ Account Deleted");

            Alert("Account Deleted", "Your profile, progress, and personal data have been permanently deleted.", [
                {
                    onPress: () => {
                        //dispatch(resetMyProfile());
                        router.dismissTo("/");
                    },
                },
            ]);

            console.log("❎ deleted account");
        } catch (e: any) {
            console.log("❌ err deleting account", e);
            Alert("Unexpected Error", "Something went wrong while deleting your account. " + e.message);
        } finally {
            setStatus("");
            setLoading(false);
        }
    }

    function onDeletePressed() {
        Alert(
            "Are you sure?",
            "Deleting your account will permanently remove your profile, progress, and all associated data from our servers. This action cannot be undone.\n\nActive subscriptions must be canceled separately through the App Store.",
            [
                { text: "Go Back" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: deleteAccount,
                },
            ],
        );
    }

    return { onDeletePressed, loading, status };
}

export default function DeleteAccount() {
    const isLoggedIn = useAppSelector((s) => s.auth.isLoggedIn);
    const { onDeletePressed, loading, status } = useDeleteAccount();
    if (!isLoggedIn) return null;

    return (
        <Button
            title={status ? status : "Delete Account"}
            loading={loading}
            disabled={loading}
            onPressIn={Haptic.select}
            onPress={onDeletePressed}
            textStyle={{ color: "#f00" }}
        />
    );
}
