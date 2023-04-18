import React from 'react';
import { useState, useEffect } from 'react';
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
import CommandLine from './CommandLine.jsx';
import Terminal from './Terminal.jsx';
import Topbar from './Topbar';
import { ColorModeContext, useMode } from '../theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

// import { makeStyles } from "@mui/styles";

function Dashboard() {
  const [verb, setVerb] = React.useState('');
  const [type, setType] = React.useState('');
  const [name, setName] = React.useState('');
  const [currDir, setCurrDir] = React.useState('NONE SELECTED');
  const [userInput, setUserInput] = React.useState('');
  const [command, setCommand] = useState('');
  const [tool, setTool] = useState('');
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(false);
  const [flags, setFlags] = React.useState([]);
  const [theme, colorMode] = useMode();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const flagList = [
    '-o wide',
    '--force',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];

  const handleFlags = (event) => {
    const {
      target: { value },
    } = event;
    setFlags(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const MyTextField = styled(TextField)({
    // color: 'darkslategray',
    color: '#edeaea',
    // background: '#767474',
    height: '56px',
    borderRadius: 4,
  });

  const handleUploadDirectory = (event) => {
    let path = event.target.files[0].path.split('');
    while (path[path.length - 1] !== '/') {
      path.pop();
    }
    let absPath = path.join('');
    console.log('path is ', absPath);
    setCurrDir(absPath);
  };

  // Set the correct command based on current inputs
  useEffect(() => {
    let newCommand = '';
    if (tool !== '') newCommand += tool;
    if (verb !== '') newCommand += ' ' + verb;
    if (type !== '') newCommand += ' ' + type;
    if (name !== '') newCommand += ' ' + name;
    if (userInput !== '') newCommand += ' ' + userInput;
    setCommand(newCommand);
  });

  // Post the command to the server
  const postCommand = async (command, currDir) => {
    console.log('currDir', currDir);
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: command, currDir: currDir }),
      });
      const cliResponse = await response.json();
      console.log('the server responded: ', cliResponse);
      return cliResponse;
    } catch (e) {
      console.log(e);
      setError(true);
    }
  };

  // Handle the CLI submit event
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('enter button clicked');
    if (currDir === 'NONE SELECTED')
      return alert('Please choose working directory');
    console.log('command ', command);
    const getCliResponse = async () => {
      const cliResponse = await postCommand(command, currDir);
      // Filter for errors
      if (cliResponse.err) alert('Invalid command. Please try again');
      // Update response state with the returned CLI response
      else {
        const newResponseState = [
          ...response,
          { command: command, response: cliResponse },
        ];
        setResponse(newResponseState);
      }
    };

    // Invoke a fetch request to the server
    getCliResponse();
  };

  const getCurrentPath = (e) => {};

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
    <div id='dashboard'>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Topbar />
          {/* Wrap the entire dashboard in a grid */}
          {/* <Grid container spacing={1} sx={{ m: 2, color: 'white' }}> */}
          {/* ----------------SIDE BAR---------------- */}
          <SideNav />
          {/* ----------------TERMINAL---------------- */}

          <Grid
            id='dashboard'
            width='75%'
            position='absolute'
            right='0'
            paddingRight='20px'
            spacing={0}
          >
            <Terminal response={response} />

            <Grid>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '10px',
                }}
              >
                {' '}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    color: '#9e9d9d',
                    paddingBottom: '10px',
                    letterSpacing: '2px',
                    fontSize: '11px',
                  }}
                >
                  WORKING DIRECTORY:
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '8px',
                    fontSize: '9px',
                    color: '#7a709b',
                  }}
                >
                  {currDir}
                </div>
                <Button
                  variant='contained'
                  component='label'
                  style={{
                    backgroundColor: 'transparent',
                    // color: '#2a2a2a',
                    border: '1px solid #68617f',
                    width: '170px',
                    marginBottom: '10px',
                    fontSize: '9px',
                    letterSpacing: '1.5px',
                  }}
                >
                  CHOOSE DIRECTORY
                  <input
                    type='file'
                    directory=''
                    webkitdirectory=''
                    hidden
                    onChange={handleUploadDirectory}
                  />
                </Button>
              </div>
              <div
                style={{
                  backgroundColor: '#7a709b',
                  width: 'auto',
                  height: '1px',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9e9d9d',
                  padding: '15px',
                  // letterSpacing: '2px',
                  // paddingRight: '20px',
                  fontSize: '11px',
                  // width: '75px',
                }}
              >
                <div style={{ paddingRight: '20px' }}>INPUTS:</div>
                {/* </div> */}
                <Autocomplete
                  defaultValue={'kubectl'}
                  disablePortal
                  options={['kubectl']}
                  style={{
                    width: 200,
                    marginRight: '10px',
                    minWidth: '200',
                    // background: '#767474',
                  }}
                  onInputChange={(e, newInputValue) => {
                    setTool(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{ minWidth: 200 }}
                      label='kubectl'
                    />
                  )}
                />
                <br />
                <Autocomplete
                  disablePortal
                  id='combo-box-demo'
                  options={commandList}
                  style={{
                    width: 200,
                    marginRight: '10px',
                    minWidth: '200',
                    // background: '#767474',
                  }}
                  onInputChange={(e, newInputValue) => {
                    setVerb(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{ minWidth: 200 }}
                      label='Commands'
                    />
                  )}
                />
                <br />
                {/* ------------- TYPE drop down text field -------------------- */}
                <Autocomplete
                  disablePortal
                  id='combo-box-demo'
                  options={types}
                  style={{ minWidth: 200 }}
                  sx={{
                    width: 200,
                    // second autocomplete
                    // background: '#767474',
                    // zIndex: 1000,
                  }}
                  onInputChange={(e, newInputValue) => {
                    setType(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label='Types' />
                  )}
                />
                <br />
                <form
                  onChange={(e) => {
                    setName(e.target.value);
                    console.log(name);
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  value={name}
                >
                  <TextField
                    style={{ minWidth: 200, marginLeft: '10px' }}
                    id='outlined-basic'
                    label='Name'
                    variant='outlined'
                  />
                </form>
                {/* ---------------------------- FLAGS -------------------------------- */}
                <div>
                  <FormControl style={{ width: '150px', marginLeft: '10px' }}>
                    <InputLabel id='demo-multiple-checkbox-label'>
                      Flags (optional)
                    </InputLabel>
                    <Select
                      labelId='demo-multiple-checkbox-label'
                      id='demo-multiple-checkbox'
                      multiple
                      value={flagList}
                      onChange={handleFlags}
                      input={<OutlinedInput label='Flags (optional)' />}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                    >
                      {flagList.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={flagList.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              {/* </Box> */}
            </Grid>
            <CommandLine
              width='100%'
              handleSubmit={handleSubmit}
              postCommand={postCommand}
              setUserInput={setUserInput}
              userInput={userInput}
              command={command}
            />
          </Grid>
          {/* </Grid> */}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
}

export default Dashboard;
