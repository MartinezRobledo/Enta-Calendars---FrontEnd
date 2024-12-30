import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { calendarApi } from '../../api';

// Función para convertir las fechas en formato ISO a objetos Date
const convertDatesToObjects = (calendars) => {
  return calendars.map(calendar => {
    calendar.añosStore.map(año => {
      if (año.capasStore) {
        año.capasStore.forEach(capa => {
          if (capa.dias) {
            capa.dias = capa.dias.map(fecha => new Date(fecha));
          }
          if (capa.data) {
            capa.data.initCalendar = new Date(capa.data.initCalendar);
            capa.data.finishCalendar = new Date(capa.data.finishCalendar);
          }
        });
      }
      if (año.diasActivosStore) {
        año.diasActivosStore = año.diasActivosStore.map(fecha => new Date(fecha));
      }
    })
    calendar.fechaActualizacion = new Date(calendar.fechaActualizacion);
    return calendar;
  });
};

export const fetchCalendars = createAsyncThunk('calendars/fetchCalendars', async (user, { rejectWithValue }) => {
  try {
    const response = await calendarApi.get('/calendars/' + user);
    if (!Array.isArray(response.data.calendars)) {
      throw new Error('El formato de datos del API no es válido');
    }
    const processedCalendars = convertDatesToObjects(response.data.calendars);
    return processedCalendars;
  } catch (error) {
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