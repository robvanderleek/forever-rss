import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {AUTH0_CLIENT_ID, AUTH0_DOMAIN} from "@/config";
import {AuthContextProvider} from "@/contexts/AuthContext";
import {FeedsContextProvider} from "@/contexts/FeedsContext";
import {AppModeContextProvider} from "@/contexts/AppModeContext";
import {Auth0Provider} from "@auth0/auth0-react";
import React from "react";

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: 'rgb(241, 158, 49)'
        },
        action: {
            hover: 'rgb(128, 128, 128, 0.2)'
        },
    },
});

export default function App({Component, pageProps}: AppProps) {
    let redirectUri;
    if (typeof window !== "undefined") {
        redirectUri = window.location.origin
    } else {
        redirectUri = 'http://localhost:3000';
    }
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Auth0Provider
                domain={AUTH0_DOMAIN}
                clientId={AUTH0_CLIENT_ID}
                redirectUri={redirectUri}
                scope="openid"
            >
                <AuthContextProvider>
                    <FeedsContextProvider>
                        <AppModeContextProvider>
                            <Component {...pageProps} />
                        </AppModeContextProvider>
                    </FeedsContextProvider>
                </AuthContextProvider>
            </Auth0Provider>
        </ThemeProvider>
    );
}
