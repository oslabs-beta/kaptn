import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { Typography } from '@mui/material';
import { AppBar } from '@mui/material';
import Container from '@mui/material/Container';
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgb(16,10,54)',
        backgroundColor: 'rgb(16,10,54)',
        height: '100vh',
        mt: 0,
        webkitAppRegion: 'drag',
        position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            margin: 0,
            padding: 0,
        webkitAppRegion: 'drag',
        position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            margin: 0,
            padding: 0,
      }}
    >
      <AppBar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center',
          backgroundColor: '#22145a',
          webkitAppRegion: 'drag',
          height: '35px',
        }}
        position='static'
      >
        <Container sx={{ width: '100%', webkitAppRegion: 'drag' }}>
          <Typography
            variant='h6'
            noWrap
            component='a'
            fullWidth
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Roboto',
              fontWeight: 500,
              fontSize: '13pt',
              letterSpacing: '.5px',
              color: 'white',
              textDecoration: 'none',
              mt: '5px'
            }}
          >
            kaptn
          </Typography>
        </Container>
      </AppBar>
      <Box
        src='../src/assets/kaptn.ico'
        sx={{
          height: '150px',
          width: '150px',
          mb: 4,
          mt: 4
        }}
        component='img'
        >
      </Box>
      <Box component='form' onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Typography
            component='h1'
            variant='h3'
            sx={{
              mb: 6,
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: 70,
              letterSpacing: '.1 rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Login
          </Typography> */}
          <TextField
            type='text'
            name='username'
            label='Username'
            fullWidth
            username={username}
            sx={{
              mb: 3,
              // backgroundColor: 'white',
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
              // backgroundColor: 'white',
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
            // backgroundColor: 'transparent',
            border: '1px solid #68617f',
            flexDirection: 'column',
            alignItems: 'center',
            letterSpacing: '1.5px',
            backgroundColor: '#22145a',
            mt: 2,
            mb: 2,
            ':hover': {
              backgroundColor: 'rgb(16,10,54)'
            }
          }}
        >
          Login
        </Button>
        <Typography
          variant='h6'
          sx={{
            fontFamily: 'Roboto',
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
              backgroundColor: 'rgb(16,10,54)'
            }
          }}
        >
        Sign Up
        </Button>
      </Box>
    </Box>
  );
}
export default Login;