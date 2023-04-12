import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom";
function Signup() {
    const [inputPassword, setInputPassword] = useState("");
    const [inputUsername, setInputUsername] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    // const [loggedIn, setLoggedIn] = useState(false);
    async function createUser(event) {
        event.preventDefault();
        console.log('in create user front end');
        try {
            await fetch("http://localhost:3000/user/createuser", {
                mode: 'no-cors',
                method: "POST",
                headers: {'Content-Type': "application/x-www-form-urlencoded"},
                body: JSON.stringify({
                    username: inputUsername,
                    email: inputEmail,
                    password: inputPassword
                })
            })
            window.location.href = "http://localhost:4444/"; //edit as needed
        } catch(err) {
            console.error("Error in posting")
        }
    }
  return (
    <div>
        <h1>Create Account</h1>
        <div className = 'loginPage'>
        <form onSubmit={createUser}>
            <div className ="inputs">
            <input               
              type="text"
              name="username"
              placeholder = 'Username'
              username={inputUsername}
              onChange={(e) => {
                setInputUsername(e.target.value);
              }} />
              <input               
              type="text"
              name="email"
              placeholder = 'Email'
              email={inputEmail}
              onChange={(e) => {
                setInputEmail(e.target.value);
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
            <button type='submit'>Signup</button>
        </form>
        </div>
    </div>
  )
}

export default Signup