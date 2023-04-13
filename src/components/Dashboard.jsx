import React from 'react';
import { useState } from 'react';
import viteLogo from '/vite.svg';
import '../App.css';
import Button from '@mui/material/Button';
import Box from '@mui/system/Box';
import Grid from '@mui/system/Unstable_Grid';
import styled from '@mui/system/styled';
import Paper from '@mui/material/Paper';
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import AdbIcon from '@mui/icons-material/Adb';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CommandLine from './CommandLine.jsx';
import Terminal from './Terminal.jsx';

function Dashboard() {
  const [type, setType] = React.useState('');
  const [name, setName] = React.useState('');
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(false);

  const postCommand = async (command) => {
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
      const cliResponse = await response.json();
      console.log('the server responded: ', cliResponse);
      return cliResponse;
    } catch (e) {
      console.log(e);
      setError(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('enter button clicked');
    console.log('command ', command);
    // Fetch request
    const getCliResponse = async () => {
      const cliResponse = await postCommand(command);
      const newResponseState = [
        ...response,
        { command: command, response: cliResponse },
      ];
      setResponse(newResponseState);
    };
    getCliResponse();
    console.log('response ', response);
  };

  const handleType = (event) => {
    setType(event.target.value);
  };

  const handleName = (event) => {
    setName(event.target.value);
    // console.log(name);
  };

  const pages = ['Easy Setup', 'Manage Pods', 'Tutorials'];
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setName(event.target.value);
      const newCommand = command + ' ' + e.target.value;
      setCommand(newCommand);
      console.log('enter pressed');
    }
  };
  // console.log(name);

  const commands = [
    { label: 'get', year: 1994 },
    { label: 'apply', year: 1972 },
    { label: 'create', year: 1974 },
    { label: 'patch', year: 1974 },
    { label: 'logs', year: 1974 },
  ];

  const types = [
    { label: 'node' },
    { label: 'nodes' },
    { label: 'pod' },
    { label: 'pods' },
    { label: 'configmap' },
    { label: 'deployment' },
    { label: 'events' },
    { label: 'secret' },
    { label: 'service' },
    { label: 'services' },
  ];
  return (
    <div style={{ backgroundColor: '#5b5b5c', height: '100vh' }}>
      <Box display='flex' flexDirection='column'>
        <AppBar style={{ backgroundColor: '#1f1f1f' }} position='static'>
          <Container maxWidth='xl'>
            <Toolbar disableGutters>
              <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography
                variant='h6'
                noWrap
                component='a'
                href='/'
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1 rem',
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                kaptn
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleOpenNavMenu}
                  color='white'
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign='center'>{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
              <Typography
                variant='h5'
                noWrap
                component='a'
                href=''
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                kaptn
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title='Open settings'>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt='Remy Sharp'
                      src='/static/images/avatar/2.jpg'
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id='menu-appbar'
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign='center'>{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>

      {/* COMMANDS, TYPES, NAMES, TAGS */}

      <Grid container spacing={2} sx={{ m: 2, color: 'white' }}>
        <Grid item md={1}></Grid>
        <Grid item md={3}>
          <Box
            sx={{
              border: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#414141',
              color: 'white',
            }}
          >
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              options={commands}
              sx={{ width: 200, color: 'white' }}
              onInputChange={(e, newInputValue) => setCommand(newInputValue)}
              renderInput={(params) => (
                <TextField {...params} label='Commands' />
              )}
            />
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              options={types}
              sx={{ width: 200 }}
              onInputChange={(e, newInputValue) => {
                const newCommand = command + ' ' + newInputValue;
                setCommand(newCommand);
              }}
              renderInput={(params) => <TextField {...params} label='Types' />}
            />
            <form
              onChange={(e) => {
                setName(e.target.value);
                console.log(name);
              }}
              onSubmit={(e) => {
                const newCommand = command + ' ' + name;
                setCommand(newCommand);
              }}
              value={name}
            >
              <TextField
                style={{ minWidth: 200 }}
                id='outlined-basic'
                label='Name'
                variant='outlined'
              />
            </form>
          </Box>
        </Grid>
        <Grid item md={8}>
          {/* olivia's world */}
          <div
            style={{
              border: '2px solid #c6bebe',
              background: '#4c4747',
              height: '400px',
              width: 'auto',
              color: 'white',
            }}
          >
            <Terminal response={response} />
          </div>
          <div
            style={{
              border: '2px solid #c6bebe',
              background: '#4c4747',
              height: '100px',
              width: 'auto',
              marginTop: '5px',
              color: 'white',
            }}
          >
            <CommandLine
              handleSubmit={handleSubmit}
              postCommand={postCommand}
              setCommand={setCommand}
              command={command}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
