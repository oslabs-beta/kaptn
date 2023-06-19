import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { Typography } from '@mui/material';
import { ColorModeContext, useMode } from '../theme.ts';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';

function Login() {
  const [password, setInputPassword] = useState('');
  const [username, setInputUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  //for light/dark mode toggle
  const theme = useTheme();

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
      console.log(err);
    }
  }
  // When log in button is clicked, invoke checkLogin function
  function handleSubmit(event) {
    event.preventDefault();
    const callCheckLogin = async () => {
      const response = await checkLogin(username, password);

      // If the request was successful, set the login state to true and redirect to the dashboard
      if (!response.err) {
        setLoggedIn(true);
        navigate('/dashboard');
      } else {
        // If the request was unsuccessful, send an alert to the user
        alert('Wrong username or password');
      }
    };
    callCheckLogin();
  }

  return (
    <Grid
      id='login-content'
      container
      alignContent='center'
      alignItems='center'
      justifyContent='center'
      width={'100%'}
      // height={'95vh'}
      style={{
        marginTop: '32px',
        height: '100%',
      }}
    >
      <Grid
        id='main-content-center'
        container
        flexDirection='column'
        alignItems='center'
        justifyContent='space-evenly'
        sx={{
          textAlign: 'center',
          width: '100%',
          backgroundColor: theme.palette.mode === 'dark' ? '' : '#c8c8fc',
        }}
        height={'96vh'}
      >
        <Box
          src='./kaptn4ico.png'
          sx={{
            marginTop: '40px',
            height: '270px',
            width: '270px',
          }}
          component='img'
          width='100%'
        ></Box>
        <Box id='subtitle'>
          <Typography
            variant='h2'
            // alignText='center'
            sx={{ fontWeight: 'bold', fontFamily: 'Outfit', fontSize: '42px' }}
            style={{
              color: theme.palette.mode === 'dark' ? 'white' : '#3c3c9a',
              textShadow:
                theme.palette.mode === 'dark'
                  ? '1px 1px 5px rgb(0, 0, 0, 0.3)'
                  : '1px 1px 5px rgb(0, 0, 0, 0.0)',
            }}
          >
            Take command of Kubernetes.
          </Typography>
        </Box>

        <Link to='/dashboard'>
          <Button
            variant='contained'
            type='submit'
            size='large'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              fontSize: '16px',
              fontFamily: 'Outfit',
              transitionProperty: 'background-image',
              transition: 'all 2s',
              mozTransition: 'all 2s',
              webkitTransition: 'all 2s',
              oTransition: 'all 2s',
              border:
                theme.palette.mode === 'dark'
                  ? '1px solid #68617f'
                  : '3px solid #9621f9',
              letterSpacing: '1.5px',
              backgroundColor:
                theme.palette.mode === 'dark' ? '#22145a' : '#3c3c9a',
              // mt: 2,
              // mb: 3,
              ':hover': {
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#a021f9' : '#8e77ec',
                backgroundImage:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(to right top, #dc44e3, #c53fe0, #ac3add, #9237d9, #7634d5, #6c33d6, #6132d8, #5432d9, #5f32e1, #6933e9, #7433f0, #7f32f8)'
                    : 'linear-gradient(to right bottom, #5d2aed, #7329e7, #8529e1, #932adc, #9f2cd6, #a12dd7, #a32ed8, #a52fd9, #9e2fe0, #952fe8, #8b30f0, #7f32f8);',
                border:
                  theme.palette.mode === 'dark'
                    ? '1px solid #af21f9'
                    : '3px solid #9621f9',
              },
            }}
          >
            Start kaptn
          </Button>
        </Link>
        {/* </Grid> */}
        <Typography variant='caption'>Copyright © Kaptn 2023. </Typography>
        {/* </Box> */}
        {/* </Grid> */}
      </Grid>
    </Grid>
  );
}
export default Login;
