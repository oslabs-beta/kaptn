import React from 'react';
import Grid from '@mui/system/Unstable_Grid';

import { useTheme } from '@mui/material';

function Topbar(): JSX.Element {
  const theme = useTheme();
  return (
    <div
      id='top-bar2'
      style={{
        display: 'flex',
        position: 'absolute',
        top: '0',
        left: '0',
        height: '32px',
        width: '100%',
        justifyContent: 'left',
        backgroundColor: theme.palette.mode === 'dark' ? '#170b49' : '#9d8edc',
        zIndex: '1000',
      }}
    >
      <div
        style={{
          width: '73px',
          height: '100%',
          backgroundColor:
            theme.palette.mode === 'dark' ? '#170b49' : '#9d8edc',
          zIndex: '1000',
        }}
      ></div>
      <div
        style={
          {
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            // backgroundColor: 'green',
            WebkitAppRegion: 'drag',
            WebkitUserSelect: 'none',
          } as React.CSSProperties
        }
      >
        <div
          style={{
            fontFamily: 'Outfit',
            justifyContent: 'center',
            fontSize: 20,
            color: 'White',
          }}
        >
          kaptn
        </div>
      </div>
      <div
        style={
          {
            width: '73px',
            height: '100%',
            // backgroundColor: 'purple',
            WebkitAppRegion: 'drag',
          } as React.CSSProperties
        }
      ></div>
    </div>
  );
}

export default Topbar;
