import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import OAuthRedirect from "./pages/OAuthRedirect";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/oauth/redirect" element={<OAuthRedirect/>}/>
            </Routes>
        </BrowserRouter>
    );
}