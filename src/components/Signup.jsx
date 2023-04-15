import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { Typography } from '@mui/material';
import { AppBar } from '@mui/material';
import Container from '@mui/material/Container';

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

export default Signup