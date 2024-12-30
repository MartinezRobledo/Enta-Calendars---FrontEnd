import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./ui/uiSlice";
import { calendarSlice } from "./calendar/calendarSlice";
import { configSlice } from "./config/configSlice";
import { configEditSlice } from "./config/configEditSlice";
import { authSlice } from "./auth/authSlice";
import { startDataSlice } from "./config/startDataSlice";


export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        start: startDataSlice.reducer,
        calendar: calendarSlice.reducer,
        config: configSlice.reducer,
        configEdit: configEditSlice.reducer,
        ui: uiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false
    })
})