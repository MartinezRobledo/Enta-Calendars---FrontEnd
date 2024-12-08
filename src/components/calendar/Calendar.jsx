import { useEffect, useState } from 'react';
import './Calendar.css';
import { useConfigStore } from '../../hooks';
import { isSameDay } from 'date-fns';

const nombresMeses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const nombresDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// Devuelve el día de la semana ajustado para que 0 sea lunes
const obtenerDiaInicio = (anio, mes) => {
  return (new Date(anio, mes, 1).getDay() + 6) % 7 + 1; // Ajuste para lunes como inicio.
};

const obtenerDiasDelMes = (anio, mes) => {
  return new Date(anio, mes + 1, 0).getDate(); // Último día del mes.
};

function Calendar({ anio, isDisabled, diasActivos }) {
  const {
    aditionalDaysToAdd,
    aditionalDaysToRemove,
    changeAditionalDaysToAdd,
    changeAditionalDaysToRemove,
  } = useConfigStore();

  const manejarClickDia = (dia, boton, e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del clic con la rueda

    if (boton === 0) {
      // Clic izquierdo
      changeAditionalDaysToAdd(dia);
    } else if (boton === 1) {
      // Clic con rueda
      changeAditionalDaysToRemove(dia);
    }
  };

  return (
    <div className={`calendario-anual ${isDisabled ? 'disabled' : ''}`}>
      {nombresMeses.map((mes, index) => {
        const diasEnMes = obtenerDiasDelMes(anio, index);
        const diaInicio = obtenerDiaInicio(anio, index);

        return (
          <div className="mes" key={mes}>
            <div className="titulo-mes">
              <div>{mes}</div>
              {nombresDias.map((dia) => (
                <div className="encabezado-dia" key={dia}>
                  {dia}
                </div>
              ))}
            </div>
            <div className="dias">
              {Array.from({ length: diasEnMes }, (_, i) => {
                const fechaDia = new Date(anio, index, i + 1);
                const isActive = diasActivos.some((d) =>
                  isSameDay(d, fechaDia)
                );
                const isAdded = aditionalDaysToAdd.some((d) =>
                  isSameDay(d, fechaDia)
                );
                const isExcluded = aditionalDaysToRemove.some((d) =>
                  isSameDay(d, fechaDia)
                );

                return (
                  <div
                    className={`dia 
                      ${isActive ? 'active' : ''} 
                      ${isAdded ? 'add-day' : ''} 
                      ${isExcluded ? 'exclude-day' : ''}`}
                    key={fechaDia.toISOString()}
                    style={i === 0 ? { gridColumn: diaInicio } : {}}
                    onMouseDown={(e) => manejarClickDia(fechaDia, e.button, e)}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Calendar;