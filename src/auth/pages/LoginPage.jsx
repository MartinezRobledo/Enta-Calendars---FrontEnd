import { Box, Button, Input } from "@mui/material";
import Fondo from '../../assets/images/fondo-calendars.jpg';
import LogoEnta from '../../assets/images/logo-enta-horizontal-h100-Calendars.png';
import LogoBP from '../../assets/images/BP_Logo.png'
import LogoAA from '../../assets/images/Logo-Automation-Anywhere.webp'
import { useAuthStore, useForm } from "../../hooks";
import { useEffect } from "react";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.min.css';

const loginFormFields = {
    loginEmail: '',
    loginPassword: ''
};

export const LoginPage = () => {

    const { startLogin, errorMessage } = useAuthStore();
    const { loginEmail, loginPassword, onInputChange: onLoginInputChange } = useForm(loginFormFields);

    const onSubmit = async (event) => {
        event.preventDefault();
        await startLogin({ name: loginEmail, password: loginPassword });
    };

    useEffect(() => {
        if (errorMessage !== undefined)
            Swal.fire({
                title: 'Error en la autenticación',
                text: errorMessage,
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
                buttonsStyling: true,
                confirmButtonColor: '#ff8a00',
            });
        else if (errorMessage === 'Ocurrió un error durante la carga')
            Swal.fire({
                title: errorMessage,
                text: 'Algunas funcionalidades pueden no responder correctamente',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
                buttonsStyling: true,
                confirmButtonColor: '#ff8a00',
            });

    }, [errorMessage]);

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
                        userSelect: 'none',
                        position: 'relative', // Posiciona la capa de fondo
                    }}
                >
                    {/* Capa de fondo con opacidad */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url(${Fondo})`,
                            opacity: 0.2, // Opacidad de la imagen de fondo
                            zIndex: -1, // Asegura que la imagen de fondo esté detrás del contenido
                        }}
                    />
                    <img
                        src={LogoEnta} // URL de la imagen
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
                        flexDirection: 'column'
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
                                    '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                                    '& .MuiInput-underline:hover:before': { borderBottomColor: 'white' },
                                    '& .MuiInput-underline:after': { borderBottomColor: 'white' }
                                }}
                                color="default"
                                name="loginEmail"
                                value={loginEmail}
                                onChange={onLoginInputChange}
                            />
                            <Input
                                placeholder="Contraseña"
                                sx={{
                                    margin: 1,
                                    color: 'white'
                                }}
                                type="password"
                                color="default"
                                name="loginPassword"
                                value={loginPassword}
                                onChange={onLoginInputChange}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                type="submit">
                                Ingresar
                            </Button>
                        </Box>
                    </form>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            width: '100%',
                            marginTop: 5,
                        }}
                    >
                        <img 
                            src={LogoAA} // URL de la imagen
                            alt="Imagen centrada"
                            style={{maxWidth: '300px', maxHeight: '182px'}} // Ajusta la imagen para que se adapte a la caja
                        />
                        <img 
                            src={LogoBP} // URL de la imagen
                            alt="Imagen centrada"
                            style={{maxWidt: '200px', maxHeight:'182px'}} // Ajusta la imagen para que se adapte a la caja
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
};
