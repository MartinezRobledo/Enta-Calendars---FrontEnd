import { useDispatch, useSelector } from "react-redux"
import { onChangeAditionalDaysToAdd, 
        onChangeAditionalDaysToRemove,
        onChangeCapaActual,
        onChangeCapas,
        onChangeDiasActivos, 
        onChangeTitle,
        onInitializeCapaEdit } from "../store/config/configEditSlice";


export const useConfigEditStore = ()=> {

    const dispatch = useDispatch();

    const {
        titleStore,
        capasStore,
        capaActualStore,
        diasActivosStore,
        aditionalDaysToAdd,
        aditionalDaysToRemove,
        _id,
        isDisabled,
    } = useSelector( state => state.configEdit ); // Accede a configSlice

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

    const changeOnInitializeCapaEdit = (capa) => {
        dispatch(onInitializeCapaEdit(capa));
    }

    return {
        //* Propiedades
        titleStore,
        capasStore,
        capaActualStore,
        diasActivosStore,
        aditionalDaysToAdd,
        aditionalDaysToRemove,
        _id,
        isDisabled,

        //* Métodos
        changeTitle,
        changeCapas,
        changeAditionalDaysToAdd,
        changeAditionalDaysToRemove,
        changeDiasActivos,
        changeCapaActual,
        changeOnInitializeCapaEdit,
    }
}