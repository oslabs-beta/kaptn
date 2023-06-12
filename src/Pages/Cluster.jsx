import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { Typography, useTheme } from '@mui/material';
const { ipcRenderer } = require('electron');
import Grid from '@mui/system/Unstable_Grid';
import SideNav from '../components/Sidebar.jsx';

function SetupButtons() {
  const [key, setKey] = useState('');
  const [uid, setUid] = useState('');
  const now = new Date().getTime();
  const from = new Date(now - 60 * 60 * 1000).getTime();

  const theme = useTheme();

  useEffect(() => {
    //Listen to prom_setup event
    ipcRenderer.on('prom_setup', (event, arg) => {
      console.log(arg);
    });

    //Listen to graph_setup event
    ipcRenderer.on('graf_setup', (event, arg) => {
      console.log(arg);
    });

    //Listen to forward_ports event
    ipcRenderer.on('forward_ports', (event, arg) => {
      console.log(arg);
    });

    //Listen to retrieve_key event
    ipcRenderer.on('retrieve_key', (event, arg) => {
      console.log('arg', arg);
      setKey(arg);
      console.log('key', key);
      if (key !== '') {
        ipcRenderer.send('retrieve_uid', {
          key: key,
          dashboard: 'Kubernetes / API server',
        });
      }
    });

    //Listen to retrieve_uid event
    ipcRenderer.on('retrieve_uid', (event, arg) => {
      console.log(arg);
      setUid(arg);
      console.log(url);
      console.log('UID IS THIS!', uid);
      // if (uid !== '') {
      //   return (<iframe
      //   className='frame'
      //   src={url}
      //   width="90%"
      //   height="100%"
      //   title="embed cluster"
      //   ></iframe>)
      // }
    });
  });

  const handleClick = () => {
    ipcRenderer.send('prom_setup');
    // fetch('/prom-graf-setup/promsetup').then((res) => console.log(res));
  };

  const handleGrafClick = () => {
    ipcRenderer.send('graf_setup');
    // fetch('/prom-graf-setup/grafana').then((res: Response) => console.log(res));
  };

  const handleForwardPort = () => {
    ipcRenderer.send('forward_ports');
    // fetch('/prom-graf-setup/forwardports').then((res) => console.log(res));
  };

  const handleCluster = () => {
    ipcRenderer.send('retrieve_key');
    // fetch('/api/key')
    //   .then((res) => res.json())
    //   .then((data) => setKey(data));

    // ipcRenderer.send('retrieve_uid', { key:key,
    //   dashboard: 'Kubernetes / API server'});
    // fetch('/api/uid', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     key: key,
    //     dashboard: 'Kubernetes / API server',
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //     setUid(data)});
  };

  const url = `http://localhost:3000/d/${uid}/kubernetes-api-server?orgId=1&refresh=10s&from=${from}&to=${now}&kiosk=true`;

  return (
    <Grid
      id='dashboard'
      container
      disableEqualOverflow
      width={'100vw'}
      height={'95vh'}
      sx={{ pt: 3, pb: 3 }}
    >
      {/* ----------------SIDE BAR---------------- */}
      <SideNav spacing={2} />
      {/* ----------------MAIN CONTENT---------------- */}
      <Grid
        id='main-content'
        width='75%'
        height='95%'
        xs={10}
        // spacing={1}
        disableEqualOverflow
        container
        direction='column'
        wrap='nowrap'
        justifyContent='space-around'
        alignItems='center'
      >
        <Grid
          className='main-container'
          container
          justifyContent='space-around'
        >
          <Grid xs={2} container>
            <Typography>
              {' '}
              1. Neet to set up Prometheus in your cluster?{' '}
            </Typography>
            <Button
              onClick={handleClick}
              variant='contained'
              style={{
                border: '1px solid',
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#150f2d' : '#8881ce',
              }}
            >
              {' '}
              Set up Prometheus{' '}
            </Button>
          </Grid>

          <Grid xs={2} container>
            <Typography>
              {' '}
              2. Need to set up Grafana in your cluster?{' '}
            </Typography>
            <Button
              variant='contained'
              onClick={handleGrafClick}
              style={{
                border: '1px solid',
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#150f2d' : '#8881ce',
              }}
            >
              Set up Grafana
            </Button>
          </Grid>

          <Grid xs={2} container>
            <Typography> 3. Need to forward ports to see metrics? </Typography>
            <Button
              onClick={handleForwardPort}
              variant='contained'
              style={{
                border: '1px solid',
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#150f2d' : '#8881ce',
              }}
            >
              Start port forwarding...
            </Button>
          </Grid>
          {/* 
          <Grid xs={2} container>
            <Typography> 4. Show me my cluster </Typography>
            <Button
              onClick={handleCluster}
              variant='contained'
              style={{ border: '1px solid' }}
            >
              cluster time
            </Button>
          </Grid> */}
        </Grid>
        <div
          className='frame'
          src={url}
          width='100%'
          height='100%'
          title='embed cluster'
          style={{
            fontSize: '30px',
            paddingBottom: '150px',
            paddingRight: '120px',
          }}
        >
          In-App Visualizer Coming Soon!
        </div>
      </Grid>
    </Grid>
  );
}

export default SetupButtons;
