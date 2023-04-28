import React from 'react';
import Grid from '@mui/system/Unstable_Grid';

function Topbar() {
  return (
    <Grid
      id='top-bar'
      container
      justifyContent='space-between'
      alignItems='center'
      backgroundColor='#22145a'
    >
      <Grid
        id='top-bar-left'
        container
        justifyContent='space-between'
        alignItems='center'
        xs={2}
        style={{
          WebkitAppRegion: 'drag',
        }}
      ></Grid>

      <Grid
        id='top-bar-title'
        xs={8}
        container
        justifyContent='center'
        style={{
          WebkitAppRegion: 'drag',
          fontFamily: 'Roboto',
          fontSize: '13pt',
          fontWeight: '500',
          letterSpacing: '0.5px',
        }}
      >
        kaptn
      </Grid>

      <Grid
        id='top-bar-icons'
        top='0'
        right='0'
        backgroundColor='#22145a'
        height='35px'
        marginBottom='5px'
        xs={2}
      >
      </Grid>
    </Grid>
  );
}

export default Topbar;
