import React, { useState, useEffect } from 'react';
import { InputAdornment, Button } from '@mui/material';
import { TextField, Box } from '@mui/material';

const CommandLine = (props) => {
  // Add/remove functionality in text box
  const handleChange = (e) => {
    console.log('e ', e);
    let newUserInput = '';
    if (e.nativeEvent.inputType === 'deleteContentBackward') {
      newUserInput = props.userInput.slice(0, props.userInput.length - 1);
    } else {
      newUserInput =
        props.userInput + e.target.value[e.target.value.length - 1];
    }
    props.setUserInput(newUserInput);
  };

  return (
    // <div style={{
    //   border: '1px solid',
    //   borderRadius: '3px',
    //   background: '#0e0727',
    //   // border: '2px solid #c6bebe',
    //   height: '100px',
    //   width: 'auto',
    //   marginTop: '5px',
    //   fontFamily: 'monospace',
    //   padding: '5px',
    // }}>
      // <Box
      //             sx={{
      //               // border: 1,
      //               display: 'inline-flex',
      //               flexDirection: 'row',
      //               alignItems: 'center',
      //               // colored box behind buttons
      //               // bgcolor: '#2e2d2d',
      //               padding: '15px',
      //               width: '190px',
      //               height: '100px',
      //               borderRadius: '5px',
      //             }}
      //           >
      <form
        onSubmit={props.handleSubmit}
        onChange={(e) => {
          handleChange(e);
        }}
        value={props.command}
        style={{display: 'flex', justifyContent: 'space-around', width: 'auto'}}
      >
        <TextField
          id='outlined-start-adornment'
          sx={{ m: 0, width: '60ch' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>$ </InputAdornment>
            ),
          }}
          value={props.command}
        />
        <Button type='submit' variant='contained'>
          Run
        </Button>
        <Button variant='contained' onClick = {props.handleClear}>
          Clear
        </Button>
      </form>
      // </Box>
    // </div>
  );
};

export default CommandLine;
