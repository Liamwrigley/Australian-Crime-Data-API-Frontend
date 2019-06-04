import React, { useState, useEffect } from "react";

export default function Login(props) {
  const [registered, setRegistered] = useState(0);
  const [loginFailed, setloginFailed] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function ShowRegistered() {
    if (registered === 201) {
      return (
        <div className="login-success">
          <p>Successfully Registered!</p>
          <p>Please log in</p>
        </div>
      );
    }
    if (registered === 400) {
      return (
        <div className="login-fault">
          <p>Sorry...</p>
          <p>It looks like that email is already registered</p>
        </div>
      );
    }
    return null;
  }

  function ShowLoginAttempt() {
    if (loginFailed !== "") {
      return (
        <div className="login-fault">
          <p>{loginFailed}</p>
        </div>
      );
    }
    return null;
  }

  function register() {
    fetch("https://cab230.hackhouse.sh/register", {
      method: "POST",
      body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(
        pass
      )}`,
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
      .then(function(response) {
        if (response.ok) {
          setRegistered(201);
          return response.json();
        } else if (response.status === 400) {
          setRegistered(400);
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .catch(function(error) {
        console.log(
          "There has been a problem with your fetch operation: ",
          error.message
        );
      });
    setEmail("");
    setPass("");
  }

  function auth() {
    fetch("https://cab230.hackhouse.sh/login", {
      method: "POST",
      body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(
        pass
      )}`,
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          return response.json();
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then(function(result) {
        if (result.token) {
          localStorage.setItem("token", result.token);
          props.onLogin(result.token);
        } else {
          setloginFailed(JSON.stringify(result.message));
        }
      })
      .catch(function(error) {
        console.log(
          "There has been a problem with your fetch operation: ",
          error.message
        );
      });
  }
  return (
    <div className="login-container">
      <div className="form-container">
        <div className="RHS-strip" />
        <div className="form-content">
          <h1>CRIME DATA API</h1>
          <form
            onSubmit={event => {
              event.preventDefault();
            }}
          >
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={event => {
                setEmail(event.target.value);
              }}
            />
            <input
              id="pass"
              type="password"
              name="pass"
              placeholder="Password"
              value={pass}
              onChange={event => {
                setPass(event.target.value);
              }}
            />
            <button
              onClick={event => {
                auth();
                setRegistered(0);
              }}
              type="submit"
            >
              LOG IN
            </button>
            <button
              onClick={event => {
                register();
                setloginFailed("");
              }}
              type="submit"
            >
              REGISTER
            </button>
          </form>
          <div className="result-message">
            <ShowLoginAttempt loginFailed={loginFailed} />
            <ShowRegistered registered={registered} />
          </div>
        </div>
      </div>
    </div>
  );
}
