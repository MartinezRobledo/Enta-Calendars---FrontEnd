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
    // Asegurar que las fechas sean objetos Date
    const fechasDeEjecucionDates = fechasDeEjecucion.map(fecha => new Date(fecha));
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    // Generar todas las fechas dentro del intervalo
    const todasLasFechas = eachDayOfInterval({ start: fechaInicioDate, end: fechaFinDate });

    // Filtrar las fechas excluyendo las que están en fechasDeEjecucion
    const otherDates = todasLasFechas.filter(fecha =>
        !fechasDeEjecucionDates.some(excluir => isSameDay(fecha, excluir))
    );

    return otherDates;
}

export async function generarHashCalendario(diasFinales, cliente) {
    // Normaliza el array ordenándolo
    const diasOrdenados = [...diasFinales].sort();
    
    // Convierte a string
    const dataString = JSON.stringify(diasOrdenados) + cliente;
    const encoder = new TextEncoder();
    const data = encoder.encode(dataString);

    // Genera el hash usando SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convierte el hash a hexadecimal
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

export const createCalendarbp = ( template = {}, fechas = [], title, user, inicio, fin, año )=> {

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

    const startDate = new Date(Number(año) + 1, 0, 1);
    
    const otherDates = fechasToBp(fechas, inicio, fin);

    const daysOfNextYear = [];
    for (let i = 0; i < 366; i++) {
        const other = new Date(startDate);
        other.setDate(startDate.getDate() + i);
        daysOfNextYear.push(other); // Formato YYYY-MM-DD
    }

    // Crear la estructura de <other-holidays> con las fechas en formato <other-date>
    const otherHolidays = '<other-holidays>\n' +
    otherDates.map(fecha => `<other-date value='${new Date(fecha).toISOString().split('T')[0]}' />\n`).join('') +
    daysOfNextYear.map(fecha => `<other-date value='${new Date(fecha).toISOString().split('T')[0]}' />\n`).join('') +
    '</other-holidays>';

    // Reemplazo other holidays
    templateCharged.other_holidays = otherHolidays;

    return templateCharged;
    
}

export const createCalendarAutomation = (fechas = []) => {
    const AutomationDates = fechas.map(fecha => formatDateAutomation(fecha));
    return AutomationDates;
}