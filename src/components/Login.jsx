import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import "./assets/styles.scss";
// import Cookies from 'js-cookie';

function Login() {
  const [inputPassword, setInputPassword] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  async function checkLogin(event) {
    event.preventDefault();
    //   try {
    //     await fetch("http://localhost:5001/users/", {
    //         method: "POST",
    //         headers: {'Content-Type': "application/json"},
    //         body: JSON.stringify({
    //             name: inputUsername,
    //             password: inputPassword
    //         })
    //     })

    // //   const res = await axios.post("http://localhost:3000/users/login", {email: inputEmail, password: inputPassword})
    // //   console.log(res)
    //   // .then(res => res.json())
    // //   const loginStatus = Cookies.get('loggedIn')

    //   if (res.data.verified) { //alter based on response from backend
    //     setLoggedIn(true);
    //     console.log("correct input")
    window.location.href = 'http://localhost:3335/dashboard'; //what is our local host?
    //   } else {
    //     console.log("incorrect")
    //   }
    // } catch (err) {
    //   console.error("Error: ", err);
    // }
  }
  return (
    <div>
      <h1>Login</h1>
      <div className='loginPage'>
        <form onSubmit={checkLogin}>
          <div className='inputs'>
            <input
              type='text'
              name='username'
              placeholder='username'
              email={inputUsername}
              onChange={(e) => {
                setInputUsername(e.target.value);
              }}
            />
            <input
              type='password'
              name='password'
              placeholder='Password'
              password={inputPassword}
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
