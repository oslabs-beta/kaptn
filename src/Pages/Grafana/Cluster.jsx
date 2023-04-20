import React, { useState, useEffect } from 'react';
import SideNav from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Grid from '@mui/system/Unstable_Grid';

function Cluster() {
  return (
    <>
      <Topbar />
      <Grid
        id='dashboard'
        container
        disableEqualOverflow='true'
        width={'100vw'}
        height={'95vh'}
        sx={{ pt: 3, pb: 3 }}
      >
        <SideNav />
        <iframe
          src='http://localhost:3000/d/09ec8aa1e996d6ffcd6817bbaff4db1b/kubernetes-api-server?orgId=1&refresh=10s&kiosk'
          style={{
            position: 'absolute',
            height: '100%',
            width: '94%',
            border: 'none',
            right: 0,
            top: 0,
          }}
        ></iframe>
      </Grid>
    </>
  );
}

export default Cluster;
