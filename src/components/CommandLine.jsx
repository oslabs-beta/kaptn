import { InputAdornment, Button, TextField, useTheme } from '@mui/material';
// import { clipboard } from 'electron';

const CommandLine = (props) => {
  const theme = useTheme();

  // Add/remove functionality in text box
  const handleChange = (e) => {
    let newUserInput = '';
    console.log('e.nativeEvent.inputType is: ', e.nativeEvent.inputType);
    if (e.nativeEvent.inputType === 'deleteContentBackward') {
      newUserInput = props.userInput.slice(0, props.userInput.length - 1);
    } else {
      newUserInput =
        props.userInput + e.target.value[e.target.value.length - 1];
    }
    props.setUserInput(newUserInput);
  };

  const handleClear = (e) => {
    let userInput = '';
    props.setUserInput(userInput);
    props.setVerb(userInput);
    props.setType(userInput);
    props.setName(userInput);
    props.setFlags([]);
  };

  // const handlePaste = (event) => {
  //   let userInput = event.clipboardData.items[0].getAsString();
  //   console.log(userInput);
  //   props.setUserInput(userInput);
  //   props.setVerb(userInput);
  //   props.setType(userInput);
  //   props.setName(userInput);
  //   props.setFlags([]);
  // };

  return (
    <div
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'transparent',
      }}
    >
      <form
        onSubmit={props.handleSubmit}
        onChange={(e) => {
          handleChange(e);
        }}
        value={props.command}
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: 'transparent',
        }}
      >
        <TextField
          id='outlined-start-adornment'
          sx={{
            m: 0,
            p: 0,
            width: '76%',
            justifyContent: 'start',
            border: '1px solid white',
            borderRadius: '3px',
            background: theme.palette.mode === 'dark' ? '#0e0727' : '#e6e1fb',
            // borderColor: 'transparent',
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>$ </InputAdornment>
            ),
          }}
          value={props.command}
          // onPaste={(e) => {
          //   handlePaste(e);
          // }}
        />
        <Button
          type='submit'
          id='runButt'
          variant='contained'
          style={{
            margin: '1px 6px 0 8px',
            alightContent: 'center',
            background: 'transparent',
            fontSize: '16px',
            height: '53px',
            width: '11%',
            color: theme.palette.mode === 'dark' ? 'white' : '#685aef',
            border:
              theme.palette.mode === 'dark'
                ? '1px solid white'
                : '1.5px solid #685aef',
          }}
        >
          Run
        </Button>
        <Button
          variant='contained'
          onClick={(e) => {
            handleClear(e);
          }}
          style={{
            margin: '1px 0px 0 3px',
            justifyContent: 'center',
            height: '53px',
            width: '10%',
            fontSize: '11px',
            color: theme.palette.mode === 'dark' ? 'lightgrey' : 'grey',
            background: 'transparent',
            border: '.1px solid gray',
          }}
        >
          Clear
        </Button>
      </form>
    </div>
  );
};

export default CommandLine;
