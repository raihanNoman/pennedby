import { createAsyncThunk } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import print from "@/utils/print";

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const thunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();

export const useStoreSize = () => {
  const state = useSelector((state) => state);

  useEffect(() => {
    const getSliceSizes = (state: any) => {
      const sizes = {} as any;
      Object.keys(state).forEach((key) => {
        const slice = state[key];
        const sizeInBytes = new Blob([JSON.stringify(slice)]).size;
        sizes[key] = (sizeInBytes / 1024).toFixed(2); // Convert to KB
      });
      return sizes;
    };

    const size = new Blob([JSON.stringify(state)]).size;
    const sizes = getSliceSizes(state);

    console.log(`Redux Store Size: ${size / 1024} KB`);
    print(["sizes by slice", sizes]);
  }, [state]);
};
