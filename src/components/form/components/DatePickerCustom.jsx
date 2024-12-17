import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { addYears, subYears, isValid, parseISO } from "date-fns";
import { esES } from '@mui/x-date-pickers/locales';

export const DatePickerCustom = ({ label, date, setDate, isDisabled }) => {
  // Convertir la fecha entrante al formato válido para el DatePicker
  const getValidDate = (inputDate) => {
    if (!inputDate) return null;
    if (inputDate instanceof Date && isValid(inputDate)) return inputDate; // Es una fecha válida
    if (typeof inputDate === 'string') {
      const parsedDate = parseISO(inputDate); // Intenta convertir una ISO string
      return isValid(parsedDate) ? parsedDate : null;
    }
    if (typeof inputDate === 'number') {
      const parsedDate = new Date(inputDate); // Convierte de timestamp
      return isValid(parsedDate) ? parsedDate : null;
    }
    return null; // Retorna null si no es válida
  };

  const validDate = getValidDate(date);

  const onChange = (newValue = new Date()) => {
    if (!newValue || newValue == 'Invalid Date') return;

    const fecha = new Date(newValue.getFullYear(), newValue.getMonth(), newValue.getDate(), 0, 0, 0);

    if (fecha >= subYears(new Date(), 2) && fecha <= addYears(new Date(), 2)) {
      setDate(fecha);
    }
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <DatePicker
        label={label}
        value={validDate} // Pasa la fecha validada al DatePicker
        minDate={subYears(new Date(), 2)}
        maxDate={addYears(new Date(), 2)}
        sx={{ m: 1 }}
        onChange={onChange}
        views={['day', 'month', 'year']}
        format="dd/MM/yyyy"
        disabled={isDisabled}
      />
    </LocalizationProvider>
  );
};
