import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import ReactDOMClient from "react-dom/client";
import {FeedsContextProvider} from "./contexts/FeedsContext";
import {AuthContextProvider} from "./contexts/AuthContext";
import {AppModeContextProvider} from "./contexts/AppModeContext";
import {Auth0Provider} from "@auth0/auth0-react";
import {AUTH0_CLIENT_ID, AUTH0_DOMAIN} from "./config";

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: "#161b22"
        },
        primary: {
            main: '#faf9fc'
        }, secondary: {
            main: '#e6772b'
        }
    }
});

const rootElement = document.getElementById('root');
ReactDOMClient.createRoot(rootElement).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Auth0Provider
                domain={AUTH0_DOMAIN}
                clientId={AUTH0_CLIENT_ID}
                redirectUri={window.location.origin}
                scope="openid"
            >
                <AuthContextProvider>
                    <FeedsContextProvider>
                        <AppModeContextProvider>
                            <App/>
                        </AppModeContextProvider>
                    </FeedsContextProvider>
                </AuthContextProvider>
            </Auth0Provider>
        </ThemeProvider>
    </React.StrictMode>
);
reportWebVitals();