import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { setIsLoggedIn } from "@/_redux/auth/authSlice";
import useIsLoggedIn from "@/_redux/auth/useIsLoggedIn";
import { useAppDispatch } from "@/_redux/hooks";
import { store } from "@/_redux/store";
import outputs from "@/amplify_outputs.json";
import AuthProvider from "@/components/AuthProvider";
import { NavSettings } from "@/components/nav/HeaderBtns";
import ThemeProvider from "@/components/ThemeProvider";
import { Amplify } from "aws-amplify";
import { Hub } from "aws-amplify/utils";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = { initialRouteName: "index" };

Amplify.configure(outputs);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    return (
        <GestureHandlerRootView onLayout={SplashScreen.hideAsync}>
            <Provider store={store}>
                <AuthProvider>
                    <ThemeProvider>
                        <RootLayoutNav />
                    </ThemeProvider>
                </AuthProvider>
            </Provider>
        </GestureHandlerRootView>
    );
}

function RootLayoutNav() {
    const dispatch = useAppDispatch();
    const authStatus = useIsLoggedIn();

    useEffect(() => {
        const authListener = Hub.listen("auth", ({ payload }) => {
            if (payload.event === "signedIn") dispatch(setIsLoggedIn(true));
            if (payload.event === "signedOut") dispatch(setIsLoggedIn(false));
        });
        return authListener;
    }, []);

    return (
        <Stack screenOptions={{ headerRight: NavSettings }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false, presentation: "modal" }} />

            <Stack.Screen name="settings" options={{ headerLargeTitleEnabled: true }} />
            <Stack.Screen name="my-account" options={{ headerLargeTitleEnabled: true, title: "My Account" }} />
        </Stack>
    );
}
