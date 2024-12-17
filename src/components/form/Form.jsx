import React, { useMemo } from "react";
import { Box, FormGroup, Grid } from "@mui/material";
import { DatePickerCustom } from "./components/DatePickerCustom";
import { SwitchCustom } from "./components/SwitchCustom";
import { SelectDays } from "./components/SelectDays";
import { TextFieldCustom } from "./components/TextFieldCustom";

export const CalendarForm = ({ data, actualizarDatosCapa, isDisabled }) => {
  const { initCalendar, finishCalendar, byWeekday = {}, byMonthdayStr, allDays, agrupar, withHolidays } = data;

  // Memorizar configuraciones específicas para cada componente
  const initCalendarProps = useMemo(() => ({
    label: "Inicio de calendario",
    date: initCalendar,
    setDate: (date) => actualizarDatosCapa({ initCalendar: date }),
    isDisabled,
  }), [initCalendar, actualizarDatosCapa, isDisabled]);

  const finishCalendarProps = useMemo(() => ({
    label: "Fin de calendario",
    date: finishCalendar,
    setDate: (date) => actualizarDatosCapa({ finishCalendar: date }),
    isDisabled,
  }), [finishCalendar, actualizarDatosCapa, isDisabled]);

  const selectDaysProps = useMemo(() => ({
    onChangeSelectDays: (weekday, checked) =>
      actualizarDatosCapa({ byWeekday: weekday, allDays: checked }),
    setAgrupar: (checked) => 
      actualizarDatosCapa({ agrupar: checked }),
    byWeekday,
    allDays,
    isDisabled,
    agrupar,
  }), [byWeekday, allDays, agrupar, actualizarDatosCapa, isDisabled]);

  const textFieldProps = useMemo(() => ({
    byMonthdayStr,
    onChangeByMonthdays: (monthdays) =>
      actualizarDatosCapa({ byMonthdayStr: monthdays }),
    isDisabled,
  }), [byMonthdayStr, actualizarDatosCapa, isDisabled]);

  const switchCustomProps = useMemo(() => ({
    withHolidays,
    setWithHolidays: (checked) =>
      actualizarDatosCapa({ withHolidays: checked }),
    isDisabled,
  }), [withHolidays, actualizarDatosCapa, isDisabled]);

  return (
    <Box sx={{ margin: 2, alignItems: "center", justifyContent: "center" }}>
      <form>
        <FormGroup>
          <Grid container spacing={2}>
            <Grid item container xs={12}>
              <Grid item md={6}>
                <DatePickerCustom {...initCalendarProps} />
              </Grid>
              <Grid item md={6}>
                <DatePickerCustom {...finishCalendarProps} />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <SelectDays {...selectDaysProps} />
            </Grid>
            <Grid item xs={12}>
              <TextFieldCustom {...textFieldProps} />
            </Grid>
            <Grid item xs={12}>
              <SwitchCustom {...switchCustomProps} />
            </Grid>
          </Grid>
        </FormGroup>
      </form>
    </Box>
  );
};
