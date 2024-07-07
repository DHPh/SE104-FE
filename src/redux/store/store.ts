"use client";

import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/auth-slice";
import languageSlice from "../slice/language-slice";
import weddingSlice from "../slice/wedding-slice";
import errorSlice from "../slice/error-slice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        language: languageSlice,
        wedding: weddingSlice,
        error: errorSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
