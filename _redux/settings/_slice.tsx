import { createSlice } from "@reduxjs/toolkit";

const musufSlice = createSlice({
  name: "musuf-slice",
  initialState: {},
  reducers: {
    // // init
    // setSettings(s, a: PayloadAction<Settings>) {
    //   s.wordOpacity = a.payload.wordOpacity;
    //   s.arabic = a.payload.arabic;
    //   s.languages = a.payload.languages;
    //   s.lns = Object.keys(a.payload.languages) as LN.onCDN[];
    //   s.showAll = a.payload.showAll;
    // },
  },
});

export default musufSlice.reducer;
export const {} = musufSlice.actions;
