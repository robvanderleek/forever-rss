import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client';
import App from './App';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {FeedsContextProvider} from "./contexts/FeedsContext";
import {AppModeContextProvider} from "./contexts/AppModeContext";

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
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <FeedsContextProvider>
                <AppModeContextProvider>
                    <App/>
                </AppModeContextProvider>
            </FeedsContextProvider>
        </ThemeProvider>
    </StrictMode>,
);
