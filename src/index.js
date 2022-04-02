import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import ReactDOMClient from "react-dom/client";

const theme = createTheme({palette: {mode: "dark"}});
const rootElement = document.getElementById('root');
ReactDOMClient.createRoot(rootElement).render(<React.StrictMode>
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <App/>
    </ThemeProvider>
</React.StrictMode>);
reportWebVitals();