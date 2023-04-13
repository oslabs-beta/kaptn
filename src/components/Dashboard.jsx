import React from 'react';
import { useState } from 'react';
import viteLogo from '/vite.svg';
import '../App.css';
import {
  Button,
  Paper,
  InputLabel,
  Select,
  NativeSelect,
  MenuItem,
  FormControl,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  Autocomplete,
  createFilterOptions,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import Grid from '@mui/system/Unstable_Grid';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import zIndex from '@mui/material/styles/zIndex';
import SettingsBackupRestoreOutlinedIcon from '@mui/icons-material/SettingsBackupRestoreOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SideNav from './Sidebar';
// import { makeStyles } from "@mui/styles";

function Dashboard() {
  const [commands, setCommands] = React.useState('');
  const [type, setType] = React.useState('');
  const [name, setName] = React.useState('');

  const MyTextField = styled(TextField)({
    // color: 'darkslategray',
    color: '#edeaea',
    background: '#767474',
    height: '56px',
    borderRadius: 4,
  });

  const handleCommands = (event) => {
    setCommands(event.target.value);
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

      console.log('enter pressed');
    }
  };
  // console.log(name);

  const commandList = [
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
    
    <div
      style={{
        background: '#5b5b5c',
        color: 'white',
        height: '100vh',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        margin: 0,
        padding: 0,
      }}
    >
      {/* <SideNav /> */}
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

      {/* ------------------ COMMANDS, TYPES, NAMES, TAGS --------------------------------------- */}

      <Grid container spacing={2} sx={{ m: 2, color: 'white' }}>
        {/* --------SIDEBAR---------- */}
        <Grid item md={1}>
        <SideNav />

          {/* ------------------------- OLD SIDEBAR BELOW--------------------- */}
          {/* <div
            style={{
              position: 'absolute',
              left: '0',
              top: '69px',
              backgroundColor: '#272727',
              alignItems: 'center',
              padding: '5px',
              height: '100%',
              width: '50px',
              // borderRadius: '4px',
            }}
          >
            <div style={{ marginTop: '10px', paddingLeft: '10px' }}>
              <SettingsBackupRestoreOutlinedIcon />
            </div>
            <div style={{ marginTop: '10px', paddingLeft: '10px' }}>
              <LocalLibraryOutlinedIcon />
            </div>
            <div style={{ marginTop: '10px', paddingLeft: '10px' }}>
              <ManageAccountsOutlinedIcon />
            </div>
          </div> */}
        </Grid>
        {/* ------------- COMMANDS drop down text field -------------------- */}
        <Grid item md={3}>
          <Box
            sx={{
              // border: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#2e2d2d',
              color: '#edeaea',
              padding: '15px',
              width: '190px',
              borderRadius: '5px',
            }}
          >
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              options={commandList}
              sx={{
                width: 200,
                background: '#767474',
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Commands'
                  style={{ color: 'pink' }}
                />
              )}
            />
            <br />
            {/* ------------- TYPE drop down text field -------------------- */}
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              options={types}
              sx={{
                width: 200,
                background: '#767474',
                zIndex: 1000,
              }}
              renderInput={(params) => <TextField {...params} label='Types' />}
            />
            <br />
            {/* ------------- NAME text field -------------------- */}
            <MyTextField
              style={{ minWidth: 200 }}
              id='outlined-basic'
              label='Name'
              variant='outlined'
              onKeyDown={handleKeyDown}
              // onInput={handleName}
            />
            <br />
            {/* ------------- MORE INFO pane/field -------------------- */}
            <Box
              sx={{
                height: '260px',
                // border: 1,
                minWidth: 200,
                background: '#767474',
                borderRadius: '4px',
                fontFamily: 'Monospace',
              }}
            >
              Click here for more info about your inputs
            </Box>
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
              color: '#edeaea',
              fontFamily: 'monospace',
              padding: '5px',
            }}
          >
            Terminal Logs
          </div>
          <div
            style={{
              border: '2px solid #c6bebe',
              background: '#4c4747',
              height: '100px',
              width: 'auto',
              marginTop: '5px',
              color: '#edeaea',
              fontFamily: 'monospace',
              padding: '5px',
            }}
          >
            Command Line
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
