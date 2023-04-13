import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { Typography } from '@mui/material';

function Login() {
    const [inputPassword, setInputPassword] = useState("");
    const [inputUsername, setInputUsername] = useState("");
    const [loggedIn, setLoggedIn] = useState(false)
    // const [response, setResponse] = useState("")
    async function checkLogin(event) {
      event.preventDefault()
      try {
         const response = await fetch('http://localhost:3000/user/login', {
            mode: 'no-cors',
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            // headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: inputUsername,
                password: inputPassword
            })
        })
        const res = await response.json();
        console.log(res)
        // .then((res) => res.json())
        // .then(res => console.log(res))
        // .then((res) => {
        if (res.data.id) { //alter based on response from backend
        console.log("correct input")
        window.location.href = "http://localhost:3333/dashboard"; 
      } else {
        console.log("incorrect")
      }
    // })
      // .catch(err => console.log(err))
  // })
    } catch(err) {
       console.error("Error: ", err);
    }
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6}}>
        <Typography component='h1' variant='h3'>Login</Typography>
        <div className = 'loginPage'>
        <Box component='form' onSubmit={checkLogin} sx={{ mt: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TextField
                  type="text"
                  name="username"
                  label = 'Username'
                  fullWidth
                  username={inputUsername}
                  sx = {{ mb: 3}}
                  onChange={(e) => {
                    setInputUsername(e.target.value);
                  }} />
                <TextField               
                  type="password"
                  name="password"
                  label = 'Password'
                  fullWidth
                  password={inputPassword}
                  sx = {{ mb: 3}}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                  }} />
              </Box>
              <Button 
                variant='contained' 
                type='submit'
                fullWidth
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, mb: 2}}>
                Login
              </Button>
          <Typography variant='h6'>Don't have an account? Sign up now</Typography>
          <Button 
            variant='outlined'
            fullWidth
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, mb: 2}}
            >
            <Link to = '/signup'>
            Sign Up
            </Link>
          </Button>
        </Box>
        </div>
    </Box>
  )
}

export default Login