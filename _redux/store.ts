import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import sectionSlice from "./sections/sectionSlice";
import qpSlice from "./quran-progress/qpSlice";
import trainingSlice from "./training/training-slice";
import gradingSlice from "./training/grade-slice";
import alphabetTrainingSlice from "./training/alphabet-training-slice";
import wordTrainingSlice from "./training/word-training-slice";
import achievementSlice from "./achievement/achievementSlice";
import settingsSlice from "./settings/_slice";
import appSlice from "./app";
import postSlice from "./posts/postSlice";
import newPostSlice from "./new-post/newPostSlice";
import audioStoreSlice from "./posts/audioStoreSlice";
import qdcStoreSlice from "./posts/qdcStoreSlice";
import postStoreSlice from "./posts/postStoreSlice";
import playerSlice from "./player/playerSlice";
import myProfileSlice from "./profile/myProfileSlice";
import myProgressSlice from "./myProgress/myProgressSlice";
import questSlice from "@/_app_future/_folders/quests/slice";
import creatorProfileSlice from "./profile/creatorProfile";

export const store = configureStore({
    reducer: {
        myProgress: myProgressSlice,
        quests: questSlice,

        myProfile: myProfileSlice,
        profile: creatorProfileSlice,

        app: appSlice,

        auth: authSlice,
        achievements: achievementSlice,

        settings: settingsSlice,
        grade: gradingSlice,

        section: sectionSlice,
        quranProgress: qpSlice,

        alphabetTraining: alphabetTrainingSlice,
        wordTraining: wordTrainingSlice,
        training: trainingSlice,
        player: playerSlice,

        newPost: newPostSlice,

        post: postSlice,
        postStore: postStoreSlice,
        qdcStore: qdcStoreSlice,
        audioStore: audioStoreSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
