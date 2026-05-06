import {
    fetchUserAttributes,
    getCurrentUser
} from "aws-amplify/auth";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setReferredByCode } from "./authSlice";

export default function useSaveReferredBy() {
  const dispatch = useAppDispatch();
  const { isLoggedIn, referredByCode } = useAppSelector((s) => s.auth);

  useEffect(() => {
    (async function applyReferredBy() {
      if (!isLoggedIn) return;
      if (!referredByCode) return;
      try {
        const user = await getCurrentUser();
        const cognito = await fetchUserAttributes();

        if (cognito["referredBy"]) {
          console.log("user already has referral", referredByCode);
          return;
        }

        dispatch(setReferredByCode(undefined));
      } catch (e) {
        console.log("err updating referred by code");
      }
    })();
  }, [referredByCode, isLoggedIn]);
}
