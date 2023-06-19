import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { Typography, useTheme } from '@mui/material';
const { ipcRenderer } = require('electron');
import Grid from '@mui/system/Unstable_Grid';
import SideNav from '../components/Sidebar2.jsx';
import LaunchIcon from '@mui/icons-material/Launch';

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
    fetch('/api/key')
      .then((res) => res.json())
      .then((data) => setKey(data));

    ipcRenderer.send('retrieve_uid', {
      key: key,
      dashboard: 'Kubernetes / API server',
    });
    fetch('/api/uid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: key,
        dashboard: 'Kubernetes / API server',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUid(data);
      });

    let url = `http://localhost:3000/d/${uid}/kubernetes-api-server?orgId=1&refresh=10s&from=${from}&to=${now}&kiosk=true`;
    ipcRenderer.send('openbrowser', url);
  };

  return (
    <div
      style={{
        width: '125%',
      }}
    >
      {/* ----------------SIDE BAR---------------- */}
      <SideNav />
      {/* ----------------MAIN CONTENT---------------- */}
      <div
        // id='main-content'
        width='1100px'
        height='100%'
        // spacing={1}
        style={{
          display: 'flex',
          justifyContent: 'center',
          // alignItems: 'center',
          marginLeft: '35px',
          marginTop: '15px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '60%',
            display: 'flex',
            flexDirection: 'column',
            margin: '50px 10px 50px 50px',
          }}
        >
          <Typography> 1. Set up Prometheus in your cluster </Typography>

          <br />
          <Button
            onClick={handleClick}
            variant='contained'
            style={{
              border: '1px solid',
              height: '60px',
              backgroundColor:
                theme.palette.mode === 'dark' ? '#150f2d' : '#8881ce',
            }}
          >
            {' '}
            Set up Prometheus{' '}
          </Button>
        </div>

        <div
          style={{
            width: '60%',
            display: 'flex',
            flexDirection: 'column',
            margin: '50px 10px 50px 10px',
          }}
        >
          <Typography> 2. Set up Grafana in your cluster </Typography>

          <br />
          <Button
            variant='contained'
            onClick={handleGrafClick}
            style={{
              border: '1px solid',
              height: '60px',
              backgroundColor:
                theme.palette.mode === 'dark' ? '#150f2d' : '#8881ce',
            }}
          >
            Set up Grafana
          </Button>
        </div>

        <div
          style={{
            width: '60%',
            display: 'flex',
            flexDirection: 'column',
            margin: '50px 10px 50px 10px',
          }}
        >
          <Typography> 3.Forward ports to see metrics </Typography>
          <br />
          <Button
            onClick={handleForwardPort}
            variant='contained'
            style={{
              border: '1px solid',
              height: '60px',
              backgroundColor:
                theme.palette.mode === 'dark' ? '#150f2d' : '#8881ce',
            }}
          >
            Start port forwarding
          </Button>
        </div>

        <div
          style={{
            width: '60%',
            display: 'flex',
            flexDirection: 'column',
            margin: '50px 30px 50px 10px',
          }}
        >
          <Typography> 4. Open and view my cluster </Typography>

          <br />

          <Button
            onClick={handleCluster}
            variant='contained'
            style={{
              border: '1px solid',
              height: '60px',
              // marginTop: '20px',
              paddingRight: '8px',
              backgroundColor:
                theme.palette.mode === 'dark' ? '#150f2d' : '#8881ce',
            }}
          >
            LAUNCH IN BROWSER{' '}
            <LaunchIcon fontSize='small' style={{ margin: '0 0 2px 6px' }} />
          </Button>
        </div>
        <embed
          src={'http://127.0.0.1:3000/login'}
          style={{ height: '500px', width: '400px' }}
        ></embed>
      </div>
    </div>
  );
}

export default SetupButtons;
