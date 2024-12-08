import { useDispatch, useSelector } from "react-redux"
import { onActivateSpin, onCloseDateModal, onDesactivateSpin, onOpenDateModal } from "../store/ui/uiSlice";


export const useUiStore = ()=> {

    const dispatch = useDispatch();

    const {
        isDateModalOpen,
        isSpinActive,
    } = useSelector( state => state.ui );

    const openDateModal = () => {
        dispatch( onOpenDateModal() );
    }

    const closeDateModal = () => {
        dispatch( onCloseDateModal() )
    }

    const activateSpin = () => {
        dispatch( onActivateSpin() );
    }

    const desactivateSpine = () => {
        dispatch( onDesactivateSpin() )
    }

    return {
        //* Propiedades
        isDateModalOpen,
        isSpinActive,

        //* Métodos
        openDateModal,
        closeDateModal,
        activateSpin,
        desactivateSpine,
    }
}