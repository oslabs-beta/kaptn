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
  Modal,
  Typography,
} from '@mui/material';
import { Box, styled, lighten, darken } from '@mui/system';
import Grid from '@mui/system/Unstable_Grid';
import CommandLine from '../components/CommandLine.jsx';
import Terminal from '../components/Terminal.jsx';
import Sidebar from '../components/Sidebar2.jsx';
import EastIcon from '@mui/icons-material/East';
import commands from '../components/commands.js';
import BoltIcon from '@mui/icons-material/Bolt';
import helpDesk from './Glossary.jsx';

const { ipcRenderer } = require('electron');

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '90%',
  bgcolor: '#2c1b63',
  color: 'white',
  boxShadow: 24,
  p: 4,
  padding: '10px',
  borderRadius: '5px',
};

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
  const [shortDir, setShortDir] = React.useState<string>('NONE SELECTED');
  const [userInput, setUserInput] = React.useState<string>('');
  const [command, setCommand] = useState<string>('');
  const [response, setResponse] = useState<
    Array<{ command: string; response: { [key: string]: string } }>
  >([]);
  const [yamlOpen, setYamlOpen] = React.useState<boolean>(false);
  const [imgPath, setImgPath] = useState<string>('NONE ENTERED');
  const [imgField, setImgField] = useState<string>('Enter .IMG');
  const [flags, setFlags] = useState<Array<string>>([]);
  const [helpList, setHelpList] = useState<Array<string>>(['']);

  const [openCommand, setCommandOpen] = React.useState(false);
  const handleCommandOpen = () => setCommandOpen(true);
  const handleCommandClose = () => setCommandOpen(false);

  const [openType, setTypeOpen] = React.useState(false);
  const handleTypeOpen = () => setTypeOpen(true);
  const handleTypeClose = () => setTypeOpen(false);

  //for light/dark mode toggle
  const theme = useTheme();

  // let instantHelp = [];
  // if (verb === '' && type === '') {
  //   instantHelp = ['NONE SELECTED CHOOSE ABOVE'];
  // }
  // else if (type===''){helpList.push(<div>hey there</div>)}
  // for (let i = 0; i < helpList.length; i++) {
  //   instantHelp.push(
  //     <div >{helpList[i]}</div>
  //   );
  // }

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
  const handleYamlClose = () => {
    setYamlOpen(false);
  };
  const handleYamlOpen = () => {
    setYamlOpen(true);
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
    let absArr = absPath.split('');
    let shortArr = [];
    for (let i = absArr.length - 2; absArr[i] !== '/'; i--) {
      shortArr.unshift(absArr[i]);
    }
    shortArr.unshift('/');
    console.log('shortArr is', shortArr);
    let shortPath = shortArr.join('') + '/';
    console.log('shortpath is', shortPath);
    setShortDir('...' + shortPath);
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
        height={'auto'}
        sx={{ pt: 7, pb: 3, pl: 7 }}
        style={{ overflow: 'hidden' }}
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
                padding: '8px',
                width: '100%',
                borderRadius: '5px',
                bgcolor: theme.palette.mode === 'dark' ? '#2a2152' : '#c9c4f9',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Outfit',
                  fontSize: '16px',
                  color: theme.palette.mode === 'dark' ? 'White' : '#4e50a5',
                }}
              >
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
                marginBottom: '22px',
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
                  width: '90%',
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
                marginBottom: '22px',
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
                {shortDir}
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
                onClick={handleYamlOpen}
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
                  position: 'absolute',
                  left: '0',
                  right: '0',
                }}
                open={yamlOpen}
                onClick={handleYamlClose}
              >
                {/* ------- Paper is modal / popup --------------------------------------- */}
                <Paper
                  onClick={handleYamlClose}
                  style={{
                    height: '80%',
                    width: '90%',
                    backgroundColor: 'white',
                    overflow: 'scroll',
                    color: 'black',
                    paddingLeft: '0px',
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
                      marginLeft: '40px',
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
                        paddingBottom: '0px',
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
                      id='yaml'
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
                    fontFamily: 'Outfit',
                    color: theme.palette.mode === 'dark' ? 'White' : '#4e50a5',
                  }}
                >
                  INPUT COMMANDS
                </div>
                <EastIcon
                  style={{
                    marginLeft: '5px',
                    height: '30px',
                    color: theme.palette.mode === 'dark' ? 'White' : '#4e50a5',
                  }}
                />
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
                    setHelpList([newInputValue, type]);
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
                    setHelpList([verb, newInputValue]);
                    setType(newInputValue);
                    // setHelpList([verb, newInputValue]);
                    console.log('helplist is', helpList);
                    console.log('verb is', verb);
                    console.log('type is', type);
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
          <div
            style={{
              position: 'absolute',
              left: '58px',
              top: '650px',
              display: 'flex',
              flexDirection: 'column',
              height: '100px',
              width: '86%',
              backgroundColor:
                theme.palette.mode === 'dark' ? '#2f2f6d' : '#e1dbfe',
              marginLeft: '0px',
              marginTop: '25px',
              borderRadius: '3px',
              textAlign: 'center',
              padding: '5px 0 0 0',
              fontFamily: 'Outfit',
              fontWeight: '900',
              letterSpacing: '1px',
              alignItems: 'center',
              fontSize: '16px',
              color: theme.palette.mode === 'dark' ? 'white' : '#4e50a5',
            }}
          >
            {' '}
            <div
              style={{
                display: 'flex',
                marginTop: '2px',
                alignItems: 'center',
              }}
            >
              {' '}
              <BoltIcon />
              <div style={{ width: '5px' }} />
              <div style={{}}>INSTANT HELP DESK</div>
              <div style={{ width: '5px' }} />
              <BoltIcon />
            </div>
            <div
              style={{
                fontFamily: 'Roboto',
                fontWeight: '400',
                fontSize: '10px',
                letterSpacing: '.6px',
                margin: '6px 0 0 0',
              }}
            >
              <em>
                CHOOSE ANY "COMMAND" OR "TYPE" THEN CLICK BELOW TO SEE
                DOCUMENTATION AND HELP INFO
              </em>
            </div>
            <div style={{ display: 'flex', paddingRight: '10px' }}>
              <Button
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  // backgroundColor: '#a494d7',
                  margin: '2px 0px 0 0',
                  // color: 'white',
                  fontFamily: 'Outfit',
                  fontSize: '16px',
                }}
                onClick={handleCommandOpen}
              >
                {verb}
              </Button>
              <Modal
                open={openCommand}
                onClose={handleCommandClose}
                style={{ overflow: 'scroll', height: '100%' }}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
              >
                <Box sx={style}>
                  <Typography
                    id='modal-modal-title'
                    // variant='h6'
                    // component='h2'
                  ></Typography>
                  <Typography
                    id='modal-modal-description'
                    style={{
                      top: '0',
                      left: '0',
                      overflow: 'auto',
                      height: '100%',
                      width: '100%',
                      paddingLeft: '20px',
                      zIndex: '1350',
                    }}
                    sx={{ mt: 0 }}
                  >
                    <pre
                      style={{
                        fontFamily: 'Outfit,monospace',
                        fontSize: '24px',
                        overflow: 'auto',
                      }}
                    >
                      Kubetcl{'  '}
                      <strong style={{ fontSize: '38px' }}>{verb}</strong> :
                    </pre>
                    <pre
                      style={{
                        fontSize: '14px',
                        overflow: 'auto',
                      }}
                    >
                      {helpDesk[`${verb}`]}
                    </pre>
                  </Typography>
                </Box>
              </Modal>

              <Button
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  // backgroundColor: '#a494d7',
                  margin: '2px 0px 0 0',
                  // color: 'white',
                  fontFamily: 'Outfit',
                  fontSize: '16px',
                }}
                onClick={handleTypeOpen}
              >
                {type}
              </Button>
              <Modal
                open={openType}
                onClose={handleTypeClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
              >
                <Box sx={style}>
                  <Typography
                    id='modal-modal-title'
                    // variant='h6'
                    // component='h2'
                  ></Typography>
                  <Typography
                    id='modal-modal-description'
                    style={{
                      top: '0',
                      left: '0',
                      overflow: 'auto',
                      height: '100%',
                      width: '100%',
                      paddingLeft: '20px',
                      zIndex: '1350',
                    }}
                    sx={{ mt: 0 }}
                  >
                    <pre
                      style={{
                        fontFamily: 'Outfit,monospace',
                        fontSize: '24px',
                        overflow: 'auto',
                      }}
                    >
                      Kubetcl Type: {'  '}
                      <strong style={{ fontSize: '38px' }}>{type}</strong>
                    </pre>
                    <pre
                      style={{
                        fontSize: '14px',
                        overflow: 'auto',
                      }}
                    >
                      {helpDesk[`${type}`]}
                    </pre>
                  </Typography>
                </Box>
              </Modal>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default Setup;
