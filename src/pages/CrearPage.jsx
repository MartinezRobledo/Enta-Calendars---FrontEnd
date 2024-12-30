import { Grid } from "@mui/material"
import { Navbar, CalendarForm } from "../components"
import { useConfigStore, useUiStore } from "../hooks"
import { SpinModal } from "../components/spinner/spinModal";
import 'sweetalert2/dist/sweetalert2.min.css';

export const CrearPage = () => {

  const {
    titleStore,
    añosStore,
    indexAñoStore,
    changeTitle,
    changeAñosStore,
    changeIndexAño,
  } = useConfigStore();
 
  const {isSpinActive} = useUiStore();
  const acciones = ['Crear', 'Exportar'];

  if(!isSpinActive)
    return (
      <Grid container direction="column">
        <Grid item sx={{ width: '100%' }}>
          <Navbar />
        </Grid>
        <Grid item xs={12} md={6} sm={12} xl={4}>
          <CalendarForm
          titleStore={titleStore}
            añosStore={añosStore}
            indexAñoStore={indexAñoStore}
            changeTitle={changeTitle}
            changeAñosStore={changeAñosStore}
            changeIndexAño={changeIndexAño}
            accionesActivas={acciones}
          />      
        </Grid>
      </Grid>
    )

    return(
      <div style={{display: isSpinActive ? 'flex' : 'none', position:'absolute'}}>
            <SpinModal></SpinModal>
      </div>
    )
    
}