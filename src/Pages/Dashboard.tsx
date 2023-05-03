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
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import SideNav from '../components/Sidebar.jsx';
import CommandLine from '../components/CommandLine.jsx';
import Terminal from '../components/Terminal.jsx';
const { ipcRenderer } = require('electron');

function Dashboard(): JSX.Element {
  const [verb, setVerb] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [currDir, setCurrDir] = useState<string>('NONE SELECTED');
  const [userInput, setUserInput] = useState<string>('');
  const [command, setCommand] = useState<string>('');
  const [tool, setTool] = useState<string>('');
  const [response, setResponse] = useState<
    Array<{ command: string; response: { [key: string]: string } }>
  >([]);
  const [flags, setFlags] = useState<Array<string>>([]);

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
  };

  // Set the command state based on current inputs
  useEffect(() => {
    // Listen to post_command response
    ipcRenderer.on('post_command', (event, arg) => {
      console.log(arg);
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
        width={'100vw'}
        height={'95vh'}
        sx={{ pt: 3, pb: 3 }}
      >
        {/* ----------------SIDE BAR---------------- */}
        <SideNav spacing={2} />
        {/* ----------------MAIN CONTENT---------------- */}
        <Grid
          id='main-content'
          width='75%'
          height='95%'
          xs={10}
          // spacing={1}
          disableEqualOverflow
          container
          direction='column'
          wrap='nowrap'
          justifyContent='space-around'
          alignItems='center'
        >
          {/* ----------------TERMINAL---------------- */}
          <Terminal response={response} />

          {/* ----------------BELOW TERMINAL---------------- */}
          <Grid
            id='below-terminal'
            container
            xs={4}
            height={'35%'}
            sx={{ pt: 1 }}
            justifyContent='center'
            alignItems='center'
            alignContent='space-between'
            width='100%'
          >
            {/* ----------------CHOOSE DIRECTORY---------------- */}
            <Grid
              id='directory'
              container
              width='100%'
              alignItems='flex-end'
              justifyContent='center'
              sx={{ borderBottom: 1 }}
            >
              <Grid id='directory-item' sx={{ pr: 2 }}>
                <p>WORKING DIRECTORY:</p>
              </Grid>
              <Grid id='directory-item' sx={{ pr: 2 }}>
                <p>{currDir}</p>
              </Grid>
              <Grid id='directory-item'>
                <Button
                  variant='contained'
                  component='label'
                  style={{
                    backgroundColor: 'transparent',
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
              width='100%'
              justifyContent='space-around'
              alignItems='center'
            >
              <p>INPUTS:</p>
              <Grid id='kubectl' xs={2}>
                <Autocomplete
                  defaultValue={'kubectl'}
                  disablePortal
                  options={['kubectl']}
                  onInputChange={(e, newInputValue) => {
                    setTool(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label='kubectl' />
                  )}
                />
              </Grid>
              <Grid id='command' xs={2}>
                <Autocomplete
                  disablePortal
                  id='combo-box-demo'
                  options={commandList}
                  onInputChange={(e, newInputValue) => {
                    setVerb(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label='Commands' />
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
              <Grid id='flag' xs={2}>
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
            <CommandLine
              width='100%'
              handleSubmit={handleSubmit}
              setUserInput={setUserInput}
              userInput={userInput}
              command={command}
              handleClear={handleClear}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
