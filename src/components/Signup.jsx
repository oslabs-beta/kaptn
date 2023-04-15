import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
function Signup() {
  const [password, setInputPassword] = useState('');
  const [username, setInputUsername] = useState('');
  const [email, setInputEmail] = useState('');

  // Send request to the server to create a new user
  async function createUser(username, email, password) {
    try {
      const response = await fetch('/user/createuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      // If the response comes back, parse it from JSON and return
      const parsedResponse = await response.json();
      return parsedResponse;
    } catch (err) {
      console.error(err);
    }
  }

  // When sign up button is clicked, invoke createUser function
  function handleClick(event) {
    event.preventDefault();

    if (username === '' || password === '' || email === '')
      alert('Missing username, email, or password. Please try again');

    const callCreateUser = async () => {
      const response = await createUser(username, email, password);
      // If there are no errors, redirect to the login page
      if (response) window.location.href = 'http://localhost:4444/';
    };
    callCreateUser();
  }

  return (
    <div>
      <h1>Create Account</h1>
      <div className='loginPage'>
        <form onSubmit={handleClick}>
          <div className='inputs'>
            <input
              type='text'
              name='username'
              placeholder='Username'
              username={username}
              onChange={(e) => {
                setInputUsername(e.target.value);
              }}
            />
            <input
              type='text'
              name='email'
              placeholder='Email'
              email={email}
              onChange={(e) => {
                setInputEmail(e.target.value);
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
          <button type='submit'>Signup</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
