import { Button } from '@mui/material'
import SaveAltIcon from '@mui/icons-material/SaveAlt';

export const SubmitCustom = ({Buttons = [], onClick, isDisabled, bgColor = 'primary.main', hoverBgColor = 'primary.extra', icon = null}) => {
  return Buttons.map(btn => 
      (
        <Button
          disabled={isDisabled}
          key={btn}
          id={btn}
          variant="contained"
          // color="default"
          // startIcon={<SaveAltIcon />}
          startIcon={icon}
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
          onClick={e => onClick(e)}
        >
          {btn}
        </Button>
      )
    )
}