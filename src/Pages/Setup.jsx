import React from 'react';
import { useState, useEffect } from 'react';
import {
  Button,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Autocomplete,
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { Backdrop } from '@mui/material';
import { Box, styled } from '@mui/system';
import Grid from '@mui/system/Unstable_Grid';
import CommandLine from '../components/CommandLine.jsx';
import Terminal from '../components/Terminal.jsx';
import Sidebar from '../components/Sidebar';
import CommandField from '../components/CommandField';

function Setup() {
  const [verb, setVerb] = React.useState('');
  const [type, setType] = React.useState('');
  const [name, setName] = React.useState('');
  const [currDir, setCurrDir] = React.useState('NONE SELECTED');
  const [userInput, setUserInput] = React.useState('');
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState([]);
  const [editOpen, setEditOpen] = React.useState(false);

  // Set YAML edit box state
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const handleEditOpen = () => {
    setEditOpen(true);
  };

  // Flag list options
  const flagList = ['-o wide', '--force', '-f', '-o default', '-v'];

  // Set flag list state
  const handleFlags = (event) => {
    const {
      target: { value },
    } = event;
    setFlags(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  // Set current directory state
  const handleUploadDirectory = (event) => {
    let path = event.target.files[0].path.split('');
    while (path[path.length - 1] !== '/') {
      path.pop();
    }
    let absPath = path.join('');
    console.log('path is ', absPath);
    setCurrDir(absPath);
  };

  // Set the command state based on current inputs
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

  // Handle the command input submit event
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

  // IS THIS NEEDED??
  const pages = ['Easy Setup', 'Manage Pods', 'Tutorials'];
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // Type options
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
    <>
      <Grid
        id='setup-page'
        container
        disableEqualOverflow='true'
        width={'100vw'}
        height={'95vh'}
        sx={{ pt: 3, pb: 3 }}
      >
        {/* ----------------SIDE BAR---------------- */}
        <Sidebar spacing={1} />

        {/* ----------------MAIN CONTENT---------------- */}
        <Grid id='main-content' container xs={11} height='85%'>
          {/* ----------------SELECTION BOXES---------------- */}
          <Grid
            id='selections'
            xs={3}
            container
            justifyContent='center'
            alignContent='flex-start'
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
                width: '100%',
                borderRadius: '5px',
                bgcolor: '#2a2152',
                marginBottom: '20px',
              }}
            >
              <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                EASY SETUP
              </div>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '15px',
                width: '100%',
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
                  width: '100%',
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '5px',
                width: '100%',
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

              <Button
                variant='contained'
                component='label'
                style={{
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                // colored box behind buttons
                bgcolor: '#2a2152',
                padding: '15px',
                width: '100%',
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
                // paddingLeft: '15px',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
              }}
              width='100%'
            >
              4. INPUT COMMANDS ---
            </Box>
          </Grid>

          {/* ----------------TERMINAL CLI---------------- */}

          <Grid
            id='terminal-cli'
            xs={8}
            container
            justifyContent='center'
            alignContent='space-between'
          >
            {/* ----------------TERMINAL---------------- */}
            <Terminal response={response} />

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
              {/* ----------------COMMAND LINE---------------- */}
              <CommandLine
                width='100%'
                handleSubmit={handleSubmit}
                postCommand={postCommand}
                setUserInput={setUserInput}
                userInput={userInput}
                command={command}
              />
            </div>

            {/* ----------------INPUT SECTION---------------- */}
            <Grid
              id='inputs'
              container
              width='95%'
              justifyContent='space-around'
              alignItems='center'
            >
              <Grid id='commands' xs={3}>
                <CommandField
                  disablePortal
                  id='combo-box-demo'
                  onInputChange={(e, newInputValue) => {
                    setVerb(newInputValue);
                    const newCommand = verb + ' ' + type + ' ' + name;
                    setCommand(newCommand);
                    // setCommand(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label='Commands' />
                  )}
                />
              </Grid>
              <Grid id='types' xs={3}>
                <Autocomplete
                  disablePortal
                  id='combo-box-demo'
                  options={types}
                  onInputChange={(e, newInputValue) => {
                    setType(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label='Types' />
                  )}
                />
              </Grid>
              <Grid id='name' xs={3}>
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
                    id='outlined-basic'
                    label='Name'
                    variant='outlined'
                    fullWidth='true'
                  />
                </form>
              </Grid>
              <Grid id='flag' xs={3}>
                <FormControl>
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
                  >
                    {flagList.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={flagList.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Setup;
