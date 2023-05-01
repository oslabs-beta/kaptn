import React, { useState, useEffect } from 'react';
import SideNav from '../components/Sidebar';
import Grid from '@mui/system/Unstable_Grid';
import SetupButtons from '../components/SetupButtons';
import Button from '@mui/material/Button';

function Cluster() {
  return (
    <>
      <Grid
        id='dashboard'
        container
        disableEqualOverflow='true'
        width={'100vw'}
        height={'95vh'}
        sx={{ pt: 3, pb: 3 }}
      >
        <SideNav />
        <SetupButtons />


      </Grid>
    </>
  );
}

export default Cluster;
