import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { Typography, useTheme } from '@mui/material';
const { ipcRenderer } = require('electron');
import Grid from '@mui/system/Unstable_Grid';
import SideNav from '../components/Sidebar2.jsx';
import LaunchIcon from '@mui/icons-material/Launch';
import { RadioButtonUnchecked } from '@mui/icons-material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

import { styled } from '@mui/material/styles';

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === 'dark' ? '#5c4d9a' : '#8383de',
    color: 'white',
    fontSize: 11,
  },
}));

function SetupButtons() {
  const [key, setKey] = useState('');
  const [uid, setUid] = useState('');
  const now = new Date().getTime();
  const from = new Date(now - 60 * 60 * 1000).getTime();
  const [promStatus, setPromStatus] = useState('no attempt');
  const [grafStatus, setGrafStatus] = useState('no attempt');
  const [portForwardStatus, setPortForwardStatus] = useState('no attempt');
  const [launchStatus, setLaunchStatus] = useState('no attempt');

  const theme = useTheme();

  let url;

  useEffect(() => {
    //Listen to prom_setup event
    ipcRenderer.on('prom_setup', (event, arg) => {
      let returnedValue = arg;
      if (returnedValue.includes('Prom setup complete')) {
        setPromStatus('true');
      } else setPromStatus(returnedValue);
      console.log('prom steup return is: ', returnedValue);
    });

    //Listen to graph_setup event
    ipcRenderer.on('graf_setup', (event, arg) => {
      let returnedValue = arg;
      if (returnedValue.includes('Grafana setup complete')) {
        setGrafStatus('true');
      } else setGrafStatus(returnedValue);
      console.log('graf setup return is: ', returnedValue);
    });

    //Listen to forward_ports event
    ipcRenderer.on('forward_ports', (event, arg) => {
      if (arg.includes('stdout: ')) {
        setPortForwardStatus('true');
      } else setPortForwardStatus(arg);
      console.log(arg);
    });

    //Listen to retrieve_key event
    ipcRenderer.on('retrieve_key', (event, arg) => {
      if (arg === 'true') {
        setLaunchStatus('true');
      } else {
        setLaunchStatus('');
        console.log('launch status is now:', launchStatus);
      }
      // let keyfetch = arg.key;
      // console.log('arg TYPE in retrieve key listen is:', typeof arg);
      // setKey(arg.key);
      // setInterval(console.log('key after fetch is:', key), 4000);
      // if (key !== '') {
      //   ipcRenderer.send('retrieve_uid', {
      //     key: key,
      //     dashboard: 'Kubernetes / API server',
      //   });
      // }
    });

    //Listen to retrieve_uid event
    // ipcRenderer.on('retrieve_uid', (event, arg) => {
    //   // console.log(arg);
    //   setUid(arg);
    //   // console.log(url);
    //   console.log('UID IS THIS!', uid);

    //   url = `http://localhost:3000/d/${uid}/kubernetes-api-server?orgId=1&refresh=10s&from=${from}&to=${now}&kiosk=true`;
    //   ipcRenderer.send('openbrowser', url);
    // });
  });

  const handleClick = () => {
    setPromStatus('loading');
    ipcRenderer.send('prom_setup');
    // fetch('/prom-graf-setup/promsetup').then((res) => console.log(res));
  };

  const handleGrafClick = () => {
    setGrafStatus('loading');
    ipcRenderer.send('graf_setup');
    // fetch('/prom-graf-setup/grafana').then((res: Response) => console.log(res));
  };

  const handleForwardPort = () => {
    setPortForwardStatus('loading');
    ipcRenderer.send('forward_ports');
    // fetch('/prom-graf-setup/forwardports').then((res) => console.log(res));
  };

  const handleCluster = () => {
    setLaunchStatus('loading');
    ipcRenderer.send('retrieve_key');

    // ipcRenderer.send('retrieve_uid', {
    //   key: key,
    //   dashboard: 'Kubernetes / API server',
    // });
  };

  let portForwardDiv;
  if (portForwardStatus === 'no attempt') {
    portForwardDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.2%',
            left: '61.8%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: theme.palette.mode === 'dark' ? '#353050' : '#8781c9',
          }}
        >
          {' '}
          3
        </div>
        <div>
          {' '}
          <RadioButtonUnchecked
            className='clusterStatusIcons'
            style={{
              color: theme.palette.mode === 'dark' ? '#353050' : '#8781c9',
            }}
          />
        </div>
        <div style={{ marginTop: '70px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#585176',
              fontWeight: '500',
            }}
          >
            {' '}
            FORWARD PORTS TO SEE METRICS{' '}
          </Typography>
        </div>
        <br />
        <LightTooltip
          title='Start forwarding to port 3000'
          placement='bottom'
          arrow
          enterDelay={1500}
          leaveDelay={100}
          enterNextDelay={1500}
        >
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
        </LightTooltip>
      </>
    );
  } else if (portForwardStatus === 'loading') {
    portForwardDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.2%',
            left: '61.8%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: '#353050',
          }}
        >
          {' '}
        </div>
        <div>
          {' '}
          <CircularProgress
            className='clusterLoadingIcon'
            size={116}
            thickness={4.6}
            style={{
              color: theme.palette.mode === 'dark' ? '#353050' : '#8781c9',
              marginTop: '-48px',
            }}
          />
        </div>
        <div style={{ marginTop: '22.5px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#585176',
              fontWeight: '500',
            }}
          >
            {' '}
            FORWARD PORTS TO SEE METRICS{' '}
          </Typography>
        </div>
        <br />
        <Button
          onClick={handleForwardPort}
          variant='contained'
          disabled
          style={{
            border: '1px solid',
            height: '60px',
            // marginTop: '20px',
            // paddingRight: '8px',
            color: 'grey',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#150f2d' : 'transparent',
          }}
        >
          Start port forwarding
        </Button>
      </>
    );
  } else if (portForwardStatus === 'true') {
    portForwardDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.2%',
            left: '61.8%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: '#353050',
          }}
        >
          {' '}
        </div>
        <div>
          {' '}
          <CheckCircleOutlinedIcon
            className='clusterStatusIcons'
            style={{ color: '#2fc665' }}
          />
        </div>
        <div style={{ marginTop: '70px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#2fc665',
              fontWeight: '500',
            }}
          >
            {' '}
            FORWARD PORTS TO SEE METRICS{' '}
          </Typography>
        </div>
        <br />
        <Button
          onClick={handleForwardPort}
          variant='contained'
          disabled
          style={{
            border: '1px solid #2fc665',
            height: '60px',
            color: '#2fc665',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#150f2d' : 'transparent',
          }}
        >
          Start port forwarding
        </Button>
      </>
    );
  } else {
    portForwardDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.2%',
            left: '61.8%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: '#353050',
          }}
        >
          {' '}
        </div>
        <div>
          {' '}
          <HighlightOffOutlinedIcon
            className='clusterStatusIcons'
            style={{ color: '#cf485b' }}
          />
        </div>
        <div style={{ marginTop: '70px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#cf4848',
              fontWeight: '500',
            }}
          >
            {' '}
            FORWARD PORTS TO SEE METRICS{' '}
          </Typography>
        </div>
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
        <div style={{ fontSize: '12px', color: '#cf4848', marginTop: '20px' }}>
          ERROR OCCURRED! PLEASE TRY AGAIN
        </div>
      </>
    );
  }

  let promStatusDiv;
  if (promStatus === 'loading') {
    console.log('prom status is: ', promStatus);
    promStatusDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '24.3%',
            left: '14.85%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: '#353050',
          }}
        >
          {' '}
        </div>
        <div>
          {' '}
          <CircularProgress
            className='clusterLoadingIcon'
            size={116}
            thickness={4.6}
            style={{
              color: theme.palette.mode === 'dark' ? '#353050' : '#8781c9',
              marginTop: '-48px',
            }}
          />
        </div>
        <div style={{ marginTop: '22.5px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#585176',
              fontWeight: '500',
            }}
          >
            SET UP PROMETHEUS IN YOUR CLUSTER
          </Typography>
        </div>

        <br />
        <Button
          onClick={handleClick}
          variant='contained'
          disabled='true'
          style={{
            border: '1px solid',
            height: '60px',
            // marginTop: '20px',
            // paddingRight: '8px',
            color: 'grey',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#150f2d' : 'transparent',
          }}
        >
          {' '}
          Set up Prometheus{' '}
        </Button>
      </>
    );
  } else if (promStatus === 'no attempt') {
    promStatusDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.3%',
            left: '14.85%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: theme.palette.mode === 'dark' ? '#353050' : '#8781c9',
          }}
        >
          {' '}
          1
        </div>
        <div>
          {' '}
          <RadioButtonUnchecked
            className='clusterStatusIcons'
            style={{
              color: theme.palette.mode === 'dark' ? '#353050' : '#8781c9',
            }}
          />
        </div>
        <div style={{ marginTop: '70px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#585176',
              fontWeight: '500',
            }}
          >
            SET UP PROMETHEUS IN YOUR CLUSTER
          </Typography>
        </div>

        <br />
        <LightTooltip
          title='Set up Prometheus and install Helm'
          placement='bottom'
          arrow
          enterDelay={1500}
          leaveDelay={100}
          enterNextDelay={1500}
        >
          <Button
            onClick={handleClick}
            variant='contained'
            style={{
              border: '1px solid',
              height: '60px',
              // marginTop: '20px',
              // paddingRight: '8px',
              backgroundColor:
                theme.palette.mode === 'dark' ? '#150f2d' : '#8881ce',
            }}
          >
            Set up Prometheus
          </Button>
        </LightTooltip>
      </>
    );
  } else if (promStatus === '') {
    <>
      <div
        style={{
          position: 'absolute',
          top: '25.3%',
          left: '14.85%',
          marginTop: '0px',
          fontFamily: 'Outfit',
          fontSize: '66px',
          fontWeight: '800',
          color: '#353050',
        }}
      >
        {' '}
        1
      </div>
      <div>
        {' '}
        <CheckCircleOutlinedIcon
          className='clusterStatusIcons'
          style={{ color: '#2fc665' }}
        />
      </div>
      <div style={{ marginTop: '70px' }}>
        <Typography
          style={{
            fontSize: '12px',
            color: '#2fc665',
            fontWeight: '500',
          }}
        >
          SET UP PROMETHEUS IN YOUR CLUSTER
        </Typography>
      </div>

      <br />
      <Button
        onClick={handleClick}
        variant='contained'
        style={{
          border: '1px solid #2fc665',
          height: '60px',
          color: '#2fc665',
          backgroundColor:
            theme.palette.mode === 'dark' ? '#150f2d' : '#8881ce',
        }}
      >
        Set up Prometheus
      </Button>
    </>;
  } else if (promStatus === 'true') {
    promStatusDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.3%',
            left: '14.85%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: '#353050',
          }}
        >
          {' '}
        </div>
        <div>
          {' '}
          <CheckCircleOutlinedIcon
            className='clusterStatusIcons'
            style={{ color: '#2fc665' }}
          />
        </div>
        <div style={{ marginTop: '70px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#2fc665',
              fontWeight: '500',
            }}
          >
            SET UP PROMETHEUS IN YOUR CLUSTER
          </Typography>
        </div>

        <br />
        <Button
          onClick={handleClick}
          variant='contained'
          disabled
          style={{
            border: '1px solid #2fc665',
            height: '60px',
            color: '#2fc665',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#150f2d' : 'transparent',
          }}
        >
          Set up Prometheus
        </Button>
      </>
    );
  }

  let grafStatusDiv;
  if (grafStatus === 'true') {
    grafStatusDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.2%',
            left: '38.1%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: '#353050',
          }}
        >
          {' '}
        </div>
        <div>
          {' '}
          <CheckCircleOutlinedIcon
            className='clusterStatusIcons'
            style={{ color: '#2fc665' }}
          />
        </div>
        <div style={{ marginTop: '70px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#2fc665',
              fontWeight: '500',
            }}
          >
            {' '}
            SET UP GRAFANA IN YOUR CLUSTER{' '}
          </Typography>
        </div>
        <br />
        <Button
          variant='contained'
          onClick={handleGrafClick}
          disabled
          style={{
            border: '1px solid #2fc665',
            height: '60px',
            color: '#2fc665',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#150f2d' : 'transparent',
          }}
        >
          Set up Grafana
        </Button>
      </>
    );
  } else if (grafStatus === 'loading') {
    grafStatusDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.2%',
            left: '38.1%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: '#353050',
          }}
        >
          {' '}
        </div>
        <div>
          {' '}
          <CircularProgress
            className='clusterLoadingIcon'
            size={116}
            thickness={4.6}
            style={{
              color: theme.palette.mode === 'dark' ? '#353050' : '#8781c9',
              marginTop: '-48px',
            }}
          />
        </div>
        <div style={{ marginTop: '22.5px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#585176',
              fontWeight: '500',
            }}
          >
            {' '}
            SET UP GRAFANA IN YOUR CLUSTER{' '}
          </Typography>
        </div>
        <br />
        <Button
          variant='contained'
          onClick={handleGrafClick}
          disabled
          style={{
            border: '1px solid',
            height: '60px',
            // color: '#2fc665',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#150f2d' : 'tranparent',
          }}
        >
          Set up Grafana
        </Button>
      </>
    );
  } else if (grafStatus === 'no attempt') {
    grafStatusDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.2%',
            left: '38.1%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: theme.palette.mode === 'dark' ? '#353050' : '#8781c9',
          }}
        >
          {' '}
          2
        </div>
        <div>
          {' '}
          <RadioButtonUnchecked
            className='clusterStatusIcons'
            style={{
              color: theme.palette.mode === 'dark' ? '#353050' : '#8781c9',
            }}
          />
        </div>
        <div style={{ marginTop: '70px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#585176',
              fontWeight: '500',
            }}
          >
            {' '}
            SET UP GRAFANA IN YOUR CLUSTER{' '}
          </Typography>
        </div>
        <br />
        <LightTooltip
          title='Install and set up Grafana in your cluster'
          placement='bottom'
          arrow
          enterDelay={1500}
          leaveDelay={100}
          enterNextDelay={1500}
        >
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
        </LightTooltip>
      </>
    );
  } else
    grafStatusDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.2%',
            left: '38.1%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: '#353050',
          }}
        >
          {' '}
          2
        </div>
        <div>
          {' '}
          <HighlightOffOutlinedIcon
            className='clusterStatusIcons'
            style={{ color: '#cf485b' }}
          />
        </div>
        <div style={{ marginTop: '70px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#cf485b',
              fontWeight: '500',
            }}
          >
            {' '}
            SET UP GRAFANA IN YOUR CLUSTER{' '}
          </Typography>
        </div>
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
        <div style={{ fontSize: '12px', color: '#cf4848', marginTop: '20px' }}>
          ERROR OCCURRED! PLEASE TRY AGAIN
        </div>
      </>
    );

  let launchStatusDiv;
  if (launchStatus === 'no attempt') {
    launchStatusDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.2%',
            left: '85%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: theme.palette.mode === 'dark' ? '#353050' : '#8781c9',
          }}
        >
          {' '}
          4
        </div>
        <div>
          {' '}
          <RadioButtonUnchecked
            className='clusterStatusIcons'
            style={{
              color: theme.palette.mode === 'dark' ? '#353050' : '#8781c9',
            }}
          />
        </div>

        <div style={{ marginTop: '70px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#585176',
              fontWeight: '500',
            }}
          >
            {' '}
            OPEN AND VIEW CLUSTERS{' '}
          </Typography>
        </div>
        <br />
        <LightTooltip
          title='Retrieve UID and launch Cluster Visualizer through your local web browser'
          placement='bottom'
          arrow
          enterDelay={1500}
          leaveDelay={100}
          enterNextDelay={1500}
        >
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
        </LightTooltip>
      </>
    );
  } else if (launchStatus === 'true') {
    launchStatusDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.2%',
            left: '85%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: '#353050',
          }}
        >
          {' '}
        </div>
        <div>
          {' '}
          <CheckCircleOutlinedIcon
            className='clusterStatusIcons'
            style={{ color: '#2fc665' }}
          />
        </div>

        <div style={{ marginTop: '70px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#2fc665',
              fontWeight: '500',
            }}
          >
            {' '}
            OPEN AND VIEW CLUSTERS{' '}
          </Typography>
        </div>
        <br />
        <Button
          onClick={handleCluster}
          variant='contained'
          // disabled
          style={{
            border: '1px solid #2fc665',
            height: '60px',
            // marginTop: '20px',
            paddingRight: '8px',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#150f2d' : '#d0ccfc',
            color: '#2fc665',
          }}
        >
          LAUNCH IN BROWSER{' '}
          <LaunchIcon fontSize='small' style={{ margin: '0 0 2px 6px' }} />
        </Button>
      </>
    );
  } else if (launchStatus === 'loading') {
    launchStatusDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.2%',
            left: '85%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: '#353050',
          }}
        >
          {' '}
        </div>
        <div>
          {' '}
          <CircularProgress
            className='clusterLoadingIcon'
            size={116}
            thickness={4.6}
            style={{
              color: theme.palette.mode === 'dark' ? '#353050' : '#8781c9',
              marginTop: '-48px',
            }}
          />
        </div>

        <div style={{ marginTop: '22.5px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#585176',
              fontWeight: '500',
            }}
          >
            {' '}
            OPEN AND VIEW CLUSTERS{' '}
          </Typography>
        </div>
        <br />
        <Button
          onClick={handleCluster}
          variant='contained'
          disabled
          style={{
            border: '1px solid',
            height: '60px',
            // marginTop: '20px',
            paddingRight: '8px',
            backgroundColor:
              theme.palette.mode === 'dark' ? '#150f2d' : 'transparent',
          }}
        >
          LAUNCH IN BROWSER{' '}
          <LaunchIcon fontSize='small' style={{ margin: '0 0 2px 6px' }} />
        </Button>
      </>
    );
  } else
    launchStatusDiv = (
      <>
        <div
          style={{
            position: 'absolute',
            top: '25.2%',
            left: '85%',
            marginTop: '0px',
            fontFamily: 'Outfit',
            fontSize: '66px',
            fontWeight: '800',
            color: '#353050',
          }}
        >
          {' '}
        </div>
        <div>
          {' '}
          <HighlightOffOutlinedIcon
            className='clusterStatusIcons'
            style={{ color: '#cf485b' }}
          />
        </div>

        <div style={{ marginTop: '70px' }}>
          <Typography
            style={{
              fontSize: '12px',
              color: '#cf4848',
              fontWeight: '500',
            }}
          >
            {' '}
            OPEN AND VIEW CLUSTERS{' '}
          </Typography>
        </div>
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
        <div style={{ fontSize: '12px', color: '#cf4848', marginTop: '20px' }}>
          ERROR OCCURRED! PLEASE TRY AGAIN
        </div>
      </>
    );
  return (
    <>
      {/* ----------------SIDE BAR---------------- */}
      <SideNav />
      {/* ----------------MAIN CONTENT---------------- */}

      <div
        height='100%'
        // spacing={1}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: '.8%',
          marginTop: '5%',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            fontFamily: 'Outfit',
            fontWeight: '800',
            fontSize: '43px',
            justifyContent: 'flex-start',
            width: '100%',
            letterSpacing: '1px',
            color: theme.palette.mode === 'dark' ? 'white' : '#6466b2',
          }}
        >
          CLUSTER VISUALIZER
        </div>
        <div
          style={{
            // fontFamily: 'Outfit',
            fontWeight: '400',
            fontSize: '14px',
            justifyContent: 'flex-start',
            width: '100%',
            letterSpacing: '1px',
            color: theme.palette.mode === 'dark' ? 'white' : 'grey',
          }}
        >
          PLEASE FOLLOW THE STEPS BELOW IN ORDER:
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            margin: '4.8% 1% 0 1%',
          }}
        >
          <div
            style={{
              width: '160%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              margin: '50px 10px 50px 50px',
            }}
          >
            {' '}
            {promStatusDiv}
          </div>

          <div
            style={{
              width: '160%',
              display: 'flex',
              flexDirection: 'column',
              margin: '50px 10px 50px 10px',
            }}
          >
            {' '}
            {grafStatusDiv}
          </div>

          <div
            style={{
              width: '160%',
              display: 'flex',
              flexDirection: 'column',
              margin: '50px 10px 50px 10px',
            }}
          >
            {portForwardDiv}
          </div>

          <div
            style={{
              width: '160%',
              display: 'flex',
              flexDirection: 'column',
              margin: '50px 30px 50px 10px',
            }}
          >
            {launchStatusDiv}
          </div>
          {/*           
          <embed
            src={'http://127.0.0.1:3000/login'}
            style={{ height: '500px', width: '400px' }}
          ></embed> */}
        </div>
      </div>
    </>
  );
}

export default SetupButtons;
