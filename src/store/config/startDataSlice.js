import { createSlice } from '@reduxjs/toolkit';

export const startDataSlice = createSlice({
    name: 'start',
    initialState: {
        holidays: [],
        templates: null
    },
    reducers: {
        onStartLoadingTemplates: ( state, { payload } ) => {
            state.templates = payload.template_calendarbp;
        },

        onStartLoadingHolidays: ( state, { payload } ) => {
            state.holidays = payload;
        },
    }
});

// Action creators are generated for each case reducer function
export const { 
    onStartLoadingTemplates,
    onStartLoadingHolidays,
} = startDataSlice.actions;
