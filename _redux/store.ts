import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./app";
import authSlice from "./auth/authSlice";
import newPostSilice from "./new-post";
import settingsSlice from "./settings/_slice";

export const store = configureStore({
  reducer: {
    app: appSlice,

    auth: authSlice,

    settings: settingsSlice,

    newPost: newPostSilice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
