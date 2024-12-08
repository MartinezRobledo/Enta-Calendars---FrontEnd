import { useDispatch, useSelector } from "react-redux";
import { initializeConfig, onStartLoadingHolidays, onStartLoadingTemplates } from "../store";
import { calendarApi } from "../api";

export const useInitializeApp = () => {

    const dispatch = useDispatch();

    const {
        holidays,
        templates,
        añoFiscal,
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
            const { data } = await calendarApi.get('/holidays/last');
            if (!data || !data.feriados || !data.feriados.feriados_ar) {
                throw new Error('Formato de datos inválido');
            }
            const holidays = data.feriados.feriados_ar.map((day) => new Date(day));
            dispatch(onStartLoadingHolidays({ holidays, año: data.feriados.año }));
        } catch (error) {
            console.error("Error al cargar los feriados:", error);
            throw error; // Propaga el error para manejarlo en el componente
        }
    };

    const startInitialConfig = () => {
        dispatch(initializeConfig());
    }

    return {
        //* Propiedades
        holidays,
        añoFiscal,
        templates,

        //* Métodos
        startLoadingHolidays,
        startLoadingTemplates,
        startInitialConfig
    }
};
