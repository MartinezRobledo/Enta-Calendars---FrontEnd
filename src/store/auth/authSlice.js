import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'name',
    initialState: {
        status: 'checking',
        errorMessage: undefined,
    },
    reducers: {
        onChecking: ( state ) => {
            state.status = 'checking';
            state.user = {};
            state.errorMessage = undefined;
        },
        onLogin: ( state, { payload } ) => {
            state.status = 'authenticated';
            state.user = payload;
            state.errorMessage = undefined;
        },
        onLogout: ( state, { payload } ) => {
            state.status = 'no-authenticated';
            state.user = {};
            localStorage.clear();
            state.errorMessage = payload;
        },
        clearErrorMessage: ( state ) => {
            state.errorMessage = undefined;
        }
    }
});

// Action creators are generated for each case reducer function
export const { onChecking, onLogin, onLogout, clearErrorMessage } = authSlice.actions;