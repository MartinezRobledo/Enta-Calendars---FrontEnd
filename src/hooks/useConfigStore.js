import { useDispatch, useSelector } from "react-redux"
import { onChangeAditionalDaysToAdd, 
        onChangeAditionalDaysToRemove,
        onChangeCapaActual,
        onChangeCapas,
        onChangeDiasActivos, 
        onChangeTitle } from "../store/config/configSlice";

export const useConfigStore = ()=> {

    const dispatch = useDispatch();

    const {
        titleStore,
        capasStore,
        capaActualStore,
        diasActivosStore,
        aditionalDaysToAdd,
        aditionalDaysToRemove,
    } = useSelector( state => state.config ); // Accede a configSlice

    const changeTitle = (value) => {
        dispatch( onChangeTitle(value) );
    }

    const changeCapas = (capaActualizada) => {
        dispatch(onChangeCapas(capaActualizada));
    };       

    const changeAditionalDaysToAdd = (days) => {
        dispatch( onChangeAditionalDaysToAdd(days) );
    }

    const changeAditionalDaysToRemove = (days) => {
        dispatch( onChangeAditionalDaysToRemove(days) );
    }

    const changeDiasActivos = (days) => {
        dispatch(onChangeDiasActivos(days));
    }

    const changeCapaActual = (capa) => {
        dispatch(onChangeCapaActual(capa));
    }

    return {
        //* Propiedades
        titleStore,
        capasStore,
        capaActualStore,
        diasActivosStore,
        aditionalDaysToAdd,
        aditionalDaysToRemove,

        //* Métodos
        changeTitle,
        changeCapas,
        changeAditionalDaysToAdd,
        changeAditionalDaysToRemove,
        changeDiasActivos,
        changeCapaActual,
    }
}