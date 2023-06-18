import { useState, useEffect } from 'react';
import {
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Autocomplete,
  OutlinedInput,
  ListItemText,
  Checkbox,
  useTheme,
  Modal,
  Typography,
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import SideNav from '../components/Sidebar2.jsx';
import CommandLine from '../components/CommandLine.jsx';
import Terminal from '../components/Terminal.jsx';
const { ipcRenderer } = require('electron');
import commands from '../components/commands.js';
import { Box, styled, lighten, darken } from '@mui/system';

import BoltIcon from '@mui/icons-material/Bolt';
import helpDesk from './Glossary.jsx';
import React from 'react';

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

function Dashboard(): JSX.Element {
  const [verb, setVerb] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [currDir, setCurrDir] = useState<string>('NONE SELECTED');
  const [shortDir, setShortDir] = React.useState<string>('NONE SELECTED');
  const [userInput, setUserInput] = useState<string>('');
  const [command, setCommand] = useState<string>('');
  const [tool, setTool] = useState<string>('');
  const [response, setResponse] = useState<
    Array<{ command: string; response: { [key: string]: string } }>
  >([]);
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

  // Set flag list state on change
  const handleFlags = (event) => {
    const {
      target: { value },
    } = event;
    setFlags(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  // Set name state on change
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

  // Set the command state based on current inputs
  useEffect(() => {
    // Listen to post_command response
    ipcRenderer.on('post_command', (event, arg) => {
      const newResponseState = [
        ...response,
        { command: command, response: arg },
      ];
      setResponse(newResponseState);
    });

    let newCommand = '';
    if (tool !== '') newCommand += tool;
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

  // Clear the input box
  const handleClear = (e) => {
    e.preventDefault();
    setUserInput('');
  };

  // Command list options
  const commandList: { label: string }[] = [
    { label: 'get' },
    { label: 'apply' },
    { label: 'create' },
    { label: 'patch' },
    { label: 'logs' },
  ];

  // Type options
  const types: { label: string }[] = [
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

  // Flag list options
  const flagList: string[] = ['-o wide', '--force', '-f', '-o default', '-v'];

  return (
    <>
      <Grid
        id='dashboard'
        container
        disableEqualOverflow
        overflow='hidden'
        width={'100vw'}
        height={'98vh'}
        sx={{ pt: 4, pb: 3 }}
      >
        {/* ----------------SIDE BAR---------------- */}
        <SideNav spacing={2} />
        {/* ----------------MAIN CONTENT---------------- */}
        <Grid
          id='main-content'
          width='100%'
          height='100%'
          xs={10}
          // spacing={1}
          disableEqualOverflow
          container
          direction='column'
          wrap='nowrap'
          justifyContent='start
          '
          alignItems='center'
          style={{ marginLeft: '35px', marginTop: '25px' }}
        >
          {/* ----------------TERMINAL---------------- */}
          <Terminal
            response={response}
            style={{ height: '10%', width: '50%' }}
          />

          {/* ----------------BELOW TERMINAL---------------- */}
          <Grid
            id='below-terminal'
            container
            xs={2}
            height={'45%'}
            sx={{ pt: 1 }}
            justifyContent='center'
            alignItems='center'
            alignContent='start'
            width='100%'
          >
            {/* ----------------CHOOSE DIRECTORY---------------- */}
            <Grid
              id='directory'
              container
              width='100%'
              alignItems='flex-end'
              justifyContent='center'
              sx={{
                borderBottom: 1,
                width: '95%',
                paddingBottom: '6px',
                marginBottom: '15px',
              }}
            >
              <Grid id='directory-item' sx={{ pr: 2 }}>
                <p
                  style={{
                    fontFamily: 'Outfit',
                    color: theme.palette.mode === 'dark' ? 'White' : '#4e50a5',
                  }}
                >
                  WORKING DIRECTORY:
                </p>
              </Grid>
              <Grid id='directory-item' sx={{ pr: 2 }}>
                <p>{shortDir}</p>
              </Grid>
              <Grid id='directory-item'>
                <Button
                  variant='contained'
                  component='label'
                  style={{
                    backgroundColor: 'transparent',
                    border:
                      currDir === 'NONE SELECTED'
                        ? '2px solid #8f85fb'
                        : '1px solid #68617f',
                    width: '170px',
                    marginBottom: '10px',
                    fontSize: '9px',
                    letterSpacing: '1.5px',
                    color: theme.palette.mode === 'dark' ? '#9e9d9d' : 'black',
                  }}
                >
                  CHOOSE DIRECTORY
                  <input
                    type='file'
                    // @ts-expect-error
                    webkitdirectory=''
                    hidden
                    onChange={handleUploadDirectory}
                  />
                </Button>
              </Grid>
            </Grid>

            {/* ----------------INPUT BOXES---------------- */}
            <Grid
              id='inputs'
              container
              width='93%'
              justifyContent='space-evenly'
              alignItems='center'
              marginRight='30px'
              marginLeft='25px'
              marginTop='7px'
            >
              <p
                style={{
                  marginRight: '10px',
                  fontFamily: 'Outfit',
                  color: theme.palette.mode === 'dark' ? 'White' : '#4e50a5',
                }}
              >
                INPUTS:
              </p>
              <Grid id='kubectl' xs={2}>
                <Autocomplete
                  defaultValue={'kubectl'}
                  disablePortal
                  options={['kubectl']}
                  onInputChange={(e, newInputValue) => {
                    setTool(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label='kubectl (on/off)' />
                  )}
                />
              </Grid>
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
                    // console.log('newInputValue is', newInputValue);
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
              <Grid id='type' xs={2}>
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
              <Grid id='flag' xs={1.2}>
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

            {/* ----------------COMMAND LINE---------------- */}
            <div style={{ marginTop: '20px' }}>
              <CommandLine
                width='100%'
                handleSubmit={handleSubmit}
                setUserInput={setUserInput}
                userInput={userInput}
                command={command}
                handleClear={handleClear}
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '80px',
                width: '55%',
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#2f2f6d' : '#e1dbfe',
                marginLeft: '0',
                marginTop: '17px',
                borderRadius: '3px',
                textAlign: 'center',
                padding: '3px 0 0 0',
                fontFamily: 'Outfit',
                fontWeight: '900',
                letterSpacing: '1px',
                alignItems: 'center',
                fontSize: '12px',
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
                <BoltIcon fontSize='small' />
                <div style={{ width: '5px' }} />
                <div style={{}}>INSTANT HELP DESK</div>
                <div style={{ width: '5px' }} />
                <BoltIcon fontSize='small' />
              </div>
              <div
                style={{
                  fontFamily: 'Roboto',
                  fontWeight: '400',
                  fontSize: '9px',
                  letterSpacing: '.6px',
                  margin: '4px 0 0 0',
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
                    margin: '0px 0px 0 0',
                    // color: 'white',
                    fontFamily: 'Outfit',
                    fontSize: '14px',
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
                    flexDirection: 'row',
                    // backgroundColor: '#a494d7',
                    margin: '0px 0px 0 0',
                    // color: 'white',
                    fontFamily: 'Outfit',
                    fontSize: '14px',
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
      </Grid>
    </>
  );
}

export default Dashboard;
