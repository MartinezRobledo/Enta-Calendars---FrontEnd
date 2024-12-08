import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';

export const entaTheme = createTheme({
    palette: {
        primary: {
            main: '#049cfc',
            extra: '#0075ff',
        },
        secondary: {
            main: '#fc8b04',
            extra: '#9c9c9c'
        },
        default: {
            main: '#ffffff',
        },
        error: {
            main: red.A400
        }
    }
})





