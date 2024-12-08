import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../auth'
import { ActualizarPage, CrearPage } from '../pages'
import { useAuthStore, useUiStore } from '../hooks'
import { useEffect } from 'react'
import { Box } from '@mui/material'
import { SpinModal } from '../components/spinner/spinModal'

export const AppRouter = () => {

  const { status, checkToken } = useAuthStore();
  const { isSpinActive } = useUiStore();

  useEffect(()=>{
    checkToken()
  }, [])

  if( status === 'checking') {
    return (
      <Box sx={{display: true ? 'flex' : 'none'}}>
        <SpinModal></SpinModal>
      </Box>
    )
  }

  return (
    <Routes>
      {
        (status === 'no-authenticated')
        ? (
            <>
              <Route path='/auth/*' element={ <LoginPage /> }/>
              <Route path='/*' element={ <Navigate to="/auth/login" />} />
            </>
          )
        : (
            <>
              <Route path='/crear' element={ <CrearPage /> }/>
              <Route path='/actualizar' element={ <ActualizarPage /> }/>
              <Route path='/*' element={ <Navigate to="/crear" />} />
            </>
          )
      }
    </Routes>
  )
}
