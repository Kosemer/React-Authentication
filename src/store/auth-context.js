import React, { useCallback, useEffect, useState } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime(); // Itt adom meg az aktuális időbélyeget ezredmásodpercben.
  const adjExpirationTime = new Date(expirationTime).getTime(); // A lejárati időt dátum objektummá alakítom és színtén ezredmásodpercben.

  const reminingTime = adjExpirationTime - currentTime; // És akkor a fennmaradó idő = lejárati idő - aktuális idő.

  return reminingTime;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    // 3600 ezredmásodperc = 1 perc
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  // Ha még nem járt le az idő
  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  //const initialToken = localStorage.getItem("token"); // Megnézem, hogy a local storage-ben van-e token, ha igen akkor elmentem az 'initialToken'-be.
  const [token, setToken] = useState(initialToken); // Itt átadom a 'useState'-nek.
  const userIsLoggedIn = !!token; // Ez átalakítja az igaz vagy hamis értéket, igaz vagy hamis logikai értékre. Ha a token egy karakterlánc, ami nem üres, ez igaz lesz. Ha a token egy üres karakterlánc akkor false értéket ad vissza.

  const logoutHandler = useCallback(() => {
    setToken(null); // Kijelentkezéskor törlöm a token-t.
    localStorage.removeItem("token"); // Kijelentkezéskor törlöm a token-t a local storage-ből.
    localStorage.removeItem("expirationTime");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expirationTime) => {
    // expirationTime: token lejárati ideje.
    setToken(token); // Itt meg beállítom a token-t, ha megkapom.
    // TOKEN TÁROLÁSA, hogy az oldal újratöltésekor bejelentkezve maradjon a felhasználó.
    localStorage.setItem("token", token); // A 'setItem' lehetővé teszi, hogy kulcs-érték párt tároljunk a helyi tárhelyen. A kulcs nevét eldöntheted, hogy mi legyen. Itt 'token' lesz a neve.
    localStorage.setItem("expirationTime", expirationTime);
    const reminingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, reminingTime); // A 'setTimeout'-nak átadom a 'logoutHandler'-t és a hátralévő időt (reminingTime), aminek számnak kell legyen.
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);

      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  // Hátralévő idő átalakítása
  let time = null
  if(tokenData){
  let seconds = Math.floor(tokenData.duration / 1000);
  let minutes = Math.floor(seconds / 60);
  //let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;
  console.log(minutes, seconds);

   time = `${minutes}:${seconds}`
  }

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    loginHandler: loginHandler,
    logout: logoutHandler,
    reminingTime: time, // Itt gond van, ha lejár az idő
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
