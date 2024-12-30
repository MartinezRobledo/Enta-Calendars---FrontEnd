import { useEffect, useMemo, useRef, useState } from 'react';
import { Form } from './Form';
import { Tab, Tabs, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useBD } from '../../hooks';
import { encontrarDiasCoincidentes, filterHolidays, normalizeByMonthday, normalizeByMonthdayDependence, recortarDiasPorConfiguracion, Rules } from './functions/Rules';
import AutocompleteCustom from './components/AutocompleteCustom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.min.css';

function tieneCiclo(capas, origen, destino) {
  if (!destino) return false; 
  let actual = destino;
  while (actual !== null) {
    if (actual === origen) return true;
    actual = capas.find((capa) => capa.id === actual)?.dependienteDe || null;
  }
  return false;
}

export const CapasForm = ({ capaActualInicial, capasInicial, isDisabled, actualizarConfig, año, holidays }) => {

const [capas, setCapas] = useState([...capasInicial]);
const [capaActual, setCapaActual] = useState(capaActualInicial);

useEffect(() => {
  const diasActivos = capas.filter((capa) => capa.esPadre.length === 0).map((capa) => capa.dias).flat();
  actualizarConfig(capas, capaActual, diasActivos);
}, [capas]);

const agregarCapa = () => {
  const nuevaCapa = {
    id: capas.length + 1,
    title: `Capa ${capas.length + 1}`,
    data: {
      initCalendar: new Date(año, 0, 1),
      finishCalendar: new Date(año, 11, 31),
      byWeekday: {},
      byMonthday: [],
      byMonthdayStr: '',
      allDays: false,
      agrupar: false,
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
  const capaActual = { ...nuevasCapas[indiceCapa] }; // Crear una copia inmutable de la capa actual

  // Recalcular los días de la capa actual
  capaActual.dias = capaActual.dependienteDe
      ? recortarDiasPorConfiguracion(
          nuevasCapas[capaActual.dependienteDe - 1].dias,
          capaActual
      )
      : Rules(
          capaActual.data.initCalendar,
          capaActual.data.finishCalendar,
          capaActual.data.byMonthday,
          capaActual.data.byWeekday
      );

  if (!capaActual.data.withHolidays) {
      capaActual.dias = filterHolidays(capaActual.dias, holidays);
  }

  if (capaActual.data.agrupar) {
      capaActual.dias = encontrarDiasCoincidentes(
          capaActual.dias,
          Object.keys(capaActual.data.byWeekday).length,
          año
      );
  }

  // Asigna la capa modificada de vuelta al array
  nuevasCapas[indiceCapa] = capaActual;

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

  return (
    <>
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
      <Form
        data={
          capas[capaActual]?.data || 
          console.error("La capa actual esta vacía o apunta a una dirección inválida.\nCapa actual: ", capaActual)} // Manejo seguro
        actualizarDatosCapa={(datosActualizados) => actualizarDatosCapa(datosActualizados)}
        isDisabled={isDisabled}
      />
      <Box mt={2}>
        <AutocompleteCustom 
          isDisabled={isDisabled}
          options={capas}
          actualOption={capaActual}
          criterio={capas[capaActual]?.dependienteDe}
          label={'Depende de:'}
          handleChange={manejarCambioDependencia}
          width={300}
        />
      </Box>
    </>
  );
};