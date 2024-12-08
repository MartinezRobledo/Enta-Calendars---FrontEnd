import { Typography } from "@mui/material"
import { Navbar } from "../components"

export const ActualizarPage = () => {
  return (
    <div>
      <Navbar />
      <Typography
        sx={{position: 'fixed', left:'50%', height:'50%', fontSize: 60, transform:'translate(-50%,50%)'}}
        noWrap
      >
        Sección en desarrollo...
    </Typography>
    </div>
  )
}