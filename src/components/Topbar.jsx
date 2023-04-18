import React from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { useContext } from 'react';
import { ColorModeContext, tokens } from '../theme';
import InputBase from '@mui/material/InputBase';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';

function Topbar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // allow us to toggle different states for the color mode
  const colorMode = useContext(ColorModeContext);
  return (
    <div
      id='top-bar'
      style={{
        display: 'flex',
        flexStart: 'center',
        height: '35px',
        backgroundColor: '#22145a',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        position='absolute'
        top='0'
        right='0'
        backgroundColor='#22145a'
        height='35px'
        marginBottom='5px'
        webkitAppRegion='no drag'
      >
        {/* icons */}
        <Box display='flex'>
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeIcon />
            )}
          </IconButton>

          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>

          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>

          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Drag feature and title */}
      <div
        style={{
          webkitAppRegion: 'drag',
          webkitUserSelect: 'none',
          fontFamily: 'Roboto',
          fontSize: '13pt',
          fontWeight: '500',
          letterSpacing: '0.5px',
        }}
      >
        kaptn
      </div>
    </div>
  );
}

export default Topbar;
