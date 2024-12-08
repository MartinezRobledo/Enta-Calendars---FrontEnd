
export const ExportBprelease = (jsonData, fileName) => {
  
  // Convertir el objeto JSON en una cadena de texto
  const jsonString = 
    `${jsonData.header}\n` +
    `${jsonData.name}\n` +
    `${jsonData.notes}\n` +
    `${jsonData.created}\n` +
    `${jsonData.id}\n` +
    `${jsonData.package_name}\n`+
    `${jsonData.created_by}\n` +
    `${jsonData.contents}\n` +
    `${jsonData.calendar}\n` +
    `${jsonData.schedule_calendar}\n` +
    `${jsonData.other_holidays}\n` +
    `${jsonData.close_tickets}\n`;

  // Crear un Blob a partir de la cadena JSON
  const blob = new Blob([jsonString], { type: '' });
  
  // Crear un enlace temporal para la descarga
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.bprelease`; // El nombre del archivo que se descargará
  
  // Añadir el enlace al DOM y simular el clic
  document.body.appendChild(link);
  link.click();
  
  // Eliminar el enlace después de la descarga
  document.body.removeChild(link);
  
}

export const ExportCsv = (dates, filename) => {
  // Crea una cadena con los elementos del array, uno por fila
  const csvContent = dates.map(item => item.toString()).join('\n');
    
  // Crea un blob con el contenido CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Crea un enlace temporal para la descarga
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  
  // Simula el clic para iniciar la descarga
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}