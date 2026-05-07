import useIsLoggedIn from "@/_redux/auth/useIsLoggedIn";
import { LoadingScreen } from "@/components/Empty";
import { Redirect } from "expo-router";

export default function MyAccount() {
    const res = useIsLoggedIn();
    if (res.loading) return <LoadingScreen loading fillScreen label="Fetching your account..." />;
    if (res.user) return <Redirect href={{ pathname: "/[userID]", params: { userID: res.user.userId } }} />;
    else return <Redirect href={{ pathname: "/auth" }} />;
}
