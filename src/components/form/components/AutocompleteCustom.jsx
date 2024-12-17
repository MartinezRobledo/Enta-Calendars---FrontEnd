import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

const AutocompleteCustom = ({isDisabled, options = [], actualOption, criterio, label, handleChange, width}) => {

  return (
    <Autocomplete
        disabled={isDisabled}
        disablePortal
        options={options
        .filter((_, idx) => idx !== actualOption) // Excluir la capa actual
        .map((option) => ({ label: option.title, id: option.id }))} // Simplificar las opciones
        getOptionLabel={(option) => option.label || ''} // Definir cómo mostrar las opciones
        isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparar correctamente opciones
        value={
        criterio !== null
            ? options
                .filter((_, idx) => idx !== actualOption) // Filtrar capas válidas
                .map((capa) => ({ label: capa.title, id: capa.id }))
                .find((option) => option.id === criterio || null) // Buscar la opción actual
            : null
        } // Asegurarse de que el valor sea consistente con las opciones
        onChange={(_, newValue) =>
            handleChange(newValue ? parseInt(newValue.id) : null)
        } // Actualizar el estado al cambiar
        renderInput={(params) => <TextField {...params} label={label} />} // Input con etiqueta
        sx={{ display: 'flex', width: width ? width : '100%' }} // Estilo del componente
    />
    // <Autocomplete
    //     disabled={isDisabled}
    //     disablePortal
    //     options={capas
    //     .filter((_, idx) => idx !== capaActual) // Excluir la capa actual
    //     .map((capa) => ({ label: capa.title, id: capa.id }))} // Simplificar las opciones
    //     getOptionLabel={(option) => option.label || ''} // Definir cómo mostrar las opciones
    //     isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparar correctamente opciones
    //     value={
    //     capas[capaActual]?.dependienteDe !== null
    //         ? capas
    //             .filter((_, idx) => idx !== capaActual) // Filtrar capas válidas
    //             .map((capa) => ({ label: capa.title, id: capa.id }))
    //             .find((option) => option.id === capas[capaActual].dependienteDe || null) // Buscar la opción actual
    //         : null
    //     } // Asegurarse de que el valor sea consistente con las opciones
    //     onChange={(_, newValue) =>
    //     manejarCambioDependencia(newValue ? parseInt(newValue.id) : null)
    //     } // Actualizar el estado al cambiar
    //     renderInput={(params) => <TextField {...params} label="Depende de:" />} // Input con etiqueta
    //     sx={{ width: 300 }} // Estilo del componente
    // />
  )
}

export default AutocompleteCustom
