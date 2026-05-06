import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initial = {
    email: "",
    password: "",
    isLoggedIn: false,
    referredByCode: undefined as string | undefined,
};

const authSlice = createSlice({
    name: "current-user",
    initialState: initial,
    reducers: {
        setReferredByCode(s, a: PayloadAction<string | undefined>) {
            s.referredByCode = a.payload;
        },
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
export const { setEmail, setPassword, setIsLoggedIn, setReferredByCode } = authSlice.actions;

const onRejection = (state: any, { error, type }: any) => {
    console.error(type, error);
};
/**
 * Types of COGNITO AUTH ERROR
 *
 * Incorrect username or password
 */
