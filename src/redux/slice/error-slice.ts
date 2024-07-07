/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ErrorState {
    errorMessages: string | null;
    showError: boolean;
    checkpoint: boolean;
    successMessage: string | null;
    showSuccess: boolean;
}

const initialState: ErrorState = {
    errorMessages: null,
    showError: false,
    checkpoint: false,
    successMessage: null,
    showSuccess: false,
};

const errorSlice = createSlice({
    name: "error",
    initialState,
    reducers: {
        setError(state, action: PayloadAction<string>) {
            state.errorMessages = action.payload;
            state.showError = true;
            state.checkpoint = !state.checkpoint;
        },
        clearError(state) {
            state.errorMessages = null;
            state.showError = false;
        },
        setSuccess(state, action: PayloadAction<string>) {
            state.successMessage = action.payload;
            state.showSuccess = true;
            state.checkpoint = !state.checkpoint;
        },
        clearSuccess(state) {
            state.successMessage = null;
            state.showSuccess = false;
        },
    },
});

export const { setError, clearError, setSuccess, clearSuccess } = errorSlice.actions;
export default errorSlice.reducer;
