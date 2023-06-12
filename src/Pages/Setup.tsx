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
  OutlinedInput,
  ListItemText,
  Checkbox,
  Backdrop,
  useTheme,
} from '@mui/material';
import { Box, styled, lighten, darken } from '@mui/system';
import Grid from '@mui/system/Unstable_Grid';
import CommandLine from '../components/CommandLine.jsx';
import Terminal from '../components/Terminal.jsx';
import Sidebar from '../components/Sidebar.jsx';
import EastIcon from '@mui/icons-material/East';
import commands from '../components/commands.js';

const { ipcRenderer } = require('electron');

//for step 4 text to appear below without eslint/prettier error, assigned to variable here
const step4 = `4. INPUT COMMANDS --->`;

//section header (e.g. beginner, intermediate, etc) rules for grouped "command" option
const BeginnerHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  margin: '0px',
  color: '#ffffff',
  backgroundColor: '#352a68',
  webkitScrollbarColor: 'red yellow',
}));

//style for grouped commands
const GroupItems = styled('ul')({
  padding: 0,
  color: '#ffffff',
  backgroundColor: '#5c4d9a',
});

function Setup() {
  const [verb, setVerb] = React.useState<string>('');
  const [type, setType] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [currDir, setCurrDir] = React.useState<string>('NONE SELECTED');
  const [userInput, setUserInput] = React.useState<string>('');
  const [command, setCommand] = useState<string>('');
  const [response, setResponse] = useState<
    Array<{ command: string; response: { [key: string]: string } }>
  >([]);
  const [editOpen, setEditOpen] = React.useState<boolean>(false);
  const [imgPath, setImgPath] = useState<string>('NONE ENTERED');
  const [imgField, setImgField] = useState<string>('Enter .IMG');
  const [flags, setFlags] = useState<Array<string>>([]);

  //for light/dark mode toggle
  const theme = useTheme();

  //maps grouped command options alphabetically including if numbered
  const options = commands.map((option) => {
    const firstLetter = commands[0].category;
    return {
      firstLetter: /[{commands[0].category}]/.test(firstLetter)
        ? '0-9'
        : firstLetter,
      ...option,
    };
  });
  // handles updating img path updating and submission
  function keyPress(e) {
    e.preventDefault();
    if (e.key === 'Enter') {
      setImgPath(e.target.value);
    }
  }
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
  // handles name field changes
  const handleNameChange = (event) => {
    const {
      target: { value },
    } = event;
    setName(value);
  };

  // Set current directory state
  const handleUploadDirectory = (event) => {
    let path = event.target.files[0].path.split('');
    while (path[path.length - 1] !== '/') {
      path.pop();
    }
    let absPath = path.join('');
    setCurrDir(absPath);
  };
  //sets image submission
  const handleImgUpload = (event) => {
    setImgPath(event.target.value);
    setImgField('Image Entered');
  };
  // updates img text field as typed
  const handleImgField = (e) => {
    setImgField(e.target.value);
  };

  // Set the command state based on current inputs
  useEffect(() => {
    ipcRenderer.on('post_command', (event, arg) => {
      const newResponseState = [
        ...response,
        { command: command, response: arg },
      ];
      setResponse(newResponseState);
    });

    let newCommand = '';
    if (verb !== '') newCommand += ' ' + verb;
    if (type !== '') newCommand += ' ' + type;
    if (name !== '') newCommand += ' ' + name;
    if (flags.length)
      flags.forEach((flag) => {
        newCommand += ' ' + flag;
      });
    if (userInput !== '') newCommand += ' ' + userInput;
    setCommand(newCommand);
  });

  // Handle the command input submit event
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currDir === 'NONE SELECTED')
      return alert('Please choose working directory');

    ipcRenderer.send('post_command', { command, currDir });
  };

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
        disableEqualOverflow
        width={'100vw'}
        height={'95vh'}
        sx={{ pt: 3, pb: 3 }}
        style={{ overflow: 'hidden' }}
      >
        {/* ----------------SIDE BAR---------------- */}
        <Sidebar spacing={1} />

        {/* ----------------MAIN CONTENT---------------- */}
        <Grid id='main-content' container xs={11} height='85%' >
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
                bgcolor: theme.palette.mode === 'dark' ? '#2a2152' : '#c9c4f9',
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
                bgcolor: theme.palette.mode === 'dark' ? '#2a2152' : '#c9c4f9',
                marginBottom: '25px',
              }}
            >
              {/* --------------------------- IMAGE CREATION SECTION --------------------- */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: theme.palette.mode === 'dark' ? '#9e9d9d' : 'black',
                  paddingBottom: '10px',
                  fontSize: '10.5px',
                }}
              >
                1. IMPORT IMAGE
              </div>
              <div
                style={{
                  backgroundColor: '#716a8e',
                  width: '170',
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

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px',
                  fontSize: '9px',
                }}
              >
                {imgPath}
              </div>
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
                  label='Enter .IMG'
                  value={imgField}
                  variant='outlined'
                  // onChange={handleImgField}
                  onKeyDown={(ev) => {
                    ev.preventDefault();
                    if (imgField === 'Enter .IMG') {
                      setImgField(ev.key);
                    }
                    // else if (ev.key === 'Enter') {
                    //   // Do code here
                    //   handleImgUpload(ev);
                    // } else {
                    //   console.log('imgFIeld is', imgField);

                    //   console.log('imgPath is', imgPath);
                    //   setImgField(imgField + ev.key);
                    // }
                    else {
                      if (ev.key === 'Enter') {
                        handleImgUpload(ev);
                        setImgField(imgField);
                      } else if (
                        ev.key === 'Meta' ||
                        ev.key === 'Alt' ||
                        ev.key === 'Dead' ||
                        ev.key === 'ArrowLeft' ||
                        ev.key === 'ArrowUp' ||
                        ev.key === 'ArrowDown' ||
                        ev.key === 'ArrowRight' ||
                        ev.key === 'Shift'
                      ) {
                      } else if (ev.key === 'Backspace') {
                        setImgField(imgField.slice(0, imgField.length - 1));
                      } else {
                        setImgField(imgField + ev.key);
                      }
                    }
                  }}
                />
              </Box>
            </Box>
            {/* ------------------- CHOOSE DIRECTORY SECTION ---------------------------- */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '5px',
                width: '100%',
                borderRadius: '5px',
                bgcolor: theme.palette.mode === 'dark' ? '#2a2152' : '#c9c4f9',
                marginBottom: '25px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: theme.palette.mode === 'dark' ? '#9e9d9d' : 'black',
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
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#150f2d' : '#8881ce',
                }}
              >
                CHOOSE DIRECTORY
                <input
                  type='file'
                  // @ts-expect-error
                  directory=''
                  webkitdirectory=''
                  hidden
                  onChange={handleUploadDirectory}
                />
              </Button>
            </Box>
            {/* ------------------------- CREATE YAML SECTION  ------------------------------- */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                // colored box behind buttons
                bgcolor: theme.palette.mode === 'dark' ? '#2a2152' : '#c9c4f9',
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
                  color: theme.palette.mode === 'dark' ? '#9e9d9d' : 'black',
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

              <Button
                onClick={handleEditOpen}
                style={{
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#150f2d' : '#8881ce',
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
                Configure .YAML FILE
              </Button>
              {/* ----------- Backdrop is greyed out background during popup ----------------- */}
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
                {/* ------- Paper is modal / popup --------------------------------------- */}
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
            {/* --------------- STEP 4 INPUT COMMANDS --- TEXT ONLY -- SECTION ---------- */}

            <Box
              style={{
                paddingTop: '24px',
                paddingLeft: '15px',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              width='100%'
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  INPUT COMMANDS
                </div>
                <EastIcon style={{ marginLeft: '5px', height: '30px' }} />
              </div>
            </Box>
          </Grid>

          {/* ----------------TERMINAL CLI---------------- */}

          <Grid
            id='terminal-cli'
            xs={9}
            container
            justifyContent='center'
            alignContent='start'
            style={{ height: '715px' }}
          >
            {/* ----------------TERMINAL---------------- */}
            <Terminal response={response} />

            {/* ----------------COMMAND LINE---------------- */}
            <div
              style={{
                // border: '1px solid',
                borderRadius: '3px',
                // background:
                //   theme.palette.mode === 'dark' ? '#0e0727' : '#e6e1fb',
                // border: '2px solid #c6bebe',
                height: '60px',
                width: 'auto',
                marginTop: '20px',
                marginBottom: '30px',
                marginLeft: '5px',
                fontFamily: 'monospace',
                padding: '5px',
                zIndex: '100',
                alignContent: 'start',
              }}
            >
              <CommandLine
                width='100%'
                handleSubmit={handleSubmit}
                setUserInput={setUserInput}
                userInput={userInput}
                command={command}
                border='0px transparent'
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
                <Autocomplete
                  disablePortal
                  id='combo-box-demo'
                  options={options.sort(
                    (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
                  )}
                  groupBy={(option) => option.category}
                  getOptionLabel={(option) => option.title}
                  onInputChange={(e, newInputValue) => {
                    console.log('newInputValue is', newInputValue);
                    setVerb(newInputValue);
                    const newCommand = verb + ' ' + type + ' ' + name;
                    setCommand(newCommand);
                    // setCommand(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label='Commands' />
                  )}
                  renderGroup={(params) => (
                    <li
                      style={{
                        color: '#ffffff',
                        fontSize: '13px',
                      }}
                      key={params.key}
                    >
                      <BeginnerHeader
                        style={{
                          color: '#ffffff',
                          fontSize: '14px',
                        }}
                      >
                        {params.group}
                      </BeginnerHeader>
                      <GroupItems
                        style={{
                          color: '#ffffff',
                          fontSize: '14px',
                        }}
                      >
                        {params.children}
                      </GroupItems>
                    </li>
                  )}
                />
              </Grid>

              {/* ---------------- TYPES FIELD ------------------------------------- */}

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

              {/* ---------------- NAMES FIELD ------------------------------------- */}

              <Grid id='name' xs={2}>
                <form
                  onChange={handleNameChange}
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <TextField
                    id='outlined-basic'
                    label='Name'
                    variant='outlined'
                  />
                </form>
              </Grid>

              {/* ---------------- FLAGS DROPDOWN ------------------------------------- */}

              <Grid id='flag' xs={3}>
                <FormControl fullWidth>
                  <InputLabel id='flag-label'>Flags</InputLabel>
                  <Select
                    labelId='flag-label'
                    id='flag-label'
                    multiple
                    value={flags}
                    onChange={handleFlags}
                    input={<OutlinedInput label='Flags' />}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {flagList.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={flags.indexOf(name) > -1} />
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
