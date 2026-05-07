import useIsLoggedIn from "@/_redux/auth/useIsLoggedIn";
import { useDelayedActive } from "@/components/Button";
import { LoadingScreen } from "@/components/Empty";
import Haptic from "@/components/Haptics";
import { Icon, Text } from "@/components/Themed";
import { SAFE_SCREEN_WIDTH } from "@/constants/Platform";
import { Authenticator } from "@aws-amplify/ui-react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link, Route, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthGateway() {
    const { loading, isLoggedIn } = useIsLoggedIn();
    const params = useLocalSearchParams() as {
        onSuccess_routeTo?: Route;
        type?: "signIn" | "signUp" | "forgotPassword" | undefined;
    };

    if (loading) return <LoadingScreen />;
    else if (isLoggedIn) return <SignInSuccess onSuccessRoute={params?.onSuccess_routeTo || "/"} />;
    return (
        <>
            <SafeAreaView edges={["top"]}>
                <Skip />
            </SafeAreaView>

            <Authenticator
                initialState={params.type || "signIn"}
                // do this on web?
                //   Container={(props) => <SafeAreaView {...props} style={styles.root} />}
                components={{
                    SignIn: ({ fields, ...props }) => (
                        <Authenticator.SignIn
                            {...props}
                            fields={fields.map((field) => ({ ...field, labelHidden: true }))}
                        />
                    ),
                    SignUp: ({ fields, ...props }) => (
                        <Authenticator.SignUp
                            {...props}
                            fields={[...fields.map((field) => ({ ...field, labelHidden: true }))]}
                        />
                    ),
                }}
            >
                <SignInSuccess onSuccessRoute={params.onSuccess_routeTo} />
            </Authenticator>
        </>
    );
}

function Skip() {
    // make it go to 2d in real life
    return (
        <Link id="Go to Map" href={{ pathname: "/" }} asChild onPress={Haptic.select}>
            <Pressable style={{ padding: 12 }}>
                <Text size={16} opacity={0.5}>
                    Skip
                </Text>
            </Pressable>
        </Link>
    );
}

function SignInSuccess({ onSuccessRoute }: { onSuccessRoute?: Route }) {
    const router = useRouter();
    useDelayedActive(1200, () => {
        if (router.canDismiss()) router.dismissTo({ pathname: "/write/set-presets" });
        else router.navigate({ pathname: "/write/set-presets" });
        Haptic.success();
    });

    const nav = useCallback(() => {
        if (onSuccessRoute) {
            if (router.canDismiss()) router.dismissTo(onSuccessRoute);
            else router.navigate(onSuccessRoute);
        } else {
            if (router.canDismiss()) router.dismissTo({ pathname: "/" });
            else router.navigate({ pathname: "/" });
        }
        Haptic.success();
    }, [onSuccessRoute]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Pressable onPress={nav} style={styles.root}>
                <Animated.View entering={FadeInDown.duration(600)}>
                    <Icon size={50}>
                        <FontAwesome5 name="pen-nib" />
                    </Icon>
                </Animated.View>
            </Pressable>
        </SafeAreaView>
    );
}
const size = SAFE_SCREEN_WIDTH * 0.8;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        maxWidth: SAFE_SCREEN_WIDTH,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },
});
