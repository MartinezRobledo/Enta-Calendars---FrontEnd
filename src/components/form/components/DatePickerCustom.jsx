import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { addYears, subYears } from "date-fns";
import { esES } from '@mui/x-date-pickers/locales';

export const DatePickerCustom = ({ label, date, setDate, isDisabled }) => {

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
      localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}>
      <DatePicker
        label={label}
        value={date}
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
