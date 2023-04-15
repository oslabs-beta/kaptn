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
    <Box sx={{ display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              backgroundColor: '#5b5b5c',
              height: '100vh', 
              mt: 0}}>
      <AppBar style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', backgroundColor: '#1f1f1f' }} position='static'>
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
          onSubmit={createUser} 
          sx={{ display: 'flex', 
                width: '50%',
                flexDirection: 'column', 
                alignItems: 'center', 
                mt: 6}}>
        <Typography 
            component='h1' 
            variant='h3'
            sx={{
              fontFamily: 'monospace',
              fontWeight: 75,
              fontSize: 65,
              letterSpacing: '.1 rem',
              color: 'white',
              textDecoration: 'none',
              mb: 6
            }}
            >Create Account</Typography>
            <TextField               
              type="text"
              name="username"
              label = 'Username'
              username={inputUsername}
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
              email={inputEmail}
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
              password={inputPassword}
              fullWidth
              sx = {{ 
                    mb: 3,
                    backgroundColor: 'white' }}
              onChange={(e) => {
                setInputPassword(e.target.value);
              }} />
            <Button 
            type='submit' 
            variant='contained' 
            fullWidth>
            <Link to = '/'>
            Create Account
            </Link>
            </Button>
        </Box>
    </Box>
  )
}

export default Signup;
