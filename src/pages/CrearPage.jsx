import { Grid, Input } from "@mui/material"
import { Navbar, CapasForm } from "../components"
import { useAuthStore, useConfigStore, useBD, useUiStore } from "../hooks"
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
import 'sweetalert2/dist/sweetalert2.min.css';

const extensions = ['.bprelease', '.csv'];

export const CrearPage = () => {
 
  const { titleStore, 
          diasActivosStore, 
          aditionalDaysToAdd, 
          aditionalDaysToRemove, 
          capasStore, 
          capaActualStore,
          changeTitle, 
          changeDiasActivos, 
          changeCapas, 
          changeCapaActual,
          changeAditionalDaysToAdd,
          changeAditionalDaysToRemove
        } = useConfigStore();

  const { user } = useAuthStore();
  const { templates, añoFiscal, saveConfig, getCalendars } = useBD();
  const {isSpinActive} = useUiStore();
  const [isDisabled, setIsDisabled] = useState(false); // Nuevo estado para deshabilitar formulario
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
    capasRef.current = capas;
  }, [diasActivos, capas]);

  useEffect(() => {
    capaActualRef.current = capaActual;
  }, [capaActual]);

  useEffect(() => {
    if(capasStore && capasStore.length === 0)
      setCapas([{
        id: 1,
        title: 'Capa 1',
        data: {
            initCalendar: new Date(añoFiscal, 0, 1),
            finishCalendar: new Date(añoFiscal, 11, 31),
            byWeekday: {},
            byMonthday: [],
            byMonthdayStr: '',
            allDays: false,
            withHolidays: true,
        },
        dependienteDe: null,
        esPadre: [],
        dias: [],
    }]);

    changeCapas();
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

  const exportar = async(ext) => {

    actualizarStore();

    const diasFinales = [...new Set([...diasActivos, ...aditionalDaysToAdd])]
    .filter(
        day => !aditionalDaysToRemove.some(removedDay => 
            new Date(day).getTime() === new Date(removedDay).getTime()
        )
    );

    const inicio = new Date(Math.min(...capas.map(capa => {
      return capa.data.initCalendar;
    })));

    const fin = new Date(Math.max(...capas.map(capa => {
      return capa.data.finishCalendar;
    })));

    //Generar Hash para ID con días finales
    const idBD = await generarHashCalendario(diasFinales, user.name);
    const calendario = {
      _id: idBD,
      cliente: user.name,
      titleStore: titleRef.current,
      capasStore: capas,
      capaActualStore: capaActualStore,
      aditionalDaysToAdd: aditionalDaysToAdd,
      aditionalDaysToRemove: aditionalDaysToRemove,
      diasActivosStore: diasActivosStore,
      fechaActualizacion: new Date(),
    }

    //Guardar las Capas del Store en la base de datos
    const error = await saveConfig(calendario);
    if(error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar el calendario',
        text: error.response.data.msg,
        confirmButtonText: 'Entendido',
        buttonsStyling: true, // Permite personalizar el estilo del botón
        confirmButtonColor: '#ff8a00'
      });
      return;
    }

    if(ext == '.bprelease')
      ExportBprelease(createCalendarbp(templates, diasFinales, title, user.name, inicio, fin, añoFiscal), title);
    else
      ExportCsv(createCalendarAutomation(diasFinales), title);

      getCalendars(user.name);   //Traigo nuevamente los datos de la base de datos.
      cancelar();
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
                  <SubmitCustom Buttons={['Exportar']}  
                    onClick={() => validarExportacion()}
                    icon={<SaveAltIcon />}
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

