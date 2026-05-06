import { AuthUser, getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks";
import { setIsLoggedIn } from "./authSlice";

export default function useIsLoggedIn() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | false>(false);

  useEffect(() => {
    (async () => {
      try {
        const user: AuthUser = await getCurrentUser();
        setUser(user);
        // dispatch(setMyID(user.userId));
        dispatch(setIsLoggedIn(true));
      } catch (e) {
        dispatch(setIsLoggedIn(false));
        setUser(false);
      } finally {
        setLoading(false);
      }

      // try {
      //     const user: AuthUser = await getCurrentUser();
      //     const res = await Purchases.logIn(user.userId);
      //     console.log("🐱 logged in revenuw cat", res);
      // } catch (e) {
      //     console.log("error signing in", e);
      // }
    })();
  }, []);

  return { isLoggedIn: Boolean(user), user, loading };
}
