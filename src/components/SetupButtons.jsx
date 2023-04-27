import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

function SetupButtons() {
  const handleClick = () => {
    fetch('/prom-graf-setup/promsetup').then((res) => console.log(res));
  };

  const handleGrafClick = () => {
    fetch('/prom-graf-setup/grafana').then((res) => console.log(res));
  };

  // const handleForwardPort = () => {
  //   fetch('/setup/forwardports').then((res) => console.log(res));
  // }

  return (
    <>
      <Box className='button-container'>
        <Typography> Neet to set up Prometheus in your cluster? </Typography>
        <Button onClick={handleClick}> Set up Prometheus </Button>

        <Typography> Need to set up Grafana in your cluster? </Typography>
        <Button onClick={handleGrafClick}>Set up Grafana</Button>

        {/* <Typography> Need to forward ports to see metrics? </Typography>
        <Button
          onClick={handleForwardPort}
        >
          Start port forwarding...
        </Button> */}
      </Box>
    </>
  );
}

export default SetupButtons;
