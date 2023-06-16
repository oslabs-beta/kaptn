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

    // <Grid
    //   id='top-bar'
    //   container
    //   zIndex={1000}
    //   justifyContent='space-between'
    //   alignItems='center'
    //   style={{
    //     backgroundColor: theme.palette.mode === 'dark' ? '#170b49' : '#9d8edc',
    //     zIndex: '1500',
    //   }}
    // >
    //   <Grid
    //     id='top-bar-left'
    //     container
    //     justifyContent='space-between'
    //     alignItems='center'
    //     xs={2}
    //     component='div'
    //     style={
    //       {
    //         WebkitAppRegion: 'drag',
    //       } as React.CSSProperties
    //     }
    //   ></Grid>

    //   <Grid
    //     id='top-bar-title'
    //     xs={8}
    //     component='div'
    //     container
    //     justifyContent='center'
    //     style={
    //       {
    //         WebkitAppRegion: 'drag',
    //         WebkitUserSelect: 'none',
    //         fontFamily: 'Roboto',
    //         fontSize: '13pt',
    //         fontWeight: '500',
    //         color: 'White',
    //         letterSpacing: '0.5px',
    //       } as React.CSSProperties
    //     }
    //   >
    //     kaptn
    //   </Grid>

    //   <Grid
    //     id='top-bar-right'
    //     top='0'
    //     right='0'
    //     style={
    //       {
    //         WebkitAppRegion: 'drag',
    //         WebkitUserSelect: 'none',
    //         fontFamily: 'Roboto',
    //         fontSize: '13pt',
    //         fontWeight: '500',
    //         letterSpacing: '0.5px',
    //       } as React.CSSProperties
    //     }
    //     height='25px'
    //     marginBottom='5px'
    //     xs={2}
    //   ></Grid>
    // </Grid>
  );
}

export default Topbar;
