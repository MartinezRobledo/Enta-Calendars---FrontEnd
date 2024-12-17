import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { AppTheme } from './theme';
import { Provider } from 'react-redux';
import { store } from './store';

export const CalendarApp = () => {
    

    return (
        <Provider store={store}>
            <BrowserRouter>
                <AppTheme>
                    <AppRouter />
                </AppTheme>
            </BrowserRouter>
        </Provider>
    );
};
