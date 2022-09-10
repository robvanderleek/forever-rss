import React, {createContext, useContext, useEffect} from "react";
import md5 from "md5";
import {useAuth0, User} from "@auth0/auth0-react";

interface AuthContextValue {
    isAuthenticated: boolean;
    user: User | undefined;
    getUserFullName: Function;
    getAvatarUrl: Function;
    loginWithRedirect: Function;
    logout: Function;
    apiFetch: Function;
    apiPost: Function;
}

const AuthContext = createContext({} as AuthContextValue);

interface AuthContextProviderProps {
    children?: React.ReactNode;
}

export function AuthContextProvider(props: AuthContextProviderProps) {
    const {
        loginWithRedirect,
        logout,
        isAuthenticated,
        isLoading,
        user,
        getAccessTokenSilently,
        getAccessTokenWithPopup
    } = useAuth0();

    useEffect(() => {
        const init = async () => {
            // @ts-ignore
            // window.netlifyIdentity = NetlifyIdentityWidget;
            // NetlifyIdentityWidget.init();
            // const currentUser = NetlifyIdentityWidget.currentUser()
            // if (currentUser) {
            //     setIsAuthenticated(true);
            //     setUser(currentUser);
            // }
        }
        init();
    }, []);

    const getUserFullName = () => {
        getAvatarUrl();
        if (user) {
            const fullName = user.name
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
        if (user && user.email) {
            const emailMd5 = md5(user.email);
            return `https://www.gravatar.com/avatar/${emailMd5}`;
        }
    }

    const apiFetch = async (endpoint: string, user: User) => {
        const headers: HeadersInit = {};
        if (user) {
            const accessToken = await getAccessTokenSilently({
                audience: 'https://development.api.foreverrss'
            });
            headers['Authorization'] = `Bearer ${accessToken}`
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
            const accessToken = await getAccessTokenSilently({
                audience: 'https://development.api.foreverrss'
            });
            headers['Authorization'] = `Bearer ${accessToken}`
        }
        const response = await fetch(`/.netlify/functions/${endpoint}`, {method: 'POST', body: body, headers});
        if (response.ok) {
            try {
                return await response.json();
            } catch {
                return true;
            }
        } else {
            return undefined;
        }
    }

    return (<AuthContext.Provider value={{
        isAuthenticated, user, getUserFullName, getAvatarUrl, loginWithRedirect, logout, apiFetch, apiPost
    }}>{props.children}</AuthContext.Provider>)
}

export function useAuth() {
    return useContext(AuthContext);
}
