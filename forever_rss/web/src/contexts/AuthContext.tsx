import React, {createContext, useContext, useEffect} from "react";
import {User} from "../entities/User";
import {ApiService} from "../services/ApiService";
import {Auth} from "../entities/Auth";

interface AuthContextType {
    login: () => void;
    logout: () => void;
    isAuthenticated: boolean;
    authenticate: (code: string) => Promise<void>;
    user: User | undefined;
    getAuthToken: () => string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthContextProvider(props: { children?: React.ReactNode }) {
    const [loading, setLoading] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [user, setUser] = React.useState<undefined | User>(undefined);

    useEffect(() => {
        const init = async () => {
            const token = getAuthToken();
            if (token !== 'Anonymous') {
                setIsAuthenticated(true);
                const user = await new ApiService(token).currentUser();
                setUser(user);
            }
        }
        init();
    }, []);

    const login = () => {
        const host = window.location.host;
        const location = window.location.protocol + "//" + host;
        let client_id;
        if (host === "localhost:3000") {
            client_id = 'Ov23liRujHvEesAeYNGm';
        } else {
            client_id = 'Ov23liYri0cpt9lIOydU';
        }
        const redirect_uri = `${location}/oauth/redirect`;
        const scope = "user:email";
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;
        window.location.href = authUrl;
    }

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    }

    const authenticate = async (code: string) => {
        if (!loading) {
            setLoading(true);
            const res = await fetch(`/api/v1/oauth/redirect?code=${code}`);
            if (res.ok) {
                const data = await res.json() as Auth;
                setAuthToken(data.token);
                setUser(data.user);
            }
            setLoading(false);
        }
    }

    const getAuthToken = (): string => {
        const token = localStorage.getItem("token");
        if (token) {
            return token;
        } else {
            return "Anonymous";
        }
    }

    const setAuthToken = (token: string) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
    }

    return (
        <AuthContext.Provider value={{login, logout, isAuthenticated, authenticate, user, getAuthToken}}>
            {props.children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}