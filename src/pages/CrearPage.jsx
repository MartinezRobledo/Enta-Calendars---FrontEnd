import { Grid, Input } from "@mui/material"
import { Navbar, CapasForm } from "../components"
import { useAuthStore, useConfigStore, useInitializeApp, useUiStore } from "../hooks"
import { SpinModal } from "../components/spinner/spinModal";
import Calendar from "../components/calendar/Calendar";
import { useEffect, useRef, useState } from "react";
import { SubmitCustom } from "../components/form/components/SubmitCustom";
import ButtonGroup from "../components/button/ButtonGroup";
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { ExportBprelease, ExportCsv } from "./functions/documentCreator";
import { createCalendarAutomation, createCalendarbp } from "./functions/calendarCreator";

const extensions = ['.bprelease', '.csv'];

export const CrearPage = () => {
 
  const { titleStore, diasActivosStore, aditionalDaysToAdd, aditionalDaysToRemove, capasStore,
          changeTitle, changeDiasActivos } = useConfigStore();
  const { user } = useAuthStore();
  const { templates } = useInitializeApp();
  const {isSpinActive} = useUiStore();
  const [isDisabled, setIsDisabled] = useState(false); // Nuevo estado para deshabilitar formulario
  const [showButtons, setShowButtons] = useState(false);
  const diasRef = useRef([]); // Usamos useRef para rastrear el valor actual de `title`
  const titleRef = useRef(""); // Usamos useRef para rastrear el valor actual de `title`
  const [diasActivos, setDiasActivos] = useState(diasActivosStore);
  const [title, setTitle] = useState(titleStore);

  // Sincroniza `title` con el `ref`
  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    diasRef.current = diasActivos;
  }, [diasActivos]);

  useEffect(() => {
    // Función de limpieza que se ejecuta al desmontar
    return () => {
      actualizarStore();
    };
  }, []);

  const actualizarStore = () => {
    titleRef.current ? changeTitle(titleRef.current) : null; // Llama a changeTitle con el título que deseas guardar
    diasRef.current ? changeDiasActivos(diasRef.current) : [];
  }

  const validarExportacion = () => {
    if(!title) {
      Swal.fire({
        icon: 'error',
        title: 'No definió ningún nombre',
        text: 'No se puede crear un calendario sin nombre',
        confirmButtonText: 'Entendido',
        buttonsStyling: true, // Permite personalizar el estilo del botón
        confirmButtonColor: '#ff8a00'
      });
      return;
    }

    if(diasActivos.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'No definió ningún día',
        text: 'No se puede crear un calendario sin días',
        confirmButtonText: 'Entendido',
        buttonsStyling: true, // Permite personalizar el estilo del botón
        confirmButtonColor: '#ff8a00'
      });
      return;
    }

    setIsDisabled(true);
    setShowButtons(true);
  }

  const exportar = (ext) => {
    actualizarStore();
    const diasFinales = [...new Set(
    [...diasActivos, ...aditionalDaysToAdd]
    )].flat()
    .filter(
      day => !aditionalDaysToRemove.includes(day)
    )
    const inicio = new Date(Math.min(...capasStore.map(capa => {
      return capa.data.initCalendar;
    })));
    const fin = new Date(Math.max(...capasStore.map(capa => {
      return capa.data.finishCalendar;
    })));
    if(ext == '.bprelease')
      ExportBprelease(createCalendarbp(templates, diasFinales, title, user.name, inicio, fin), title);
    else
      ExportCsv(createCalendarAutomation(diasFinales), title);
  }

  const cancelar = () => {
    setIsDisabled(false);
    setShowButtons(false);
  }

  if(!isSpinActive)
    return (
      <Grid container direction="column">
        <Grid item sx={{ width: '100%' }}>
          <Navbar />
        </Grid>
        <Grid container item sx={{ flex: 1, padding:2}}>
          <Grid item xs={12} md={6} sm={12} xl={4}>
            <Input
                disabled={isDisabled}
                placeholder="Ingrese nombre del calendario"
                value={title}
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                sx={{
                  width: '400px',
                  height: '50px',
                  fontSize: '1.5rem',
                  padding: '10px',
                  mb: 1,
                }}
            />

            <CapasForm 
              isDisabled={isDisabled}
              setDiasActivos={setDiasActivos}
            />

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginTop:'2rem'}}>
            {showButtons
                  ? 
                  <div className="animate__animated animate__bounceIn">
                    <ButtonGroup
                      extensions={extensions}
                      setOption={exportar}
                    >
                      {/* Contenido del grupo de botones */}
                    </ButtonGroup>
                    <SubmitCustom Buttons={['Cancelar']}  
                      onClick={() => cancelar()}
                      bgColor="error.main"
                      hoverBgColor="primary.extra"
                      icon={<CancelIcon />}
                    />
                  </div>
                  :
                  <SubmitCustom Buttons={['Exportar']}  
                    onClick={() => validarExportacion()}
                    icon={<SaveAltIcon />}
                  />
                }
            </Grid>
                
          </Grid>
          <Grid item xs={12} md={6} xl>
            <Calendar 
              anio={2024} 
              isDisabled={isDisabled}
              diasActivos={diasActivos}
            />
          </Grid>
        </Grid>
      </Grid>
    )

    return(
      <div style={{display: isSpinActive ? 'flex' : 'none', position:'absolute'}}>
            <SpinModal></SpinModal>
      </div>
    )
    
}

