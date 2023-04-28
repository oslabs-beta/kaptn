import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { Typography } from '@mui/material';
import { ColorModeContext, useMode } from '../theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';

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
    <Grid
      id='main-content'
      container
      alignContent='center'
      alignItems='center'
      height={'95vh'}
    >
      <Grid id='main-content-left' xs={4}></Grid>
      <Grid
        id='main-content-center'
        container
        xs={4}
        flexDirection='column'
        alignItems='center'
        justifyContent='space-evenly'
        sx={{
          textAlign: 'center',
        }}
        height={'95vh'}
      >
        <Box
          src='../../build/icon.ico'
          sx={{
            height: '200px',
            width: '200px',
          }}
          component='img'
          width='100%'
        ></Box>
        <Box id='subtitle'>
          <Typography
            variant='h2'
            alignText='center'
            sx={{ fontWeight: 'bold' }}
          >
            Take command of Kubernetes.
          </Typography>
        </Box>
        <Grid id='below-subtitle' container width={'85%'}>
          <Box
            id='input-boxes'
            component='form'
            onSubmit={handleSubmit}
            width='100%'
            sx={{ display: 'flex', flexDirection: 'column' }}
            xs={4}
          >
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
                sx={
                  {
                    mb: 3,
                  }
                }
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
                sx={
                  {
                    // mb: 3,
                  }
                }
                onChange={(e) => {
                  setInputPassword(e.target.value);
                }}
              />
            </Box>
            <Button
              variant='contained'
              type='submit'
              fullWidth
              size="large"
              sx={{
                display: 'flex',
                border: '1px solid #68617f',
                flexDirection: 'column',
                alignItems: 'center',
                letterSpacing: '1.5px',
                backgroundColor: '#22145a',
                mt: 2,
                mb: 5,
                ':hover': {
                  backgroundColor: 'rgb(16,10,54)',
                },
              }}
            >
              Login
            </Button>
            <Typography variant='body1'>Don't have an account?</Typography>
            <Grid id='sign-up' container justifyContent='center' alignItems='center' flexDirection='column'>
            <Button
              variant='contained'
              type='submit'
              href='/signup'
              size="small"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1px solid #68617f',
                letterSpacing: '1.5px',
                backgroundColor: '#22145a',
                mt: 2,
                ':hover': {
                  backgroundColor: 'rgb(16,10,54)',
                },
              }}
            >
              Sign Up
            </Button>
            <Button
              variant='contained'
              type='submit'
              href='/dashboard'
              size="small"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1px solid #68617f',
                letterSpacing: '1.5px',
                backgroundColor: '#22145a',
                mt: 2,
                mb: 3,
                ':hover': {
                  backgroundColor: 'rgb(16,10,54)',
                },
              }}
            >
              Continue as guest
            </Button>
            </Grid>
            <Typography variant='caption'>Copyright © Kaptn 2023. </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid id='main-content-right' xs={4}></Grid>
    </Grid>
  );
}
export default Login;
