import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Login from "./Login";
import Main from "./Main";

import "./styles.css";

function App() {
  const [token, setToken] = useState(null);
  const onLogin = t => setToken(t);
  const onLogout = () => setToken(null);

  useEffect(
    () => {
      if (localStorage.getItem("token", token) != null) {
        setToken(localStorage.getItem("token", token));
      }
    },
    [] //the dependdencies
  );

  return (
    <div className="App">
      {token == null ? (
        <Login onLogin={onLogin} />
      ) : (
        <Main token={token} onLogout={onLogout} />
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
