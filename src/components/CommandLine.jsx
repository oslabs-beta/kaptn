import React, { useState, useEffect } from 'react';
import { InputAdornment } from '@mui/material';
import { TextField } from '@mui/material';

const CommandLine = (props) => {
  return (
    <div id='CommandLine'>
      <form
        onSubmit={props.handleSubmit}
        onChange={(e) => props.setCommand(e.target.value)}
        value={props.command}
      >
        <TextField
          id='outlined-start-adornment'
          sx={{ m: 1, width: '60ch' }}
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
          }}
        />
        {/* <input type='text'></input> */}
        {/* <button type='submit'>Enter</button> */}
      </form>
    </div>
  );
};

export default CommandLine;
