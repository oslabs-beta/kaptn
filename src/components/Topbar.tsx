import React from 'react';
import Grid from '@mui/system/Unstable_Grid';

function Topbar(): JSX.Element {
  return (
    <Grid
      id='top-bar'
      container
      justifyContent='space-between'
      alignItems='center'
      style={{ backgroundColor: '#22145a' }}
    >
      <Grid
        id='top-bar-left'
        container
        justifyContent='space-between'
        alignItems='center'
        xs={2}
        component='div'
        style={
          {
            WebkitAppRegion: 'drag',
          } as React.CSSProperties
        }
      ></Grid>

      <Grid
        id='top-bar-title'
        xs={8}
        component='div'
        container
        justifyContent='center'
        style={
          {
            WebkitAppRegion: 'drag',
            fontFamily: 'Roboto',
            fontSize: '13pt',
            fontWeight: '500',
            letterSpacing: '0.5px',
          } as React.CSSProperties
        }
      >
        kaptn
      </Grid>

      <Grid
        id='top-bar-right'
        top='0'
        right='0'
        style={
          {
            WebkitAppRegion: 'drag',
            fontFamily: 'Roboto',
            fontSize: '13pt',
            fontWeight: '500',
            letterSpacing: '0.5px',
          } as React.CSSProperties
        }
        height='35px'
        marginBottom='5px'
        xs={2}
      ></Grid>
    </Grid>
  );
}

export default Topbar;
