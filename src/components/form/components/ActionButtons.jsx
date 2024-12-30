import { Button } from '@mui/material'


export const ActionButtons = ({Buttons = [], isDisabled, bgColor = 'primary.main', hoverBgColor = 'primary.extra'}) => {
  return Buttons.map( action => 
      (
        <Button
          disabled={isDisabled}
          key={action.key}
          variant="contained"
          startIcon={action.icon}
          sx={{ 
          color: 'default.main', // Texto e ícono toman el color del tema
          margin: 1,
          mt:1,
          width: '90%', // Ajusta el ancho del botón al 90% del contenedor
          backgroundColor: bgColor,
          '&:hover': {
              backgroundColor: hoverBgColor, // Fondo al hacer hover
              }
          }}
          onClick={e => action.handler(e)}
        >
          {action.key}
        </Button>
      )
    )
}