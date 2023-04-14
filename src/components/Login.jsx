import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import "./assets/styles.scss";
// import Cookies from 'js-cookie';

function Login() {
    const [inputPassword, setInputPassword] = useState("");
    const [inputUsername, setInputUsername] = useState("");
    const [loggedIn, setLoggedIn] = useState(false)
    // const [response, setResponse] = useState("")
  //   async function checkLogin(event) {
  //     event.preventDefault()
  //     try {
  //        const response = await fetch('http://localhost:3000/user/login', {
  //           mode: 'no-cors',
  //           method: "POST",
  //           // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  //           headers: {'Content-Type': 'application/json'},
  //           body: JSON.stringify({
  //               username: inputUsername,
  //               password: inputPassword
  //           })
  //       })
  //       // window.location.href = "http://localhost:4444/dashboard"
  //       console.log('FRONTEND MESSAGE')
  //       // const res = await response;
  //       console.log(response)

  //       // console.log("THIS IS RESPONSE:", response)

  //   } catch(err) {
  //      console.error("Error: ", err);
  //   }
  // }
  function checkLogin(event){
    event.preventDefault();
    fetch('http://localhost:3000/user/login', {
            mode: 'no-cors',
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            // headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: inputUsername,
                password: inputPassword
            })
        })
        .then(data => console.log(data))
        .catch(err => console.log(err))
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
