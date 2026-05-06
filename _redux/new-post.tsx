import { StrokeItem } from "@/components/sketch/type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Preview = {
  viewBox: string;
  strokeItems: StrokeItem[];
  color: string;
  size: number;
};

const initialState = {
  preview: null as null | Preview,
};

const newPostSlice = createSlice({
  name: "new-post-slice",
  initialState,
  reducers: {
    setPreview(s, a: PayloadAction<Preview>) {
      s.preview = a.payload;
    },
  },
  extraReducers: (builder) => {},
});

export default newPostSlice.reducer;
export const { setPreview } = newPostSlice.actions;
