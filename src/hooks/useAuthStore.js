import { useDispatch, useSelector } from 'react-redux'
import { calendarApi } from '../api';
import { clearErrorMessage, onLogin, onLogout } from '../store/auth/authSlice';

export const useAuthStore = () => {
    const { status, errorMessage, user } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const startLogin = async({ email, password }) => {
        try {
            const { data } = await calendarApi.post('/auth', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({name: data.name, uid: data.uid}) );
        } catch (error) {
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
            dispatch( onLogin({name: data.name, uid: data.uid}) );
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