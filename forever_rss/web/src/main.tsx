import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client';
import App from './App';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {FeedsContextProvider} from "./contexts/FeedsContext";
import {AppModeContextProvider} from "./contexts/AppModeContext";
import {AuthContextProvider} from "./contexts/AuthContext";

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#f19e31'
        },
        action: {
            hover: 'rgb(128, 128, 128, 0.2)'
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <AuthContextProvider>
            <StrictMode>
                <FeedsContextProvider>
                    <AppModeContextProvider>
                        <App/>
                    </AppModeContextProvider>
                </FeedsContextProvider>
            </StrictMode>
        </AuthContextProvider>
    </ThemeProvider>
);
