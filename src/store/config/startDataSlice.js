import { createSlice } from '@reduxjs/toolkit';

export const startDataSlice = createSlice({
    name: 'start',
    initialState: {
        holidays: null,
        añoFiscal: null,
        templates: null
    },
    reducers: {
        onStartLoadingTemplates: ( state, { payload } ) => {
            state.templates = payload.template_calendarbp;
        },

        onStartLoadingHolidays: ( state, { payload } ) => {
            state.holidays = payload.holidays;
            state.añoFiscal = payload.año;
        },
    }
});

// Action creators are generated for each case reducer function
export const { 
    onStartLoadingTemplates,
    onStartLoadingHolidays,
} = startDataSlice.actions;
