import { createSlice } from '@reduxjs/toolkit';

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        events: []
    },
    reducers: {
        onAddNewEvent: ( state, {payload}) => {   //payload va a ser un vector de objetos
            state.events = [...payload];
        }
    }
});


// Action creators are generated for each case reducer function
export const { onAddNewEvent } = calendarSlice.actions;