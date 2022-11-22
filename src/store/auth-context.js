import React, { useState } from "react"

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
});

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime(); // Itt adom meg az aktuális időbélyeget ezredmásodpercben.
    const adjExpirationTime = new Date(expirationTime).getTime();   // A lejárati időt dátum objektummá alakítom és színtén ezredmásodpercben.

    const reminingTime = adjExpirationTime - currentTime; // És akkor a fennmaradó idő = lejárati idő - aktuális idő.

    return reminingTime;
}

export const AuthContextProvider = (props) => {
const initialToken = localStorage.getItem('token'); // Megnézem, hogy a local storage-ben van-e token, ha igen akkor elmentem az 'initialToken'-be.
const [token, setToken] = useState(initialToken)    // Itt átadom a 'useState'-nek.
const userIsLoggedIn = !!token; // Ez átalakítja az igaz vagy hamis értéket, igaz vagy hamis logikai értékre. Ha a token egy karakterlánc, ami nem üres, ez igaz lesz. Ha a token egy üres karakterlánc akkor false értéket ad vissza.

const logoutHandler = () => {
    setToken(null); // Kijelentkezéskor törlöm a token-t.
    localStorage.removeItem('token'); // Kijelentkezéskor törlöm a token-t a local storage-ből.
};

const loginHandler = (token, expirationTime) => {   // expirationTime: token lejárati ideje.
    setToken(token);    // Itt meg beállítom a token-t, ha megkapom.
    // TOKEN TÁROLÁSA, hogy az oldal újratöltésekor bejelentkezve maradjon a felhasználó.
    localStorage.setItem('token', token)  // A 'setItem' lehetővé teszi, hogy kulcs-érték párt tároljunk a helyi tárhelyen. A kulcs nevét eldöntheted, hogy mi legyen. Itt 'token' lesz a neve.

    const reminingTime = calculateRemainingTime(expirationTime);

    setTimeout(logoutHandler, 3000) // A 'setTimeout'-nak átadom a 'logoutHandler'-t és a hátralévő időt (reminingTime), aminek számnak kell legyen.
};

const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    loginHandler: loginHandler,
    logout: logoutHandler
}

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext;