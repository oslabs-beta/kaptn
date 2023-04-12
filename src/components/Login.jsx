import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
// import "./assets/styles.scss";
import axios from 'axios';
// import Cookies from 'js-cookie';

function Login() {
    const [inputPassword, setInputPassword] = useState("");
    const [inputUsername, setInputUsername] = useState("");
    const [loggedIn, setLoggedIn] = useState(false)
    function checkLogin(event) {
      event.preventDefault()
      // try {
         fetch("http://localhost:3000/user/login", {
            mode: 'no-cors',
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
                username: inputUsername,
                password: inputPassword
            }),
        })
        .then(res => console.log(res))
        .then(res => res.json())
        .then((res) => {
        if (res.data.id) { //alter based on response from backend
        console.log("correct input")
        // window.location.href = "http://localhost:3333/homepage"; 
      } else {
        console.log("incorrect")
      }
    })
      .catch(err => console.log(err))
  // })
    // } catch (err) {
    //   console.error("Error: ", err);
    // }
  }
  return (
    <div>
        <h1>Login</h1>
        <div className = 'loginPage'>
        <form onSubmit={checkLogin} >
            <div className ="inputs">
            <input               
              type="text"
              name="username"
              placeholder = 'username'
              email={inputUsername}
              onChange={(e) => {
                setInputUsername(e.target.value);
              }} />
            <input               
              type="password"
              name="password"
              placeholder = 'Password'
              password={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value);
              }} />
            </div>
            <button type='submit'>Login</button>
        </form>
        <form>
          <h3>Don't have an account? Sign up now</h3>
          <button><Link to = '/signup'>Sign Up</Link></button>
        </form>
        </div>
    </div>
  )
}

export default Login