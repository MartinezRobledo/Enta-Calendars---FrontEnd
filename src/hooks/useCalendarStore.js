import { useDispatch, useSelector } from "react-redux";
import { onAddNewEvent } from "../store/calendar/calendarSlice";

export const useCalendarStore = () => {
  
    const dispatch = useDispatch();

    const {
        events
    } = useSelector( state => state.calendar );


    const addNewEvent = ( calendarEvent ) => {
        dispatch( onAddNewEvent(calendarEvent) );
    }

    return {
        //*Propiedades
        events,

        //*Metodos
        addNewEvent,
    }
}

