import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { Link } from 'react-router-dom';

function Signup() {
  const [password, setInputPassword] = useState('');
  const [username, setInputUsername] = useState('');
  const [email, setInputEmail] = useState('');

  // Send request to the server to create a new user
  async function createUser(username, email, password) {
    try {
      const response = await fetch('/user/createuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      // If the response comes back successful, parse it from JSON and return
      const parsedResponse = await response.json();
      return parsedResponse;
    } catch (err) {
      console.log(err);
    }
  }

  // When sign up button is clicked, invoke createUser function
  function handleClick(event) {
    event.preventDefault();

    // Handle invalid submissions
    if (username === '' || password === '' || email === '')
      alert('Missing username, email, or password. Please try again');

    const callCreateUser = async () => {
      const response = await createUser(username, email, password);
      // If there are no errors, redirect to the login page
      if (response) navigate('/');
    };
    callCreateUser();
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
            Create Your Account
          </Typography>
        </Box>
        <Grid id='below-subtitle' container width={'85%'}>
          <Box
            id='input-boxes'
            component='form'
            onSubmit={handleClick}
            width='100%'
            sx={{ display: 'flex', flexDirection: 'column' }}
            xs={4}
          >
            <TextField
              type='text'
              name='username'
              label='Username'
              username={username}
              fullWidth
              sx={{
                mb: 3,
              }}
              onChange={(e) => {
                setInputUsername(e.target.value);
              }}
            />
            <TextField
              type='text'
              name='email'
              label='Email'
              email={email}
              fullWidth
              sx={{
                mb: 3,
              }}
              onChange={(e) => {
                setInputEmail(e.target.value);
              }}
            />
            <TextField
              type='password'
              name='password'
              label='Password'
              password={password}
              fullWidth
              sx={{
                mb: 3,
              }}
              onChange={(e) => {
                setInputPassword(e.target.value);
              }}
            />
            <Button
              variant='contained'
              type='submit'
              fullWidth
              size='large'
              href='/'
              sx={{
                display: 'flex',
                color: 'white',
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
              Create Account
            </Button>
            <Typography variant='body1'>Already have an account?</Typography>
            <Grid
              id='sign-up'
              container
              justifyContent='center'
              alignItems='center'
            >
              <Link to='/'>
                <Button
                  variant='contained'
                  type='submit'
                  size='small'
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
                  Sign In
                </Button>
              </Link>
            </Grid>
            <Typography variant='caption'>Copyright © Kaptn 2023. </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid id='main-content-right' xs={4}></Grid>
    </Grid>
  );
}

export default Signup;
