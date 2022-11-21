import React, { useState } from "react"

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
});

export const AuthContextProvider = (props) => {

const [token, setToken] = useState(null)
const userIsLoggedIn = !!token; // Ez átalakítja az igaz vagy hamis értéket, igaz vagy hamis logikai értékre. Ha a token egy karakterlánc, ami nem üres, ez igaz lesz. Ha a token egy üres karakterlánc akkor false értéket ad vissza.

const loginHandler = (token) => {
    setToken(token);    // Itt meg beállítom a token-t, ha megkapom.
};
const logoutHandler = () => {
    setToken(null); // Kijelentkezéskor törlöm a token-t.
};

const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    loginHandler: loginHandler,
    logoutHandler: logoutHandler
}

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext;