import { Box, Button, Input } from "@mui/material";
import Logo from '../../assets/images/logo-enta-horizontal-h100-Calendars.png'
// import Logo from '../../assets/images/Blue-Prism.png'
import { useAuthStore, useForm } from "../../hooks";
import { useEffect } from "react";
import Swal from "sweetalert2";

const loginFormFields = {
    loginEmail: '',
    loginPassword: ''
}

export const LoginPage = ()=> {

    const { startLogin, errorMessage } = useAuthStore();

    const {loginEmail, loginPassword, onInputChange:onLoginInputChange } = useForm(loginFormFields);

    const onSubmit = (event)=> {
        event.preventDefault();
        startLogin({email: loginEmail, password: loginPassword});
    }

    useEffect(()=>{
        if(errorMessage !== undefined)
            Swal.fire({
                title: 'Error en la autenticación',
                text: errorMessage,
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
                // cancelButtonText: 'Cancelar',
                buttonsStyling: true, // Asegúrate de que los estilos de botones estén habilitados
                confirmButtonColor: '#ff8a00', // Color del botón de confirmación
                // cancelButtonColor: '#d33' // Color del botón de cancelación
              });
        else if(errorMessage === 'Ocurrió un error durante la carga')
            Swal.fire({
                title: errorMessage,
                text: 'Algunas funcionalidades pueden no responder correctamente',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
                // cancelButtonText: 'Cancelar',
                buttonsStyling: true, // Asegúrate de que los estilos de botones estén habilitados
                confirmButtonColor: '#ff8a00', // Color del botón de confirmación
                // cancelButtonColor: '#d33' // Color del botón de cancelación
              });
            
    }, [errorMessage])

  return (
    <>
        <Box
            sx={{
                display: 'flex',
                height: '100vh', // Altura completa de la pantalla
            }}
        >
            {/* Primera caja, ocupa el 50% del ancho */}
            <Box
                sx={{
                flex: 1, // Ocupa el 50% del ancho
                backgroundColor: 'default', // Color del tema
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                userSelect: 'none'
                }}
            >
                <img
                src={Logo} // URL de la imagen
                alt="Imagen centrada"
                style={{ maxWidth: '100%', maxHeight: '100%' }} // Ajusta la imagen para que se adapte a la caja
                />
            </Box>

            {/* Segunda caja, ocupa el 50% del ancho */}
            <Box
                sx={{
                flex: 1, // Ocupa el 50% del ancho
                backgroundColor: 'primary.main', // Otro color del tema
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection:'column'
                }}
            >   
                <form onSubmit={onSubmit}>
                    {/* Inputs centrados */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Input 
                            placeholder="Usuario" 
                            sx={{ 
                                margin: 1, 
                                input: { color: 'white' }, // Color del texto blanco
                                '& .MuiInput-underline:before': { borderBottomColor: 'white' }, // Línea blanca
                                '& .MuiInput-underline:hover:before': { borderBottomColor: 'white' }, // Línea blanca al pasar el mouse
                                '& .MuiInput-underline:after': { borderBottomColor: 'white' } // Línea blanca cuando está enfocado
                            }}
                            color="default"
                            name= "loginEmail"
                            value= { loginEmail }
                            onChange={ onLoginInputChange }
                        />
                        <Input 
                            placeholder="Contraseña" 
                            sx={{ 
                                margin: 1, 
                                color:'white' 
                            }} 
                            type="password" 
                            color="default"
                            name="loginPassword"
                            value= { loginPassword }
                            onChange={ onLoginInputChange }
                        />
                    <Button 
                        variant="contained" 
                        color="secondary"
                        type="submit">
                    Ingresar
                    </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    </>
    );
}

