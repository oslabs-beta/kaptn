import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { Typography } from '@mui/material';
import { AppBar } from '@mui/material';
import Container from '@mui/material/Container';

function Login() {
    const [inputPassword, setInputPassword] = useState("");
    const [inputUsername, setInputUsername] = useState("");
    const [loggedIn, setLoggedIn] = useState(false)
    // const [response, setResponse] = useState("")
    async function checkLogin(event) {
      event.preventDefault()
      console.log('in command')
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
        // const res = await response.json();
        // console.log(res)
        // if (res.data.id) { //alter based on response from backend
        // console.log("correct input")
        window.location.href = "http://localhost:4444/dashboard"; 
      // } else {
      //   console.log("incorrect")
      // }
    } catch(err) {
       console.error("Error: ", err);
    }
  }
  return (
    <Box sx={{ display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              backgroundColor: '#5b5b5c',
              height: '100vh', 
              mt: 0}}>
        <AppBar sx={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignContent: 'center', 
                  backgroundColor: '#1f1f1f' }} position='static'>
        <Container sx={{width: '100%'}}>
              <Typography
                variant='h6'
                noWrap
                component='a'
                href='/'
                fullWidth
                sx={{
                  justifyContent: 'center',
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: 50,
                  letterSpacing: '.1 rem',
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                kaptn
              </Typography>
            </Container>
        </AppBar>
        <Box component='form' 
          onSubmit={checkLogin} 
          sx={{ mt: 6 }}>
          <Box sx={{ display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center' }}>
            <Typography 
              component='h1' 
              variant='h3' 
              sx={{mb: 6,
                  fontFamily: 'monospace',
                  fontWeight: 100,
                  fontSize: 70,
                  letterSpacing: '.1 rem',
                  color: 'white',
                  textDecoration: 'none'}}>
              Login
            </Typography>
                    <TextField
                      type="text"
                      name="username"
                      label = 'Username'
                      fullWidth
                      username={inputUsername}
                      sx = {{ 
                            mb: 3,
                            backgroundColor: 'white'
                            }}
                      onChange={(e) => {
                        setInputUsername(e.target.value);
                      }} />
                    <TextField               
                      type="password"
                      name="password"
                      label = 'Password'
                      fullWidth
                      password={inputPassword}
                      sx = {{ 
                        mb: 3,
                        backgroundColor: 'white'
                      }}
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
              <Typography 
              variant='h6'
              sx={{
                fontFamily: 'monospace',
                      fontSize: 25,
                      letterSpacing: '.1 rem',
                      color: 'white',
                      textDecoration: 'none',
              }}
              >
              Don't have an account? Sign up now
              </Typography>
              <Button 
                variant='contained'
                fullWidth
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textDecoration: 'none',
                  mt: 2, 
                  mb: 2}}
                >
                <Link to = '/signup'>
                Sign Up
                </Link>
              </Button>
        </Box>
    </Box>
  )
}

export default Login