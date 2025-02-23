import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {AppModeContextProvider} from "./contexts/AppModeContext.tsx";
import {FeedsContextProvider} from "./contexts/FeedsContext.tsx";
import {AuthContextProvider} from "./contexts/AuthContext.tsx";

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
            <AuthContextProvider>
                <FeedsContextProvider>
                    <AppModeContextProvider>
                        <App/>
                    </AppModeContextProvider>
                </FeedsContextProvider>
            </AuthContextProvider>
        </ThemeProvider>
    </StrictMode>,
)
