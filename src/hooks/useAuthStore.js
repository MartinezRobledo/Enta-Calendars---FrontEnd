import { useDispatch, useSelector } from 'react-redux'
import { calendarApi } from '../api';
import { clearErrorMessage, onLogin, onLogout } from '../store/auth/authSlice';

export const useAuthStore = () => {
    const { status, errorMessage, user } = useSelector( state => state.auth );
    
    const dispatch = useDispatch();

    const startLogin = async({ name, password }) => {
        try {
            const { data } = await calendarApi.post('/auth', { name, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({name: data.name, uid: data.uid, picture: data.picture}) );
        } catch (error) {
            console.log(error.response?.data); // <-- Revisa el mensaje real
            dispatch( onLogout('Credenciales incorrectas'));
            setTimeout(()=>{
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }

    const checkToken = async() => {
        const token = localStorage.getItem('token');
        if(!token) return dispatch( onLogout());

        try {
            const { data } = await calendarApi.get('auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({name: data.name, uid: data.uid, picture: data.picture}) );
        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogout() );
    }

    return {
        //* Propiedades
        errorMessage,
        status,
        user,

        //* Metodos
        startLogin,
        checkToken,
        startLogout,
    }
}