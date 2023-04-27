import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { Typography } from '@mui/material';
import { ColorModeContext, useMode } from '../theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

function Login() {
  const [password, setInputPassword] = useState('');
  const [username, setInputUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, colorMode] = useMode();

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
      // console.error(err);
    }
  }
  // When log in button is clicked, invoke checkLogin function
  function handleSubmit(event) {
    event.preventDefault();
    const callCheckLogin = async () => {
      const response = await checkLogin(username, password);
      // If the request was successful, set the login state to true and redirect to the dashboard
      console.log('response', response);
      if (!response.err) {
        setLoggedIn(true);
        window.location.href = 'http://localhost:4444/dashboard';
      } else {
        alert('Wrong username or password');
      }
    };
    callCheckLogin();
  }
  return (
    <>
      <Box
        src='../../build/icon.ico'
        sx={{
          height: '150px',
          width: '150px',
          mb: 4,
          mt: 4,
        }}
        component='img'
      ></Box>
      <Box component='form' onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TextField
            type='text'
            name='username'
            label='Username'
            fullWidth
            username={username}
            sx={{
              mb: 3,
            }}
            onChange={(e) => {
              setInputUsername(e.target.value);
            }}
          />
          <TextField
            type='password'
            name='password'
            label='Password'
            fullWidth
            password={password}
            sx={{
              mb: 3,
            }}
            onChange={(e) => {
              setInputPassword(e.target.value);
            }}
          />
        </Box>
        <Button
          variant='contained'
          type='submit'
          fullWidth
          sx={{
            display: 'flex',
            border: '1px solid #68617f',
            flexDirection: 'column',
            alignItems: 'center',
            letterSpacing: '1.5px',
            backgroundColor: '#22145a',
            mt: 2,
            mb: 2,
            ':hover': {
              backgroundColor: 'rgb(16,10,54)',
            },
          }}
        >
          Login
        </Button>
        <Typography
          variant='h6'
          sx={{
            fontFamily: 'Roboto',
            fontSize: 25,
            fontWeight: 50,
            letterSpacing: '.1 rem',
            color: 'white',
            textDecoration: 'none',
          }}
        >
          Don't have an account? Sign up now
        </Typography>
        <Button
          variant='contained'
          type='submit'
          fullWidth
          href='/signup'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid #68617f',
            letterSpacing: '1.5px',
            backgroundColor: '#22145a',
            mt: 2,
            mb: 2,
            ':hover': {
              backgroundColor: 'rgb(16,10,54)',
            },
          }}
        >
          Sign Up
        </Button>
      </Box>
    </>
  );
}
export default Login;
