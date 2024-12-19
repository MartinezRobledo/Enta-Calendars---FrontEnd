import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../auth';
import { CrearPage, MonitorPage, EditarPage } from '../pages';
import { useAuthStore, useUiStore, useBD } from '../hooks';
import { useEffect, useState } from 'react'; // Asegurándote de importar useState y useEffect
import { Box } from '@mui/material';
import { SpinModal } from '../components/spinner/spinModal';

const AppInitializer = ({ onInitialized }) => {
  const {
      startLoadingHolidays,
      startLoadingTemplates,
  } = useBD();
  const { activateSpin, desactivateSpine } = useUiStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
      const cargarDatos = async () => {
          activateSpin();
          try {
              await Promise.all([
                  startLoadingHolidays(),
                  startLoadingTemplates(),
              ]);
          } catch (error) {
              console.error("Error al cargar los datos:", error);
          } finally {
              desactivateSpine(); // Ocultar spinner cuando los datos estén cargados
              setIsInitialized(true); // Marcar como inicializado
              onInitialized(); // Informar al padre que está listo
          }
      };
      cargarDatos();
  }, [activateSpin, desactivateSpine, startLoadingHolidays, startLoadingTemplates, onInitialized]);

  if (!isInitialized) {
      // Mostrar un spinner mientras se inicializan los datos
      return (
          <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
              <SpinModal />
          </Box>
      );
  }

  return null; // Solo realiza inicialización
};

export const AppRouter = () => {
  const { status, checkToken } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'checking') {
    return (
      <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <SpinModal />
      </Box>
    );
  }

  // Espera a que la app esté lista
  if (!appReady && status === 'authenticated') {
    return <AppInitializer onInitialized={() => setAppReady(true)} />;
  }

  // Renderiza las rutas dependiendo del estado de autenticación
  return (
    <Routes>
      {status === 'no-authenticated' ? (
        <>
          <Route path="/auth/*" element={<LoginPage />} />
          <Route path="/*" element={<Navigate to="/auth/login" />} />
        </>
      ) : (
        <>
          <Route path="/crear" element={<CrearPage />} />
          <Route path="/monitor" element={<MonitorPage />} />
          <Route path="/editar" element={<EditarPage />} />
          <Route path="/*" element={<Navigate to="/crear" />} />
        </>
      )}
    </Routes>
  );
};
