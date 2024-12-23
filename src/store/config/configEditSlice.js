import { createSlice } from '@reduxjs/toolkit';
import { isSameDay } from 'date-fns';

export const configEditSlice = createSlice({
    name: 'configEdit',
    initialState: {
        titleStore: '',
        capasStore: [{
            id: 1,
            title: 'Capa 1',
            data: {
              initCalendar: new Date(),
              finishCalendar: new Date(),
              byWeekday: {},
              byMonthday: [],
              byMonthdayStr: '',
              allDays: false,
              agrupar: false,
              withHolidays: true,
            },
            dependienteDe: null,
            esPadre: [],
            dias: [],
          }],
        capaActualStore: 0,
        aditionalDaysToAdd: [],
        aditionalDaysToRemove: [],
        diasActivosStore: [],
        _id: null,
        isDisabled: true,
        fechaActualizacion: null,
    },
    reducers: {
        onInitializeCapaEdit: (state, { payload }) => {
            Object.assign(state, payload);
        },
        onChangeTitle: (state, { payload }) => {
            state.titleStore = payload;
        },
        onChange_id: (state, { payload }) => {
            state._id = payload
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
    onInitializeCapaEdit,
    onChangeTitle,
    onChangeAditionalDaysToAdd,
    onChangeAditionalDaysToRemove,
    onChangeDiasActivos,
    onChangeCapas,
    onChangeCapaActual,
    onChange_id,
} = configEditSlice.actions;
