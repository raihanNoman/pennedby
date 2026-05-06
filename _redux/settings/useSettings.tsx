import React, { useCallback, useState } from "react";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import AsyncKeys from "@/constants/AsyncKeys";
import { thunk, useAppDispatch, useAppSelector } from "../hooks";
import { defaultSettings, setSettings } from "./_slice";
import { Settings, VerseLanguageSetting } from "./types";
import { getRandom } from "@/utils/get";

export const rSaveSettings = thunk("save-settings", async function (_, { getState }) {
  try {
    const settings = getState().settings;
    await AsyncStorage.setItem(AsyncKeys.settings, JSON.stringify(settings));
    console.log("✅ ✅saved settings from redux to asyncStore", settings);
  } catch (e) {
    console.log("❌ saving settings", e);
  }
});

export default function useSettings() {
  const asyncStore = useAsyncStorage(AsyncKeys.settings);
  const dispatch = useAppDispatch();
  const settings = useAppSelector((s) => s.settings);

  /**  loads (ln, arabicFont, size) settings from `asyncStorage` & saves it in `reduxStore` */
  const rLoadSettings = useCallback(async () => {
    try {
      const res = await asyncStore.getItem();

      if (!res) {
        console.log("no previous settings. Initializing with default");
        dispatch(setSettings(defaultSettings));
        asyncStore.setItem(JSON.stringify(defaultSettings));
        return;
      }

      const settings: Settings = await JSON.parse(res);
      dispatch(setSettings(settings));
      //   console.log("loaded settings");
    } catch (e) {
      console.log("❌ loading settings from asyncStore", e);
    }
  }, [asyncStore]);

  const saveSettings = useCallback(
    async (props: Settings | "save-from-redux-store" | "save-default") => {
      try {
        switch (props) {
          case "save-from-redux-store":
            asyncStore.setItem(JSON.stringify(settings));
            console.log("✅ saved settings from redux to asyncStore", settings);
            break;

          case "save-default":
            asyncStore.setItem(JSON.stringify(defaultSettings));
            console.log("✅ saved default settings to aStore", defaultSettings);
            break;

          default:
            dispatch(setSettings(props));
            asyncStore.setItem(JSON.stringify(props));
            console.log("✅ saved custom settings to asyncStore", props);
            break;
        }
      } catch (e) {
        console.log("❌ saving settings to asyncStore", e);
      }
    },
    [asyncStore, settings]
  );

  return { settings, rLoadSettings, saveSettings };
}

export function useRandomLN() {
  const languages = useAppSelector((s) => s.settings.languages);
  const [ln] = useState(() => getRandom(Object.keys(languages)) as LN.onCDN);

  return ln;
}

export function getAllVerseTRs(languages: Settings["languages"]) {
  const res: Partial<Record<LN.VerseTRid, VerseLanguageSetting>> = {};

  Object.values(languages).forEach((lang) => {
    if (!lang) return; // skip undefined entries

    Object.entries(lang.verse.translations).forEach(([id, setting]) => {
      if (setting) res[id as LN.VerseTRid] = setting;
    });
  });

  return res;
}
