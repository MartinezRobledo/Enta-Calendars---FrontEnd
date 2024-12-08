import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarForm } from './Form';
import { Tab, Tabs, Box, Typography, Autocomplete, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import { useConfigStore, useInitializeApp } from '../../hooks';
import { filterHolidays, normalizeByMonthday, normalizeByMonthdayDependence, recortarDiasPorConfiguracion, Rules } from './functions/Rules';

function tieneCiclo(capas, origen, destino) {
  if (!destino) return false; 
  let actual = destino;
  while (actual !== null) {
    if (actual === origen) return true;
    actual = capas.find((capa) => capa.id === actual)?.dependienteDe || null;
  }
  return false;
}

export const CapasForm = ({ isDisabled, setDiasActivos }) => {
  const {capasStore, capaActualStore, changeCapas, changeCapaActual} = useConfigStore();
  const { añoFiscal, holidays } = useInitializeApp();
  const [capaActual, setCapaActual] = useState(capaActualStore);
  const [capas, setCapas] = useState(capasStore);
  const capasRef = useRef(capas);
  const capaActualRef = useRef(capaActual);

  const agregarCapa = () => {
    const nuevaCapa = {
      id: capas.length + 1,
      title: `Capa ${capas.length + 1}`,
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
    };
    setCapas((prev) => [...prev, nuevaCapa]);
    setCapaActual(capas.length);
  };

  const eliminarCapa = (index) => {
    if (capas.length === 1) return; // No permitir eliminar si solo queda una capa

    const idEliminado = capas[index].id;

    setCapas((prevCapas) => {
        // Crear nueva referencia de capas sin la eliminada
        const nuevasCapas = prevCapas
            .filter((_, i) => i !== index)
            .map((capa, i) => ({
                ...capa,
                id: i + 1,
                title: `Capa ${i + 1}`,
                dependienteDe: capa.dependienteDe === idEliminado
                    ? null // Si dependía de la eliminada, quitar la dependencia
                    : capa.dependienteDe > idEliminado
                    ? capa.dependienteDe - 1 // Ajustar referencias si el ID era mayor
                    : capa.dependienteDe,
                esPadre: capa.esPadre
                    .filter((id) => id !== idEliminado) // Quitar referencia al eliminado
                    .map((id) => (id > idEliminado ? id - 1 : id)), // Ajustar IDs
                dias: [...capa.dias], // Aseguramos nueva referencia
            }));

        // Recalcular días para cada capa independiente o dependiente
        nuevasCapas.forEach((capa) => {
            if (capa.dependienteDe === null) {
                capa.dias = Rules(
                    capa.data.initCalendar,
                    capa.data.finishCalendar,
                    capa.data.byMonthday,
                    capa.data.byWeekday
                );

                if (!capa.data.withHolidays) {
                    capa.dias = filterHolidays(capa.dias, holidays);
                }
            } else {
                const diasPadre = nuevasCapas[capa.dependienteDe - 1]?.dias || [];
                capa.dias = recortarDiasPorConfiguracion(diasPadre, capa);
            }
        });

        // Asegurarse de que las referencias a los dependientes se mantengan actualizadas
        nuevasCapas.forEach((capa) => {
            capa.esPadre.forEach((idHijo) => {
                const hijo = nuevasCapas[idHijo - 1];
                hijo.dias = recortarDiasPorConfiguracion(capa.dias, hijo);
            });
        });

        return [...nuevasCapas]; // Devolver nueva referencia
    });

    // Ajustar la capa actual si el índice eliminado afecta a la seleccionada
    setCapaActual((prev) => Math.max(0, prev >= index ? prev - 1 : prev));
};

const actualizarCapaYDependientes = (indiceCapa, nuevasCapas) => {
  const capaActual = nuevasCapas[indiceCapa];

  // Recalcula los días de la capa actual
  capaActual.dias = capaActual.dependienteDe
      ? recortarDiasPorConfiguracion(nuevasCapas[capaActual.dependienteDe - 1].dias, capaActual)
      : Rules(
          capaActual.data.initCalendar,
          capaActual.data.finishCalendar,
          capaActual.data.byMonthday,
          capaActual.data.byWeekday
      );

  if (!capaActual.data.withHolidays) {
      capaActual.dias = filterHolidays(capaActual.dias, holidays);
  }

  // Si la capa tiene hijos, actualízalos recursivamente
  if (capaActual.esPadre.length > 0) {
      capaActual.esPadre.forEach((idHijo) => {
          actualizarCapaYDependientes(idHijo - 1, nuevasCapas);
      });
  }
};

const actualizarDatosCapa = (datosActualizados) => {
  setCapas((prev) => {
      // Copiar las capas para no modificar directamente el estado
      let nuevasCapas = [...prev];  // Crear una nueva copia

      // Actualizo data
      nuevasCapas[capaActual] = {
        ...nuevasCapas[capaActual],
        data: {
            ...nuevasCapas[capaActual].data,
            ...datosActualizados,
        }
    };

      // Normalizo texto de entrada para bymonthdays
      if (datosActualizados.byMonthdayStr || datosActualizados.byMonthdayStr === '') {
          nuevasCapas[capaActual].data.byMonthday =
              nuevasCapas[capaActual].dependienteDe === null
                  ? normalizeByMonthday(datosActualizados.byMonthdayStr)
                  : normalizeByMonthdayDependence(
                      nuevasCapas[capaActual].data.byMonthdayStr,
                      nuevasCapas[nuevasCapas[capaActual].dependienteDe - 1].data.byMonthday
                  );
      }

      

      // Actualiza la capa actual y todos sus dependientes
      actualizarCapaYDependientes(capaActual, nuevasCapas);

      // Retornar la nueva copia de capas
      return nuevasCapas;
  });
};

  const manejarCambioDependencia = (nuevaDependencia) => {
    if (nuevaDependencia === null) {
        eliminarDependencia();
    } else {
        if (tieneCiclo(capas, capaActual + 1, nuevaDependencia)) {
            Swal.fire({
                icon: 'error',
                title: 'Dependencia no válida',
                text: 'No se puede establecer esta dependencia porque crea un bucle.',
                confirmButtonText: 'Entendido',
                buttonsStyling: true,
                confirmButtonColor: '#ff8a00',
            });
            return;
        }
        agregarDependencia(nuevaDependencia);
    }
};

const eliminarDependencia = () => {
    setCapas((prevCapas) => {
        const nuevasCapas = [...prevCapas];

        const capaActualObj = nuevasCapas[capaActual];

        if (capaActualObj.dependienteDe !== null) {
            // Elimina capaActual de los hijos del padre previo
            nuevasCapas[capaActualObj.dependienteDe - 1] = {
              ...nuevasCapas[capaActualObj.dependienteDe - 1],
              esPadre: nuevasCapas[capaActualObj.dependienteDe - 1].esPadre.filter(
                (hijo) => hijo !== capaActual + 1
              )
            };

        }

        // Elimina la dependencia de la capa actual y recalcula sus días
        capaActualObj.dependienteDe = null;
        capaActualObj.dias = Rules(
          capaActualObj.data.initCalendar,
          capaActualObj.data.finishCalendar,
          capaActualObj.data.byMonthday,
          capaActualObj.data.byWeekday,
        );

        // Recalcular los días de los hijos si tiene dependientes

        if (capaActualObj.esPadre.length > 0) {
            capaActualObj.esPadre.forEach((idHijo) => {
                actualizarCapaYDependientes(idHijo - 1, nuevasCapas);
            });
        }

        return nuevasCapas;
    });
};

const agregarDependencia = (dependienteDe) => {
    setCapas((prevCapas) => {
        const nuevasCapas = [...prevCapas];

        const capaPadre = nuevasCapas[dependienteDe - 1];
        const capaHija = nuevasCapas[capaActual];

        // Si ya existe la misma dependencia, no hacer nada
        if (capaHija.dependienteDe === dependienteDe) return nuevasCapas;

        // Agregar capaActual como hijo en esPadre del nuevo padre
        nuevasCapas[dependienteDe - 1] = {
          ...capaPadre,
          esPadre: [...new Set([...capaPadre.esPadre, capaActual + 1])],
      };      

        // Actualizar la dependencia en la capa actual
        capaHija.dependienteDe = dependienteDe;

        // Recalcular los días basados en la nueva dependencia
        capaHija.dias = recortarDiasPorConfiguracion(capaPadre.dias, capaHija);

        // Actualizar los días de todos los hijos recursivamente
        if (capaHija.esPadre.length > 0) {
            capaHija.esPadre.forEach((idHijo) => {
                actualizarCapaYDependientes(idHijo - 1, nuevasCapas);
            });
        }

        return nuevasCapas;
    });
};

  const diasActivos = useMemo(() => {
    capasRef.current = capas;
    return capas
      .filter((capa) => capa.esPadre.length === 0)
      .map((capa) => capa.dias)
      .flat();
  }, [capas]);

  useEffect(() => {
    setDiasActivos(diasActivos);
  }, [diasActivos, setDiasActivos]);

  useEffect(() => {
    capaActualRef.current = capaActual;
  }, [capaActual]);
  
  useEffect(() => {
    // Función de limpieza que se ejecuta al desmontar
    return () => {
      changeCapas(capasRef.current);
      changeCapaActual(capaActualRef.current);
    };
  }, []);

  return (
    <Box>
      <Tabs
        value={capaActual}
        onChange={(_, newValue) => setCapaActual(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {capas.map((capa, index) => (
          <Tab
            disabled={isDisabled}
            key={capa.id}
            label={
              <Box display="flex" alignItems="center" gap={2}>
                <Typography 
                  variant="h6" // Ajusta el tamaño del texto (puedes usar h5, h6, body1, etc.)
                  component="span"
                  sx={{ fontWeight: 'bold' }} // Opcional para resaltar el título
                >
                  {capa.title}
                </Typography>
                <span 
                  onClick={(e) => {
                      e.stopPropagation(); // Evita cambiar de pestaña al eliminar
                      eliminarCapa(index);
                    }}
                >
                  <CloseIcon
                    fontSize="small"
                    sx={{
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      color: 'gray',
                      '&:hover': { color: 'red' },
                      transition: 'color 0.2s ease-in-out',
                    }}
                  />
                </span>
              </Box>
            }
          />
        ))}
        <Tab icon={
          <AddIcon 
            sx={{
              cursor: 'pointer',
              color: 'gray',
              '&:hover': { color: 'lightgreen' },
              transition: 'color 0.2s ease-in-out',
            }}
            />
          } 
          onClick={agregarCapa} 
          disabled={isDisabled}
        />
      </Tabs>
      <CalendarForm
        añoFiscal={añoFiscal}
        data={
          capas[capaActual]?.data || 
          console.error("La capa actual esta vacía o apunta a una dirección inválida.\nCapa actual: ", capaActual)} // Manejo seguro
        actualizarDatosCapa={(datosActualizados) => actualizarDatosCapa(datosActualizados)}
        isDisabled={isDisabled}
      />
      <Box mt={2}>
        <Autocomplete
          disabled={isDisabled}
          disablePortal
          options={capas
            .filter((_, idx) => idx !== capaActual) // Excluir la capa actual
            .map((capa) => ({ label: capa.title, id: capa.id }))} // Simplificar las opciones
          getOptionLabel={(option) => option.label || ''} // Definir cómo mostrar las opciones
          isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparar correctamente opciones
          value={
            capas[capaActual]?.dependienteDe !== null
              ? capas
                  .filter((_, idx) => idx !== capaActual) // Filtrar capas válidas
                  .map((capa) => ({ label: capa.title, id: capa.id }))
                  .find((option) => option.id === capas[capaActual].dependienteDe || null) // Buscar la opción actual
              : null
          } // Asegurarse de que el valor sea consistente con las opciones
          onChange={(_, newValue) =>
            manejarCambioDependencia(newValue ? parseInt(newValue.id) : null)
          } // Actualizar el estado al cambiar
          renderInput={(params) => <TextField {...params} label="Depende de:" />} // Input con etiqueta
          sx={{ width: 300 }} // Estilo del componente
        />
      </Box>
    </Box>
  );
};