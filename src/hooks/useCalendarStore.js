import { useDispatch, useSelector } from "react-redux";
import { onDeleteCalendar } from "../store/calendar/calendarSlice";

export const useCalendarStore = () => {
  
    const dispatch = useDispatch();

    const {
        calendars,
        status, // 'idle' | 'loading' | 'succeeded' | 'failed'
        error,
    } = useSelector( state => state.calendar );

    const deleteCalendar = async(id) => {
        console.log("Eliminando calendario del store");
        dispatch(onDeleteCalendar(id));
    }

    return {
        //*Propiedades
        calendars,
        status, // 'idle' | 'loading' | 'succeeded' | 'failed'
        error,

        //*Metodos
        deleteCalendar,
    }
}

