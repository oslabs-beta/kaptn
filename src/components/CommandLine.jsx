import React, { useState, useEffect } from 'react';
import { InputAdornment } from '@mui/material';
import { TextField } from '@mui/material';

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

  // const changeDirectory = (e) => {
  //   console.log(e.target.files[0]);
  //   let directory = e.target.files[0];
  //   for (let i = directory.length - 1; i > 0; i--) {
  //     if (directory[i] === '/') directory = directory.slice(0, i);
  //   }
  //   console.log('directory', directory);
  //   props.setPat(directory);
  // };

  return (
    <div>
      {/* <input
        directory=''
        webkitdirectory=''
        type='file'
        onChange={(e) => {
          changeDirectory(e);
        }}
      /> */}
      <form
        onSubmit={props.handleSubmit}
        onChange={(e) => {
          handleChange(e);
        }}
        value={props.command}
      >
        <TextField
          id='outlined-start-adornment'
          sx={{ m: 0, width: '60ch' }}
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
          }}
          value={props.command}
        />
      </form>
    </div>
  );
};

export default CommandLine;
