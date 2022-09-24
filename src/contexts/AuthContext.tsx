import React, {createContext, useContext} from "react";
import md5 from "md5";
import {useAuth0, User} from "@auth0/auth0-react";

interface AuthContextValue {
    isLoading: boolean;
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

    const getAccessToken = async (): Promise<string> => {
        // if (AUTH0_CLIENT_ID === 'bsTnov9xAQgQqYgtgF7APCeayP2g6Tz3') {
        //     return await getAccessTokenWithPopup({
        //         audience: 'https://development.api.foreverrss'
        //     });
        // } else {
            return await getAccessTokenSilently({
                audience: 'https://development.api.foreverrss'
            });
        // }
    }

    const apiFetch = async (endpoint: string, user: User) => {
        const headers: HeadersInit = {};
        if (user) {
            const accessToken = await getAccessToken();
            headers['Authorization'] = `Bearer ${accessToken}`
        }
        const response = await fetch(`/.netlify/functions/${endpoint}`, {headers});
        if (response.ok) {
            return await response.json();
        } else {
            return undefined;
        }
    }

    const apiPost = async (endpoint: string, body: string, user: User): Promise<Response> => {
        const headers: HeadersInit = {};
        if (user) {
            const accessToken = await getAccessToken();
            headers['Authorization'] = `Bearer ${accessToken}`
        }
        return await fetch(`/.netlify/functions/${endpoint}`, {method: 'POST', body: body, headers});
    }

    return (<AuthContext.Provider value={{
        isLoading, isAuthenticated, user, getUserFullName, getAvatarUrl, loginWithRedirect, logout, apiFetch, apiPost
    }}>{props.children}</AuthContext.Provider>)
}

export function useAuth() {
    return useContext(AuthContext);
}
