import React, { useState, useEffect, useRef } from 'react';
import Grid from '@mui/system/Unstable_Grid';
import { useTheme } from '@mui/material';

const Terminal = (props) => {
  const theme = useTheme();

  // Create a div for each command/response in the current session
  let commandLog: JSX.Element[] = [];
  let key = 1;

  // Format the shell response for line breaks and spacing
  // The <pre> tag here ensures proper spacing
  props.response.forEach((el) => {
    const paredResponse: JSX.Element[] = el.response
      .split('\n')
      .map(function (item: string) {
        return (
          <pre>
            <span>{item}</span>
          </pre>
        );
      });
    commandLog.push(
      <div className='command-log' key={key}>
        <strong
          style={{
            color:
              theme.palette.mode === 'dark' ? 'rgb(109, 233, 68)' : '#685aef',
          }}
        >
          $ {el.command}
        </strong>
        <>{paredResponse}</>
      </div>
    );
    key++;
  });

  return (
    <Grid
      id='terminal'
      width='100%'
      height='100%'
      style={{
        border:
          theme.palette.mode === 'dark'
            ? '1px solid white'
            : '1px solid #a5a1b3',
        borderRadius: '3px',
        background: theme.palette.mode === 'dark' ? '#0e0727' : '#e6e1fb',
        fontFamily: 'monospace',
        padding: '5px',
        overflow: 'auto',
        lineHeight: '10px',
      }}
    >
      {commandLog}
    </Grid>
  );
};

export default Terminal;