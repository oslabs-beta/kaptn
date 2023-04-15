import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import "./assets/styles.scss";
// import Cookies from 'js-cookie';

function Login() {
  const [password, setInputPassword] = useState('');
  const [username, setInputUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  // Send a request to the server to confirm the username and password
  async function checkLogin(username, password) {
    try {
      const response = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      // If there are no errors, convert response from JSON and return
      const parsedResponse = await response.json();
      return parsedResponse;
    } catch (err) {
      console.error(err);
    }
  }

  // When log in button is clicked, invoke checkLogin function
  function handleSubmit(event) {
    event.preventDefault();

    const callCheckLogin = async () => {
      const response = await checkLogin(username, password);
      // If the request was successful, set the login state to true and redirect to the dashboard
      if (response) {
        setLoggedIn(true);
        window.location.href = 'http://localhost:4444/dashboard';
      }
    };
    callCheckLogin();
  }

  return (
    <div>
      <h1>Login</h1>
      <div className='loginPage'>
        <form onSubmit={handleSubmit}>
          <div className='inputs'>
            <input
              type='text'
              name='username'
              placeholder='username'
              email={username}
              onChange={(e) => {
                setInputUsername(e.target.value);
              }}
            />
            <input
              type='password'
              name='password'
              placeholder='Password'
              password={password}
              onChange={(e) => {
                setInputPassword(e.target.value);
              }}
            />
          </div>
          <button type='submit'>Login</button>
        </form>
        <form>
          <h3>Don't have an account? Sign up now</h3>
          <button>
            <Link to='/signup'>Sign Up</Link>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
