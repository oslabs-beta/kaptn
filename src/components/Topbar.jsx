import React from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { useContext } from 'react';
import InputBase from '@mui/material/InputBase';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/system/Unstable_Grid';
import { ColorModeContext, useMode } from '../theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

function Topbar() {
  const theme = useTheme();
  // const colors = tokens(theme.palette.mode);
  // // allow us to toggle different states for the color mode
  const colorMode = useContext(ColorModeContext);

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
        {/* <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeIcon />
          )}
        </IconButton> */}
        {/*
        <IconButton onClick={() => console.log(theme)}>
          <NotificationsOutlinedIcon />
        </IconButton>

        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        <IconButton>
          <PersonOutlinedIcon />
        </IconButton> */}
      </Grid>
    </Grid>
  );
}

export default Topbar;
