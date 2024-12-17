import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { calendarApi } from '../../api';

export const fetchCalendars = createAsyncThunk('calendars/fetchCalendars', async (user) => {
    try {
      const response = await calendarApi.get('/calendars/'+ user);
      if (!Array.isArray(response.data.calendars)) {
        throw new Error('El formato de datos del API no es válido');
      }
      
      const calendars = response.data.calendars.map(calendar => {
        return {
          titleStore: calendar.titleStore,
          capasStore: calendar.capasStore.map(capa => {
            return {
              id: capa.id,
              title: capa.title,
              data: {
                initCalendar: new Date(capa.data.initCalendar),
                finishCalendar: new Date(capa.data.finishCalendar),
                byWeekday: capa.data.byWeekday,
                byMonthday: capa.data.byMonthday,
                byMonthdayStr: capa.data.byMonthdayStr,
                allDays: capa.data.allDays,
                agrupar: capa.data.agrupar,
                withHolidays: capa.data.withHolidays,
              },
            dependienteDe: capa.dependienteDe,
            esPadre: capa.esPadre,
            dias: capa.dias,
            }
          }),
          capaActualStore: calendar.capaActualStore,
          aditionalDaysToAdd: calendar.aditionalDaysToAdd,
          aditionalDaysToRemove: calendar.aditionalDaysToRemove,
          diasActivosStore: calendar.diasActivosStore,
          fechaActualizacion: calendar.fechaActualizacion,
        }
      });
      return response.data.calendars;
    } catch(error) {
      console.error(error);
      return rejectWithValue(error.response?.data || 'Error desconocido');
    }
  });

export const calendarSlice = createSlice({
    name: 'calendars',
    initialState: {
    calendars: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    onDeleteCalendar: (state, {payload}) => {
      state.calendars = state.calendars.filter(calendar => calendar._id != payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendars.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCalendars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.calendars = action.payload;
      })
      .addCase(fetchCalendars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});



// Action creators are generated for each case reducer function
export const { 
  onDeleteCalendar,
} = calendarSlice.actions;