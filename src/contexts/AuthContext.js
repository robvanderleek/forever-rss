import {createContext, useContext, useEffect, useState} from "react";
import netlifyIdentity from "netlify-identity-widget";

const AuthContext = createContext();

export function AuthContextProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const init = async () => {
            window.netlifyIdentity = netlifyIdentity;
            netlifyIdentity.init();
            const currentUser = netlifyIdentity.currentUser()
            if (currentUser) {
                setIsAuthenticated(true);
                setUser(currentUser);
            }
        }
        init();
    }, []);

    const authenticate = (callback) => {
        netlifyIdentity.open();
        netlifyIdentity.on('login', user => {
            setUser(user);
            setIsAuthenticated(true);
            netlifyIdentity.close();
            if (callback) {
                callback(user);
            }
        });
    }

    const logout = (callback) => {
        netlifyIdentity.logout();
        netlifyIdentity.on('logout', () => {
            setUser(null);
            setIsAuthenticated(false);
            if (callback) {
                callback();
            }
        });
    }

    return (<AuthContext.Provider value={{
        isAuthenticated, user, authenticate, logout
    }}>{children}</AuthContext.Provider>)
}

export function useAuth() {
    return useContext(AuthContext);
}