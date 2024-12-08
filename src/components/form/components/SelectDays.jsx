import { Checkbox, FormControlLabel, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export const SelectDays = ({byWeekday = {}, onChangeSelectDays, allDays, isDisabled }) => {
  const tempOfWeek = {
    'Lunes': 0,
    'Martes': 1,
    'Miércoles': 2,
    'Jueves': 3,
    'Viernes': 4,
    'Sábado': 5,
    'Domingo': 6
  };

  const handleSelectAllDays = (checked) => {
    checked
    ? onChangeSelectDays(tempOfWeek, checked)   // Si seleccionamos todos los días, convertimos el objeto en un array de claves  
    : onChangeSelectDays({}, checked);          // Si desmarcamos, seteamos el array vacío
  };

  const handleSetWeek = (newDays) => {
    // Filtrar claves de `tempOfWeek` que estén en `newDays`
    const filteredObject = Object.fromEntries(
        Object.entries(tempOfWeek).filter(([key]) => newDays.includes(key))
    );

    // Comparar la longitud del objeto filtrado con la cantidad total de claves en `tempOfWeek`
    Object.keys(filteredObject).length === Object.keys(tempOfWeek).length
        ? onChangeSelectDays(filteredObject, true)
        : onChangeSelectDays(filteredObject, false);
};


  return (
    <>
      {/* Título */}
      <Typography sx={{ mb: 1 }}>Seleccione los días:</Typography>

      {/* Toggle buttons para cada día de la semana */}
      <ToggleButtonGroup
        value={Object.keys(byWeekday)} // Pasamos el array de días seleccionados
        onChange={(event, newDays) => {
          handleSetWeek(newDays); // Actualizar los días seleccionados
        }}
        aria-label="Días de la semana"
        sx={{ display: 'flex', flexWrap: 'wrap' }}
      >
        {Object.keys(tempOfWeek).map((day) => (
          <ToggleButton
            disabled={isDisabled}
            key={day}
            value={day} // Usamos el nombre del día como valor
            aria-label={day}
            sx={{
              flex: '1',
              margin: '1px',
              '&:hover': {
                backgroundColor: 'primary.main', // Fondo al hacer hover
              },
              '&.Mui-selected': {
                backgroundColor: 'primary.main', // Fondo cuando está seleccionado
                color: 'white', // Color del texto cuando está seleccionado
                '&:hover': {
                  backgroundColor: 'secondary.main', // Fondo al hacer hover cuando está seleccionado
                }
              }
            }}
          >
            {day.substring(0, 3)} {/* Mostrar solo las primeras 3 letras */}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Checkbox para seleccionar todos los días */}
      <Grid container alignItems="center" spacing={2} justifyContent={'space-between'}>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                disabled={isDisabled}
                checked={allDays}
                onChange={(status) => handleSelectAllDays(status.target.checked)}
                color="primary"
              />
            }
            label="Todos los días"
          />
        </Grid>
      </Grid>
    </>
  );
};
