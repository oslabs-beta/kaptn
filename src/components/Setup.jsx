import React from 'react';
import { useState, useEffect } from 'react';
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
import CommandLine from './CommandInput.jsx';
import Terminal from './Terminal.jsx';
import Topbar from './Topbar';

import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Sidebar2 from './Sidebar2';
import CommandField from './CommandField';
import { Backdrop } from '@mui/material';
// import { makeStyles } from "@mui/styles";

function Setup() {
  const [verb, setVerb] = React.useState('');
  const [type, setType] = React.useState('');
  const [name, setName] = React.useState('');
  const [currDir, setCurrDir] = React.useState('NONE SELECTED');
  const [userInput, setUserInput] = React.useState('');
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(false);
  const [flags, setFlags] = React.useState([]);
  const [editOpen, setEditOpen] = React.useState(false);

  const handleEditClose = () => {
    setEditOpen(false);
  };
  const handleEditOpen = () => {
    setEditOpen(true);
  };

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
    '-f',
    '-o default',
    '-v',
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
    // for(let i=0 ;
    console.log('path is ', absPath);
    // let FolderPath = event.target.value;
    // let absFoldPath = FolderPath;
    // console.log(absFoldPath);
    setCurrDir(absPath);
    // let value = URL.createObjectURL(event.target.files[0]);
  };

  const handleCreateYaml = (event) => {
    let path = event.target.files[0].path.split('');
    while (path[path.length - 1] !== '/') {
      path.pop();
    }
    let absPath = path.join('');
    // for(let i=0 ;
    console.log('path is ', absPath);
    // let FolderPath = event.target.value;
    // let absFoldPath = FolderPath;
    // console.log(absFoldPath);
    setCurrDir(absPath);
    // let value = URL.createObjectURL(event.target.files[0]);
  };

  // Set the correct command based on current inputs
  useEffect(() => {
    let newCommand = '';
    if (verb !== '') newCommand += verb;
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
      // Update response state with the returned CLI response
      const newResponseState = [
        ...response,
        { command: command, response: cliResponse },
      ];
      setResponse(newResponseState);
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
    <div
      style={{
        // background color
        // background: '#5b5b5c',
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
      {/* ----------------newWindowBar---------------- */}
      <Topbar
        position='absolute'
        top='0'
        right='0'
        backgroundColor='#22145a'
        height='35px'
        width='100%'
        marginBottom='5px'
      />
      <div
        style={{
          display: 'flex',
          flexStart: 'center',
          height: '35px',
          width: '88%',
          backgroundColor: '#22145a', //#06001b
          webkitAppRegion: 'drag',
          webkitUserSelect: 'none',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            backgroundColor: '#22145a', //#06001b
            webkitAppRegion: 'drag',
            webkitUserSelect: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Roboto',
            fontSize: '13pt',
            fontWeight: '500',
            letterSpacing: '0.5px',
            paddingLeft: '150px',
          }}
        >
          kaptn
        </div>
      </div>
      {/* 
      <iframe
        src='https://k8syaml.com/'
        position='absolute'
        top='50px'
        left='50px'
        width='100%'
        height='900px'
        marginRight='60px'
      ></iframe> */}

      {/* --
      ---
      ----
      ----
      ----
      ----
      --------- COMMANDS, TYPES, NAMES, TAGS -------------
      ----
      -----
      -----
      -------
      ----- */}

      <Grid container spacing={1} sx={{ m: 2, color: 'white' }}>
        {/* --------SIDEBAR---------- */}
        <Grid width='05%'>
          <Sidebar2 />
        </Grid>

        <Grid width='25%'>
          <Box
            sx={{
              // border: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // colored box behind buttons
              // bgcolor: '#2e2d2d',
              padding: '10px',
              width: '190px',
              borderRadius: '5px',
              bgcolor: '#2a2152',
              marginBottom: '20px',
              marginTop: '10px',
            }}
          >
            <div style={{ alignItems: 'center', justifyContent: 'center' }}>
              EASY SETUP
            </div>
          </Box>
          <Box
            sx={{
              // border: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // colored box behind buttons
              // bgcolor: '#2e2d2d',
              padding: '15px',
              width: '190px',
              borderRadius: '5px',
              bgcolor: '#2a2152',
              marginBottom: '25px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#9e9d9d',
                paddingBottom: '10px',
                fontSize: '11.5px',
              }}
            >
              1. CREATE/CHOOSE IMAGE (?)
            </div>
            <div
              style={{
                backgroundColor: '#716a8e',
                width: '170px',
                height: '1px',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '5px',
                fontSize: '9px',
              }}
            ></div>

            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '160px' },
              }}
              noValidate
              autoComplete='off'
            >
              <TextField
                id='outlined-basic'
                label='Enter .IMG Path'
                variant='outlined'
              />
            </Box>
          </Box>

          <Box
            sx={{
              // border: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // colored box behind buttons
              // bgcolor: '#2e2d2d',
              padding: '5px',
              width: '190px',
              borderRadius: '5px',
              backgroundColor: '#2a2152',
              marginBottom: '25px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#9e9d9d',
                paddingBottom: '10px',
                fontSize: '10.5px',
                marginTop: '10px',
              }}
            >
              2. CHOOSE WORKING DIRECTORY
            </div>
            <div
              style={{
                backgroundColor: '#716a8e',
                width: '190px',
                height: '1px',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
                fontSize: '9px',
              }}
            >
              {currDir}
            </div>

            <Button
              variant='contained'
              component='label'
              style={{
                // backgroundColor: '#767474',
                // color: '#2a2a2a',
                border: '1px solid white',
                width: '170px',
                marginBottom: '15px',
                fontSize: '12px',
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
          </Box>

          <Box
            sx={{
              // border: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // colored box behind buttons
              bgcolor: '#2a2152',
              padding: '15px',
              width: '190px',
              borderRadius: '5px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#9e9d9d',
                paddingBottom: '10px',
                fontSize: '10.5px',
              }}
            >
              3. CHOOSE/CREATE YAML FILE
            </div>
            <div
              style={{
                backgroundColor: '#716a8e',
                width: '170px',
                height: '1px',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
                fontSize: '9px',
              }}
            >
              {currDir}
            </div>
            {/* 
            <Button
              variant='contained'
              component='label'
              style={{
                // backgroundColor: '#767474',
                // color: '#2a2a2a',
                border: '1px solid white',
                width: '170px',
                marginBottom: '10px',
                fontSize: '12px',
              }}
            >
              //CREATE .YAML FILE
              <input
                type='file'
                directory=''
                webkitdirectory=''
                hidden
                onChange={handleCreateYaml}
              />
            </Button> */}

            <Button
              onClick={handleEditOpen}
              style={{
                backgroundColor: '#0d0527',
                color: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '20px',
                border: '1px solid white',
                width: '170px',
                marginBottom: '15px',
                fontSize: '12px',
              }}
            >
              CREATE .YAML FILE
            </Button>
            <Backdrop
              style={{
                color: '#white',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
              open={editOpen}
              onClick={handleEditClose}
            >
              <Paper
                onClick={handleEditClose}
                style={{
                  height: '80%',
                  width: '90%',
                  backgroundColor: 'white',
                  overflow: 'scroll',
                  color: 'black',
                  paddingLeft: '10px',
                  zIndex: '1350',
                  position: 'fixed',
                  top: '80px',
                  left: '70px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                color='black'
              >
                <div
                  style={{
                    width: '900px',
                    alignItems: 'center',
                    marginLeft: '80px',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      font: 'Roboto',
                      fontSize: '14px',
                      fontWeight: '900',
                      width: '100%',
                      paddingTop: '20px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    PLEASE USE THE TOOL BELOW TO CREATE YOUR .YAML FILE
                  </div>
                  <div
                    style={{
                      font: 'Roboto',
                      fontSize: '14px',
                      fontWeight: '500',
                      width: '100%',
                      paddingBottom: '20px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    Once you've finished, use the copy clipboard button in the
                    top right corner. <br />
                    Then click in the white space on either side to close the
                    popup, and continue following the instructions in the help
                    center.
                  </div>

                  <iframe
                    src='https://k8syaml.com'
                    width='900px'
                    height='900px'
                    style={{ alignItems: 'center' }}
                  ></iframe>
                </div>
              </Paper>
            </Backdrop>
          </Box>
          <Box
            style={{
              paddingTop: '24px',
              paddingLeft: '15px',
              fontSize: '16px',
            }}
          >
            4. INPUT COMMANDS --- >
          </Box>
        </Grid>

        {/* ------------- COMMANDS drop down text field -------------------- */}

        <Grid
          width='75.5%'
          position='absolute'
          right='0'
          paddingRight='20px'
          zIndex='99'
        >
          {/* olivia's world */}

          <div
            style={{
              border: '1px solid',
              borderRadius: '3px',
              // border: '2px solid #c6bebe',
              background: '#0e0727',
              height: '440px',
              width: 'auto',
              // color: '#edeaea',
              fontFamily: 'monospace',
              padding: '5px',
              zIndex: '100',
            }}
          >
            <Terminal response={response} />
          </div>

          <div
            style={{
              border: '1px solid',
              borderRadius: '3px',
              background: '#0e0727',
              // border: '2px solid #c6bebe',
              height: '60px',
              width: 'auto',
              marginTop: '5px',
              fontFamily: 'monospace',
              padding: '5px',
              zIndex: '100',
            }}
          >
            <CommandLine
              width='100%'
              handleSubmit={handleSubmit}
              postCommand={postCommand}
              setUserInput={setUserInput}
              userInput={userInput}
              command={command}
            />
          </div>

          <Grid>
            <Box
              sx={{
                // border: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                // colored box behind buttons
                // bgcolor: '#2e2d2d',
                paddingTop: '15px',
                width: '190px',
                borderRadius: '5px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#727171',
                  width: '300px',
                  height: '1px',
                  marginBottom: '10px',
                }}
              />

              <CommandField
                disablePortal
                id='combo-box-demo'
                style={{
                  width: 200,
                  marginRight: '10px',
                  minWidth: '200',
                  // background: '#767474',
                }}
                onInputChange={(e, newInputValue) => {
                  setVerb(newInputValue);
                  const newCommand = verb + ' ' + type + ' ' + name;
                  setCommand(newCommand);
                  // setCommand(newInputValue);
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
                <FormControl style={{ width: '193px', marginLeft: '10px' }}>
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
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Setup;
