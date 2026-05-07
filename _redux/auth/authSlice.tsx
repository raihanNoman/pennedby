import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initial = {
  email: "",
  password: "",
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "current-user",
  initialState: initial,
  reducers: {
    setEmail(state, { payload }: PayloadAction<string>) {
      state.email = payload;
    },
    setPassword(state, { payload }: PayloadAction<string>) {
      state.password = payload;
    },
    setIsLoggedIn(state, { payload }: PayloadAction<boolean>) {
      state.isLoggedIn = payload;
      console.log("[redux] set-logged-in", payload);
    },
  },
  extraReducers: (builder) => {},
});

export default authSlice.reducer;
export const { setEmail, setPassword, setIsLoggedIn } = authSlice.actions;

const onRejection = (state: any, { error, type }: any) => {
  console.error(type, error);
};
/**
 * Types of COGNITO AUTH ERROR
 *
 * Incorrect username or password
 */
