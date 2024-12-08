import { FormControlLabel, Grid, InputLabel, Switch } from '@mui/material'

export const SwitchCustom = ({withHolidays = true, setWithHolidays, isDisabled}) => {

  return (
    <Grid container justifyContent={'space-between'} alignItems={'center'} spacing={2}>
      <Grid item>
      <FormControlLabel
          control={
              <>
                <Switch
                  checked={withHolidays}
                  onChange={(event, checked) => setWithHolidays(checked)}
                  color="primary"
                  name="switch"
                  disabled={isDisabled}
                />
                <InputLabel
                  disabled={isDisabled}
                  sx={{
                    color: withHolidays ? 'primary.main' : undefined,
                    fontWeight: withHolidays ? 'bold' : undefined
                  }} >
                    Feriados
                </InputLabel>
              </>
          }
      />
      </Grid>
    </Grid>
  )
}