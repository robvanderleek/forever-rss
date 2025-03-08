import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

export default function OAuthRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const navigate = useNavigate();
    const {isAuthenticated, authenticate} = useAuth();

    useEffect(() => {
        const handleAuth = async () => {
            if (isAuthenticated) {
                navigate('/');
            } else if (code) {
                await authenticate(code);
                navigate('/');
            }
        }
        handleAuth();
    }, [code]);

    return null;
}