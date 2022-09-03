import React, {createContext, useContext, useEffect, useState} from "react";
import NetlifyIdentityWidget, {User} from "netlify-identity-widget";
import md5 from "md5";

interface AuthContextValue {
    isAuthenticated: boolean;
    user: User | null;
    getUserFullName: Function;
    getAvatarUrl: Function;
    authenticate: Function;
    logout: Function;
    apiFetch: Function;
    apiPost: Function;
}

const AuthContext = createContext({} as AuthContextValue);

interface AuthContextProviderProps {
    children?: React.ReactNode;
}

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const init = async () => {
            // @ts-ignore
            window.netlifyIdentity = NetlifyIdentityWidget;
            NetlifyIdentityWidget.init();
            const currentUser = NetlifyIdentityWidget.currentUser()
            if (currentUser) {
                setIsAuthenticated(true);
                setUser(currentUser);
            }
        }
        init();
    }, []);

    const getUserFullName = () => {
        getAvatarUrl();
        if (user) {
            const fullName = user.user_metadata?.full_name
            if (fullName) {
                return fullName;
            } else {
                return user.email;
            }
        } else {
            return undefined;
        }
    }

    const getAvatarUrl = () => {
        if (user) {
            const emailMd5 = md5(user.email);
            return `https://www.gravatar.com/avatar/${emailMd5}`;
        }
    }

    const authenticate = (callback: (_: User) => void) => {
        NetlifyIdentityWidget.open();
        NetlifyIdentityWidget.on('login', user => {
            setUser(user);
            setIsAuthenticated(true);
            NetlifyIdentityWidget.close();
            if (callback) {
                callback(user);
            }
        });
    }

    const logout = (callback: () => void) => {
        NetlifyIdentityWidget.logout();
        NetlifyIdentityWidget.on('logout', () => {
            setUser(null);
            setIsAuthenticated(false);
            if (callback) {
                callback();
            }
        });
    }

    const apiFetch = async (endpoint: string, user: User) => {
        const headers: HeadersInit = {};
        if (user) {
            const token = await user.token?.access_token;
            headers['Authorization'] = `Bearer ${token}`
        }
        const response = await fetch(`/.netlify/functions/${endpoint}`, {headers});
        if (response.ok) {
            return await response.json();
        } else {
            return undefined;
        }
    }

    const apiPost = async (endpoint: string, body: string, user: User) => {
        const headers: HeadersInit = {};
        if (user) {
            const token = await user.token?.access_token;
            headers['Authorization'] = `Bearer ${token}`
        }
        const response = await fetch(`/.netlify/functions/${endpoint}`, {method: 'POST', body: body, headers});
        if (response.ok) {
            return await response.json();
        } else {
            return undefined;
        }
    }

    return (<AuthContext.Provider value={{
        isAuthenticated, user, getUserFullName, getAvatarUrl, authenticate, logout, apiFetch, apiPost
    }}>{props.children}</AuthContext.Provider>)
}

export function useAuth() {
    return useContext(AuthContext);
}