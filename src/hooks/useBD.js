import { useDispatch, useSelector } from "react-redux";
import { onInitializeCapa, onInitializeCapaEdit, onStartLoadingHolidays, onStartLoadingTemplates } from "../store";
import { calendarApi } from "../api";
import { fetchCalendars } from "../store/calendar/calendarSlice";
import { useAuthStore } from "./useAuthStore";

export const useBD = () => {

    const dispatch = useDispatch();
    const { user } = useAuthStore();

    const {
        holidays,
        templates,
    } = useSelector((state) => state.start); // Accede a startDataSlice

    const startLoadingTemplates = async() => {
        try {
            const { data } = await calendarApi.get('/templates');
            dispatch( onStartLoadingTemplates( data.templates[0] ) );
        } catch (error) {
            console.log(error);
        }
    };

    //Traigo feridados del backend y los guardo en el store.
    const startLoadingHolidays = async () => {
        try {
            let response = await calendarApi.get('/holidays/last');
            let data = response.data;
            if (!data.feriados.feriados_ar) {
                throw new Error('No se pudo obtener los feriados solicitados');
            }
            const lastholidays = data.feriados.feriados_ar.map((day) => new Date(day));
            const lastyear = data.feriados.año;
            
            response = await calendarApi.get('/holidays/'+(lastyear-1));
            data = response.data;

            if (!data.feriados.feriados_ar) {
                throw new Error('No se pudo obtener los feriados solicitados');
            }
            const penultimateholidays = data.feriados.feriados_ar.map((day) => new Date(day));
            const penultimateyear = data.feriados.año;

            dispatch(onStartLoadingHolidays([
                { año: penultimateyear, holidays: penultimateholidays },
                { año: lastyear, holidays: lastholidays }, 
            ]));
            
            dispatch(onInitializeCapa([penultimateyear, lastyear]));
        } catch (error) {
            console.error("Error al cargar los feriados:", error);
            throw error; // Propaga el error para manejarlo en el componente
        }
    };

    const saveConfig = async(calendario) => {
        try{
            await calendarApi.post('/calendars', calendario);
            return null;
        }
        catch (error) {
            return error;
        }
    }

    const updateConfig = async(_id, calendario) => {
        try{
            const data = await calendarApi.put('/calendars', {_id, calendario});
            return null;
        }
        catch (error) {
            return error;
        }
    }

    const deleteCalendarFetch = async(id) => {
        try {
            const { data } = await calendarApi.delete('/calendars/'+id);
            return { data, error:null };
        } catch(error) {
            return { data:null, error };
        }
    }

    const getCalendars = async() => {
        dispatch(fetchCalendars(user.name));
    }

    return {
        //* Propiedades
        holidays,
        templates,

        //* Métodos
        startLoadingHolidays,
        startLoadingTemplates,
        saveConfig,
        updateConfig,
        getCalendars,
        deleteCalendarFetch,
    }
};
