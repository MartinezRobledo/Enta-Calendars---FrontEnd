import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isSameDay } from 'date-fns';

export const initializeConfig = createAsyncThunk(
    'config/initialize',
    async (_, { getState, dispatch }) => {
        const { añoFiscal } = getState().start;
        if (!añoFiscal) {
            throw new Error('El año fiscal no está definido');
        }
        const capaInicial = {
            id: 1,
            title: 'Capa 1',
            data: {
                initCalendar: new Date(añoFiscal, 0, 1),
                finishCalendar: new Date(añoFiscal, 11, 31),
                byWeekday: {},
                byMonthday: [],
                byMonthdayStr: '',
                allDays: false,
                withHolidays: true,
            },
            dependienteDe: null,
            esPadre: [],
            dias: [],
        };
        dispatch(onInitializeCapa(capaInicial));
    }
);

export const configSlice = createSlice({
    name: 'config',
    initialState: {
        titleStore: '',
        capasStore: [],
        capaActualStore: 0,
        aditionalDaysToAdd: [],
        aditionalDaysToRemove: [],
        diasActivosStore: [],
    },
    reducers: {
        onInitializeCapa: (state, { payload }) => {
            state.capasStore.push(payload);
        },
        onChangeTitle: (state, { payload }) => {
            state.titleStore = payload;
        },      
        onChangeAditionalDaysToAdd: (state, { payload }) => {
            // Verifica si el día ya está en la lista
            const exists = state.aditionalDaysToAdd.some((day) => isSameDay(day, payload));
            
            if (exists) {
                // Si ya está, lo eliminamos
                state.aditionalDaysToAdd = state.aditionalDaysToAdd.filter(
                    (day) => !isSameDay(day, payload)
                );
            } else {
                // Si no está, lo añadimos
                state.aditionalDaysToAdd.push(payload);
                // También eliminamos el día de la lista de días a excluir
                state.aditionalDaysToRemove = state.aditionalDaysToRemove.filter(
                    (day) => !isSameDay(day, payload)
                );
            }
        },
        onChangeAditionalDaysToRemove: (state, { payload }) => {
            // Verifica si el día ya está en la lista
            const exists = state.aditionalDaysToRemove.some((day) => isSameDay(day, payload));
            
            if (exists) {
                // Si ya está, lo eliminamos
                state.aditionalDaysToRemove = state.aditionalDaysToRemove.filter(
                    (day) => !isSameDay(day, payload)
                );
            } else {
                // Si no está, lo añadimos
                state.aditionalDaysToRemove.push(payload);
                // También eliminamos el día de la lista de días a añadir
                state.aditionalDaysToAdd = state.aditionalDaysToAdd.filter(
                    (day) => !isSameDay(day, payload)
                );
            }
        },
        onChangeDiasActivos: (state, { payload }) => {
            state.diasActivosStore = payload;
        },
        onChangeCapas: (state, { payload }) => {
            state.capasStore = payload;
        },
        onChangeCapaActual: (state, { payload }) => {
            state.capaActualStore = payload;
        },
    },
});

// Exporta las acciones
export const {
    onInitializeCapa,
    onChangeTitle,
    onChangeAditionalDaysToAdd,
    onChangeAditionalDaysToRemove,
    onChangeDiasActivos,
    onChangeCapas,
    onChangeCapaActual,
} = configSlice.actions;
