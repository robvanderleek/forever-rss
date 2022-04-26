import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import ReactDOMClient from "react-dom/client";
import {FeedsContextProvider} from "./context/FeedsContext";
import {AuthContextProvider} from "./context/AuthContext";

const theme = createTheme({
    palette: {
        mode: "dark", primary: {
            main: '#808ecd'
        }, secondary: {
            main: '#c25096'
        }
    }
});

const rootElement = document.getElementById('root');
ReactDOMClient.createRoot(rootElement).render(<React.StrictMode>
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <AuthContextProvider>
            <FeedsContextProvider>
                <App/>
            </FeedsContextProvider>
        </AuthContextProvider>
    </ThemeProvider>
</React.StrictMode>);
reportWebVitals();