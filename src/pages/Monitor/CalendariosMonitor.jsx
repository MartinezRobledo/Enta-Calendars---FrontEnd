import { CircularProgress, Grid, TextField, Toolbar, Checkbox, ButtonGroup, Button } from '@mui/material';
import { useState } from 'react';
import { SimplePaper } from '../../components';
import { useAuthStore, useBD, useCalendarStore, useConfigEditStore } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.min.css';

const CalendariosMonitor = () => {
    const { calendars, status, error, deleteCalendar } = useCalendarStore();
    const { templates, añoFiscal, deleteCalendarFetch, getCalendars } = useBD();
    const { user } = useAuthStore();
    const { changeOnInitializeCapaEdit } = useConfigEditStore();
    const [search, setSearch] = useState(""); // Estado para el input de búsqueda
    const [selectedCalendars, setSelectedCalendars] = useState([]); // Calendarios seleccionados
    const [selectAll, setSelectAll] = useState(false);
    const [extension, setExtension] = useState('.bprelease'); // Extensión por defecto
    // const [selectedIds, setSelectedIds] = useState([])
    const navigate = useNavigate();

    const verCalendar = (calendar) => {
      changeOnInitializeCapaEdit(calendar);
      navigate('/editar');
  }

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedCalendars(calendars.map(calendar => calendar._id)); // Seleccionar todos
            setSelectAll(true);
        } else {
            setSelectedCalendars([]); // Deseleccionar todos
            setSelectAll(false);
        }
    };

    const handleExtensionChange = (ext) => {
        setExtension(ext);
    };

    const handleDownloadSelected = () => {
        selectedCalendars.forEach(calendarId => {
            const calendar = calendars.find(c => c._id === calendarId);
            if (calendar) descargarCalendar(calendar, extension);
        });
    };

    const descargarCalendar = (calendar, ext) => {
      // Lógica para descargar un calendario con la extensión seleccionada
      const diasFinales = [...new Set([...calendar.diasActivosStore, ...calendar.aditionalDaysToAdd])]
        .filter(day => !calendar.aditionalDaysToRemove.includes(day));

    const inicio = new Date(
        Math.min(
            ...calendar.capasStore.map(capa => {
            const timestamp = Date.parse(capa.data.initCalendar);
            return isNaN(timestamp) ? Infinity : timestamp; // Asegura valores válidos
            })
        )
        ).toISOString(); // Formato ISO 8601
            
    const fin = new Date(
    Math.max(
        ...calendar.capasStore.map(capa => {
        const timestamp = Date.parse(capa.data.finishCalendar);
        return isNaN(timestamp) ? -Infinity : timestamp; // Asegura valores válidos
        })
    )
    ).toISOString(); // Formato ISO 8601
      
      if(ext == '.bprelease')
        ExportBprelease(createCalendarbp(templates, diasFinales, calendar.titleStore, user.name, inicio, fin, añoFiscal), calendar.titleStore);
      else
        ExportCsv(createCalendarAutomation(diasFinales), calendar.titleStore);
    };

    const eliminarCalendar = (calendar) => {
        // Mostrar SweetAlert con los botones y personalización
        Swal.fire({
          icon: 'warning', // Ícono de advertencia (puedes cambiarlo a 'error' si prefieres)
          title: '¿Seguro desea eliminar el calendario?',
          text: `¿Está seguro de que desea eliminar el calendario: ${calendar.titleStore}?`, // Personaliza el texto
          showCancelButton: true, // Muestra el botón de cancelar
          confirmButtonText: 'Eliminar', // Texto del botón de confirmación
          cancelButtonText: 'Cancelar', // Texto del botón de cancelación
          confirmButtonColor: '#ff8a00', // Color del botón de confirmación
          cancelButtonColor: '#d33', // Color del botón de cancelación
          buttonsStyling: true, // Permite personalizar el estilo de los botones
          reverseButtons: true,
        }).then((result) => {
          // Si el usuario confirma la acción (clic en "Eliminar")
          if (result.isConfirmed) {
            // Llamamos a la función para eliminar el calendario
            // deleteCalendar(calendar._id);
            const { data, error } = deleteCalendarFetch(calendar._id);
      
            if (error) {
              console.error(error);
            } else {
              Swal.fire(
                'Eliminado', // Título de la ventana emergente de éxito
                'El calendario ha sido eliminado correctamente.', // Mensaje
                'success' // Ícono de éxito
              );
            }

            deleteCalendar(calendar._id);
          }
        });
      };

    const filteredCalendars = calendars.filter((calendar) =>
        calendar.titleStore.toLowerCase().includes(search.toLowerCase())
    );

    if (status === 'loading') {
        return (
            <Grid container justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                <CircularProgress />
            </Grid>
        );
    }

    if (status === 'failed') {
        return <div>Error al cargar los calendarios: {error}</div>;
    }

    return (
        <Grid container sx={{display:'flex', justifyContent:'center'}}>
            <Grid item sx={{width: '100%', marginBottom:'2px' }}>
                <TextField
                    label="Buscar calendario..."
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={handleSearchChange}
                />
            </Grid>

            {/* Barra de herramientas */}
            <Grid item sx={{ width: '100%', backgroundColor:'lightgrey' }}>
                <Toolbar>
                    {/* Checkbox para seleccionar todos */}
                    <Checkbox
                        checked={selectedCalendars.length === calendars.length && calendars.length > 0}
                        onChange={handleSelectAll}
                        inputProps={{ 'aria-label': 'Seleccionar todos los calendarios' }}
                    />
                    Seleccionar todos

                    {/* Grupo de botones para extensión */}
                    <ButtonGroup variant="contained" sx={{ ml: 2 }}>
                        <Button
                            onClick={() => handleExtensionChange('.bprelease')}
                            color={extension === '.bprelease' ? 'primary' : 'default'}
                        >
                            .bprelease
                        </Button>
                        <Button
                            onClick={() => handleExtensionChange('.csv')}
                            color={extension === '.csv' ? 'primary' : 'default'}
                        >
                            .csv
                        </Button>
                    </ButtonGroup>

                    {/* Botón para descargar seleccionados */}
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ ml: 2 }}
                        onClick={handleDownloadSelected}
                        disabled={selectedCalendars.length === 0}
                    >
                        Descargar seleccionados
                    </Button>
                </Toolbar>
            </Grid>
            <Grid item sx={{ width: '100%' }}>
                <SimplePaper
                    papers={filteredCalendars}
                    handleClick={(calendar) => verCalendar(calendar)}
                    handleDelete={(calendar) => eliminarCalendar(calendar)}
                    handleDownload={(calendar) => descargarCalendar(calendar, extension)}
                    selectedIds={selectedCalendars}
                    setSelectedIds={setSelectedCalendars}
                    selectAll={selectAll}
                    setSelectAll={(check) => setSelectAll(check)}
                />
            </Grid>
        </Grid>
    );
};

export default CalendariosMonitor;
