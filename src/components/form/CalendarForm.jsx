import { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, Grid, Input, ButtonGroup, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAuthStore, useBD } from '../../hooks';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import 'sweetalert2/dist/sweetalert2.min.css';
import Calendar from '../calendar/Calendar';
import { CapasForm } from './CapasForm';
import { ActionButtons } from './components/ActionButtons';
import { crear, guardar, exportBpRelease, exportCsv } from './functions/calendarsFunctions';

export const CalendarForm = ({
  titleStore, 
  añosStore,
  indexAñoStore,
  changeTitle,
  changeAñosStore,
  changeIndexAño,
  accionesActivas,
  disabled,
  _id
}) => {

const extensions = ['.bprelease', '.csv'];

const { holidays, getCalendars, saveConfig, updateConfig } = useBD();
const { user } = useAuthStore();

const [indexaño, setIndexAño] = useState(indexAñoStore);
const [title, setTitle] = useState(titleStore);
const [capaActual, setCapaActual] = useState(añosStore[indexaño].capaActualStore);
const [capas, setCapas] = useState(añosStore[indexaño].capasStore);
const [isDisabled, setIsDisabled] = useState(disabled); // Nuevo estado para deshabilitar formulario
const [diasActivos, setDiasActivos] = useState(añosStore[indexaño].diasActivosStore);
const [añosActivos, setAñosActivos] = useState(añosStore);

const titleRef = useRef(""); // Usamos useRef para rastrear el valor actual de `title`
const indexAñoRef = useRef(indexaño);
const añosRef = useRef(añosActivos);

const [showButtons, setShowButtons] = useState(false);

const actions = [
  {
    key: 'Crear',
    icon: <EditCalendarIcon />,
    handler: async() => {
      const validado = validarFormulario();
      if(!validado) return;

      const response = await crear(title, añosActivos, user.name, saveConfig);
      if(!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo crear el calendario',
          text: response.msg.response.data.msg,
          confirmButtonText: 'Entendido',
          buttonsStyling: true, // Permite personalizar el estilo del botón
          confirmButtonColor: '#ff8a00'
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Se creó exitosamente el calendario',
        text: 'Guardado como: '+title,
        confirmButtonText: 'Entendido',
        buttonsStyling: true, // Permite personalizar el estilo del botón
        confirmButtonColor: '#ff8a00'
      });
      getCalendars(user.name);   //Traigo nuevamente los datos de la base de datos. 
    }
  },
  {
    key: 'Guardar',
    icon: <SaveAsIcon />,
    handler: async() => {
      const validado = validarFormulario();
      if(!validado) return;

      const response = await guardar(_id, title, añosActivos, user.name, updateConfig);
      if(!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo guardar el calendario',
          text: response.msg.response.data.msg,
          confirmButtonText: 'Entendido',
          buttonsStyling: true, // Permite personalizar el estilo del botón
          confirmButtonColor: '#ff8a00'
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: response.msg,
        text: 'Guardado como: '+title,
        confirmButtonText: 'Entendido',
        buttonsStyling: true, // Permite personalizar el estilo del botón
        confirmButtonColor: '#ff8a00'
      });
      getCalendars(user.name);   //Traigo nuevamente los datos de la base de datos. 
    }
  },
  {
    key: 'Exportar',
    icon: <SaveAltIcon />,
    handler: () => {
      const validado = validarFormulario();
      if(!validado) return;

      setIsDisabled(true);
      setShowButtons(true);
    }
  },
].filter(action => accionesActivas.includes(action.key));

useEffect(() => {
  // Función de limpieza que se ejecuta al desmontar
  return () => {
    actualizarStore();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

const actualizarStore = () => {
  titleRef.current ? changeTitle(titleRef.current) : null; 
  indexAñoRef.current >= 0 ? changeIndexAño(indexAñoRef.current) : null;
  añosRef.current ? changeAñosStore(añosRef.current) : null;
};

const handleYearChange = (direction) => {
    setIndexAño((prevIndexAño) => {
        const newIndexAño = prevIndexAño + direction;

        // Actualiza la referencia con el nuevo valor
        indexAñoRef.current = newIndexAño;

        // Actualiza el formulario con los datos del nuevo año
        const newAño = añosActivos[newIndexAño];
        setCapas(newAño.capasStore);
        setCapaActual(newAño.capaActualStore);
        setDiasActivos(newAño.diasActivosStore);

        return newIndexAño;
    });
};

const handleBlur = () => {
    titleRef.current = title;
};

const handleDiasAdicionales = (dia) => {
  setAñosActivos((prev) => {
    let newAños = [...prev]; // Copia superficial del array

    const aditionalDays = newAños[indexaño].aditionalDaysToAdd;
    const dayExists = aditionalDays.some(existingDay => 
      new Date(existingDay).getTime() === new Date(dia).getTime()
    );

    newAños[indexaño] = { // Crea un nuevo objeto basado en el existente
      ...newAños[indexaño],
      aditionalDaysToAdd: dayExists
        ? aditionalDays.filter(existingDay => 
            new Date(existingDay).getTime() !== new Date(dia).getTime()
          ) // Si existe, lo elimina
        : [...aditionalDays, dia], // Si no existe, lo agrega
      aditionalDaysToRemove: newAños[indexaño].aditionalDaysToRemove.filter(removedDay =>
        new Date(removedDay).getTime() !== new Date(dia).getTime()
      ), // Siempre lo elimina
    };

    return newAños; // Retorna el nuevo array con los cambios
  });
};

const handleDiasExcluidos = (dia) => {
  setAñosActivos((prev) => {
    let newAños = [...prev]; // Copia superficial del array

    const removalDays = newAños[indexaño].aditionalDaysToRemove;
    const dayExists = removalDays.some(existingDay => 
      new Date(existingDay).getTime() === new Date(dia).getTime()
    );

    newAños[indexaño] = { // Crea un nuevo objeto basado en el existente
      ...newAños[indexaño],
      aditionalDaysToRemove: dayExists
        ? removalDays.filter(existingDay => 
            new Date(existingDay).getTime() !== new Date(dia).getTime()
          ) // Si existe, lo elimina
        : [...removalDays, dia], // Si no existe, lo agrega
      aditionalDaysToAdd: newAños[indexaño].aditionalDaysToAdd.filter(aditionalDay =>
        new Date(aditionalDay).getTime() !== new Date(dia).getTime()
      ), // Siempre lo elimina
    };

    return newAños; // Retorna el nuevo array con los cambios
  });
};

const validarFormulario = () => {
  if(!title) {
    Swal.fire({
      icon: 'error',
      title: 'No definió ningún nombre',
      text: 'No se puede crear un calendario sin nombre',
      confirmButtonText: 'Entendido',
      buttonsStyling: true, // Permite personalizar el estilo del botón
      confirmButtonColor: '#ff8a00'
    });
    return false;
  }

  if(diasActivos.length === 0 && añosActivos[indexaño].aditionalDaysToAdd.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'No definió ningún día',
      text: 'No se puede crear un calendario sin días',
      confirmButtonText: 'Entendido',
      buttonsStyling: true, // Permite personalizar el estilo del botón
      confirmButtonColor: '#ff8a00'
    });
    return false;
  }
  return true;
}

const exportHandler = (ext) => {
  actualizarStore();
  if(ext == '.bprelease') {
    exportBpRelease(title, añosActivos, user.name);
  }
  else
      exportCsv();
  
  setIsDisabled(false);
  setShowButtons(false);
}

useEffect(() => {
    setAñosActivos((prev) => {
        let newAños = [...prev]; // Copia superficial del array
        newAños[indexaño] = { // Crea un nuevo objeto basado en el existente
            ...newAños[indexaño],
            capasStore: capas,
            capaActualStore: capaActual,
            diasActivosStore: diasActivos
        };
        return newAños; // Retorna el nuevo array con los cambios
    });
}, [capas, capaActual, diasActivos])

useEffect(() => {
    añosRef.current = añosActivos;
}, [añosActivos])

  return (
    <Grid container direction="column">
      <Grid container item sx={{ flex: 1, padding:2}}>
        <Grid item xs={12} md={6} sm={12} xl={4}>

        {/*Navegador de años*/}
        <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            mb={2} 
            sx={{ border: '1px solid', borderColor: 'secondary.extra', borderRadius: 5, p: 1 }}
        >
            <Box>
            { indexaño === 1 
                ? ( 
                    <IconButton onClick={() => handleYearChange(-1)} disabled={isDisabled}>
                    <ArrowBackIosIcon/>
                    </IconButton>
                )
                : ( 
                    <IconButton style={{ visibility: "hidden" }}>
                    <ArrowBackIosIcon />
                    </IconButton>
                )
            }
            </Box>
            <Typography variant="h6" mx={2}>
            {holidays[indexaño].año}
            </Typography>
            <Box>
            { indexaño === 0
                ? ( <IconButton onClick={() => handleYearChange(1)} disabled={isDisabled}>
                    <ArrowForwardIosIcon color={'primary.extra'}/>
                    </IconButton>
                )
                : ( <IconButton style={{ visibility: "hidden" }}>
                    <ArrowForwardIosIcon />
                    </IconButton>
                )
            }
            </Box>
        </Box>

        {/*Titulo del calendario*/}
        <Input disabled={isDisabled}
            placeholder="Ingrese nombre del calendario"
            value={title}
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur} // Actualiza la referencia cuando el input pierde el foco
            sx={{
                maxWidth: '500px',
                width: '100%',
                height: '50px',
                fontSize: '1.5rem',
                padding: '10px',
                mb: 1,
            }}
        />

        {/*Formulario*/}
        <CapasForm 
            key={indexaño}
            isDisabled={isDisabled}
            año={añosActivos[indexaño].año}
            holidays={holidays[indexaño].holidays}
            capasInicial={añosActivos[indexaño].capasStore}
            capaActualInicial={añosActivos[indexaño].capaActualStore}
            actualizarConfig={(capasx, capaActualx, diasActivosx) => {
                setCapas(capasx);
                setCapaActual(capaActualx);
                setDiasActivos(diasActivosx);
            }}
        />

        {/*Botones de exportación*/}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginTop:'2rem'}}>
            { 
              showButtons
              ? 
              <div className="animate__animated animate__bounceIn"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: 'fit-content', margin: '0 auto' }}
              >
                  {/* Botones con extensiones */}
                  <ButtonGroup>
                    {extensions.map((ext, index) => (
                      <Button
                        key={`extension-${index}`}
                        variant="contained"
                        onClick={() => exportHandler(ext)}
                        sx={{color: 'default.main'}}
                      >
                        {ext.toUpperCase()}
                      </Button>
                    ))}
                  </ButtonGroup>
                  {/* Contenido del grupo de botones */}
                  <ActionButtons Buttons={[{
                      key:'Cancelar', 
                      icon: <CancelIcon />, 
                      handler: () => {
                        setIsDisabled(false);
                        setShowButtons(false)
                      }
                    }]}
                    bgColor="error.main"
                    hoverBgColor="primary.extra"
                    icon={<CancelIcon />}
                  />
              </div>
              :
              <ButtonGroup>
                <ActionButtons Buttons={actions} isDisabled={isDisabled}/>
              </ButtonGroup>
            }
        </Grid>

        </Grid>
      <Grid item xs={12} md={6} xl>
        <Calendar
            anio={holidays[indexaño].año}
            isDisabled={isDisabled}
            diasActivos={diasActivos}
            aditionalDaysToAdd={añosActivos[indexaño].aditionalDaysToAdd}
            aditionalDaysToRemove={añosActivos[indexaño].aditionalDaysToRemove}
            changeAditionalDaysToAdd={(dia) => handleDiasAdicionales(dia)}
            changeAditionalDaysToRemove={(dia) => handleDiasExcluidos(dia)}
        />
      </Grid>
    </Grid>
  </Grid>
  );
};