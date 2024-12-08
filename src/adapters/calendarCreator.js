import { eachDayOfInterval, isSameDay } from "date-fns";
  
function formatDateBP(date) {
    // Obtener la fecha en formato 'YYYY-MM-DD HH:mm:ss'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11, por eso sumamos 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Formato deseado: 'YYYY-MM-DD HH:mm:ss'
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`;
}

function formatDateAutomation(date) {
    // Obtener la fecha en formato 'YYYY-MM-DD HH:mm:ss'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11, por eso sumamos 1
    const day = String(date.getDate()).padStart(2, '0');

    // Formato deseado: 'YYYY-MM-DD'
    return `${year}-${month}-${day}`;
}

// Obtengo todas las fechas que no son las fechas de ejecución
function fechasToBp(fechasDeEjecucion = [], fechaInicio, fechaFin) {
    const todasLasFechas = eachDayOfInterval({ start: fechaInicio, end: fechaFin });

    // Filtrar las fechas excluyendo las que están en fechasExcluidas
    const otherDates = todasLasFechas.filter(fecha =>
    !fechasDeEjecucion.some(excluir => isSameDay(fecha, excluir))
    );

    return otherDates;
}

  export const createCalendarbp = ( template = {}, fechas = [], title, user, inicio, fin )=> {

    const replacements = {
        "NOMBRE":title,
        "ID": new Date().getMilliseconds(),
        "FECHA": formatDateBP(new Date()),
        "USUARIO":user,
        "HABILES":"127",
      }

    let templateCharged = {...template};

    for( const key in templateCharged) {
        for( const key_r in replacements) {
            if(templateCharged[key].includes(key_r)) {
                templateCharged[key] = templateCharged[key].replace(key_r, replacements[key_r]);
            }
        }
    }

    const otherDates = fechasToBp(fechas, inicio, fin);

    // Crear la estructura de <other-holidays> con las fechas en formato <other-date>
    const otherHolidays = '<other-holidays>\n' +
    otherDates.map(fecha => `<other-date value='${new Date(fecha).toISOString().split('T')[0]}' />\n`).join('') +
    '</other-holidays>';

    // Reemplazo other holidays
    templateCharged.other_holidays = otherHolidays;

    return templateCharged;
    
}

export const createCalendarAutomation = (fechas = []) => {
    const AutomationDates = fechas.map(fecha => formatDateAutomation(fecha));
    return AutomationDates;
}