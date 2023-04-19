import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { Typography } from '@mui/material';
import { AppBar } from '@mui/material';
import Container from '@mui/material/Container';

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
      // If the response comes back, parse it from JSON and return
      const parsedResponse = await response.json();
      return parsedResponse;
    } catch (err) {
      console.error(err);
    }
  }

  // When sign up button is clicked, invoke createUser function
  function handleClick(event) {
    event.preventDefault();

    if (username === '' || password === '' || email === '')
      alert('Missing username, email, or password. Please try again');

    const callCreateUser = async () => {
      const response = await createUser(username, email, password);
      // If there are no errors, redirect to the login page
      if (response) window.location.href = 'http://localhost:4444/';
    };
    callCreateUser();
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
      }}
    >
        <AppBar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center',
          backgroundColor: '#22145a',
          webkitAppRegion: 'drag',
          height: '35px'
        }}
        position='static'
      >
        <Container sx={{ width: '100%', webkitAppRegion: 'drag' }}>
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
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
          width: '150px'
        }}
        component='img'
        >
      </Box>
        <Box component='form' 
          onSubmit={handleClick} 
          sx={{ display: 'flex', 
                width: '40%',
                flexDirection: 'column', 
                alignItems: 'center', 
                mt: 0}}>
        <Typography 
            component='h1' 
            variant='h3'
            sx={{
              fontFamily: 'Roboto',
              fontWeight: 75,
              fontSize: 30,
              letterSpacing: '.1 rem',
              color: 'white',
              textDecoration: 'none',
              mb: 4
            }}
            >Create Account</Typography>
            <TextField               
              type="text"
              name="username"
              label = 'Username'
              username={username}
              fullWidth
              sx = {{ 
                    mb: 3,
                    backgroundColor: 'white' }}
              onChange={(e) => {
                setInputUsername(e.target.value);
              }} />
              <TextField               
              type="text"
              name="email"
              label = 'Email'
              email={email}
              fullWidth
              sx = {{ 
                    mb: 3,
                    backgroundColor: 'white' }}
              onChange={(e) => {
                setInputEmail(e.target.value);
              }} />
            <TextField               
              type="password"
              name="password"
              label = 'Password'
              password={password}
              fullWidth
              sx = {{ 
                    mb: 3,
                    backgroundColor: 'white' }}
              onChange={(e) => {
                setInputPassword(e.target.value);
              }} />
            <Button 
              variant='contained'
              type='submit'
              fullWidth
              href='/'
              sx={{
                display: 'flex',
                // backgroundColor: 'transparent',
                color: 'white',
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
            Create Account
            </Button>
        </Box>
    </Box>
  )
}

export default Signup;
