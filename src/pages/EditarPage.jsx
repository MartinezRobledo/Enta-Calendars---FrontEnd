import { Grid, Input } from "@mui/material"
import { Navbar, CapasForm } from "../components"
import { useAuthStore, useConfigEditStore, useBD, useUiStore } from "../hooks"
import { SpinModal } from "../components/spinner/spinModal";
import Calendar from "../components/calendar/Calendar";
import { useEffect, useRef, useState } from "react";
import { SubmitCustom } from "../components/form/components/SubmitCustom";
import ButtonGroup from "../components/button/ButtonGroup";
import CancelIcon from '@mui/icons-material/Cancel';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { ExportBprelease, ExportCsv } from "./functions/documentCreator";
import { createCalendarAutomation, createCalendarbp, generarHashCalendario } from "./functions/calendarCreator";
import Swal from 'sweetalert2/dist/sweetalert2.js';
// import { styled } from '@mui/system';
import 'sweetalert2/dist/sweetalert2.min.css';

const extensions = ['.bprelease', '.csv'];

export const EditarPage = () => {
 
  const { titleStore, 
          diasActivosStore, 
          aditionalDaysToAdd, 
          aditionalDaysToRemove, 
          capasStore, 
          capaActualStore, 
          _id, 
          isDisabled,
          changeTitle, 
          changeDiasActivos,
          changeCapas,
          changeCapaActual,
          changeAditionalDaysToAdd,
          changeAditionalDaysToRemove
  } = useConfigEditStore();

  const { user } = useAuthStore();
  const { templates, añoFiscal, saveConfig, getCalendars, deleteCalendarFetch } = useBD();
  const {isSpinActive} = useUiStore();
  const [showButtons, setShowButtons] = useState(false);
  const [diasActivos, setDiasActivos] = useState(diasActivosStore);
  const [title, setTitle] = useState(titleStore);
  const [capaActual, setCapaActual] = useState(capaActualStore);
  const [capas, setCapas] = useState(capasStore);
  const titleRef = useRef(""); // Usamos useRef para rastrear el valor actual de `title`
  const diasRef = useRef([]); // Usamos useRef para rastrear el valor actual de `title`
  const capasRef = useRef(capas);
  const capaActualRef = useRef(capaActual);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actualizarStore = () => {
    titleRef.current ? changeTitle(titleRef.current) : null; // Llama a changeTitle con el título que deseas guardar
    diasRef.current ? changeDiasActivos(diasRef.current) : [];
    capasRef.current ? changeCapas(capasRef.current) : [];
    capaActualRef.current ? changeCapaActual(capaActualRef.current) : null;
  }

  const validarExportacion = (value) => {
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
    value === 'Guardar'
    ? guardar()
    : setShowButtons(true);
  }

  const guardar = async() => {
    actualizarStore();

    const diasFinales = [...new Set([...diasActivos, ...aditionalDaysToAdd])]
    .filter(
        day => !aditionalDaysToRemove.some(removedDay => 
            new Date(day).getTime() === new Date(removedDay).getTime()
        )
    );

    //Generar Hash para ID con días finales
    const idBD = await generarHashCalendario(diasFinales, user.name);
    const calendario = {
      _id: idBD,
      cliente: user.name,
      titleStore: titleRef.current,
      capasStore: capas,
      capaActualStore: capaActual,
      aditionalDaysToAdd: aditionalDaysToAdd,
      aditionalDaysToRemove: aditionalDaysToRemove,
      diasActivosStore: diasActivos,
      fechaActualizacion: new Date(),
    }

    //Guardar las Capas del Store en la base de datos
    const error = await saveConfig(calendario);
    if(error) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar el calendario',
        text: error.response.data.msg,
        confirmButtonText: 'Entendido',
        buttonsStyling: true, // Permite personalizar el estilo del botón
        confirmButtonColor: '#ff8a00'
      })
      return;
    }
    else
    Swal.fire({
        icon: 'success',
        title: 'Se guardó el calendario',
        text: 'Se pudo guardar el calendario satisfactoriamente',
        confirmButtonText: 'Aceptar',
        buttonsStyling: true, // Permite personalizar el estilo del botón
        confirmButtonColor: '#ff8a00'
      });

    const errorDel = await deleteCalendarFetch(_id);
    if(errorDel)
      console.error("No se pudo eliminar el calendario previo", error);

    getCalendars();
  }

  const exportar = async(ext) => {
    actualizarStore();

    const diasFinales = [...new Set([...diasActivos, ...aditionalDaysToAdd])]
    .filter(
        day => !aditionalDaysToRemove.some(removedDay => 
            new Date(day).getTime() === new Date(removedDay).getTime()
        )
    );

    const inicio = new Date(Math.min(...capasStore.map(capa => {
      return capa.data.initCalendar;
    })));

    const fin = new Date(Math.max(...capasStore.map(capa => {
      return capa.data.finishCalendar;
    })));

    if(ext == '.bprelease')
      ExportBprelease(createCalendarbp(templates, diasFinales, title, user.name, inicio, fin, añoFiscal ), title );
    else
      ExportCsv(createCalendarAutomation(diasFinales), title);
    
    cancelar();
  }

  const cancelar = () => {
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
              capaActual={capaActual}
              capas={capas}
              setCapaActual={setCapaActual}
              setCapas={setCapas}
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
                  <SubmitCustom Buttons={['Guardar', 'Exportar']}  
                    onClick={(e) => validarExportacion(e.target.textContent)}
                    icon={<SaveAltIcon />}
                    isDisabled={isDisabled}
                  />
                }
            </Grid>
                
          </Grid>
          <Grid item xs={12} md={6} xl>
            <Calendar 
              anio={añoFiscal} 
              isDisabled={isDisabled}
              diasActivos={diasActivos}
              aditionalDaysToAdd={aditionalDaysToAdd}
              aditionalDaysToRemove={aditionalDaysToRemove}
              changeAditionalDaysToAdd={changeAditionalDaysToAdd}
              changeAditionalDaysToRemove={changeAditionalDaysToRemove}
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