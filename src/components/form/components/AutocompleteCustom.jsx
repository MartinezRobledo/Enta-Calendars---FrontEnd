import { Autocomplete, TextField } from '@mui/material'

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
  )
}

export default AutocompleteCustom
