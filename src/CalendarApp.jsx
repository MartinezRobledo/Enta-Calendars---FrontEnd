import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { AppTheme } from './theme';
import { Provider } from 'react-redux';
import { store } from './store';
import { useInitializeApp, useUiStore } from './hooks';
import { useEffect } from 'react';

const AppInitializer = () => {
    const {startLoadingHolidays, startLoadingTemplates, startInitialConfig} = useInitializeApp();
    const {activateSpin, desactivateSpine} = useUiStore();

    useEffect(() => {
      const cargarDatos = async () => {
            activateSpin();
            try {
              await Promise.all([startLoadingHolidays()]);
              await Promise.all([startLoadingTemplates()]);
            } catch (error) {
              console.error("Error al cargar los datos:", error);
            } finally {
              startInitialConfig();
              desactivateSpine(); // Ocultar spinner cuando los datos estén cargados
            }
          };
          cargarDatos();
    }, [])

    return null; // Este componente solo realiza la inicialización
};

export const CalendarApp = () => (
    <Provider store={store}>
        <BrowserRouter>
            <AppTheme>
                <AppInitializer /> {/* Inicializa los datos */}
                <AppRouter /> {/* Renderiza el resto de la app */}
            </AppTheme>
        </BrowserRouter>
    </Provider>
);
