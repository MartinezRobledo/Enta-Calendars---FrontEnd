import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isDateModalOpen: false,
        isSpinActive: false,
    },
    reducers: {
        onOpenDateModal: ( state ) => {
            state.isDateModalOpen = true;
        },
        onCloseDateModal: ( state ) => {
            state.isDateModalOpen = false;
        },
        onActivateSpin: ( state ) => {
            state.isSpinActive = true;
        },
        onDesactivateSpin: ( state ) => {
            state.isSpinActive = false;
        }
    }
});

// Action creators are generated for each case reducer function
export const { onOpenDateModal, onCloseDateModal, onActivateSpin, onDesactivateSpin } = uiSlice.actions;
