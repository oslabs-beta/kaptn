import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import React from 'react';
import { useState, useContext } from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { AutoFixHigh, MenuBook } from '@mui/icons-material';
import { BarChart } from '@mui/icons-material';
import Grid from '@mui/system/Unstable_Grid';
import { ColorModeContext } from '../theme';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

function SideNav(props) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Grid xs={props.spacing} container>
      <Sidebar defaultCollapsed backgroundColor=''>
        <Menu>
          <Box paddingLeft={isCollapsed ? undefined : '0%'}>
            <Link to='/dashboard'>
              <MenuItem icon={<HomeOutlinedIcon />}></MenuItem>
            </Link>

            <Link to='/setup'>
              <MenuItem icon={<AutoFixHigh />}></MenuItem>
            </Link>

            <Link to='/cluster'>
              <MenuItem icon={<BarChart />}></MenuItem>
            </Link>

            <Link to='/glossary'>
              <MenuItem icon={<MenuBook />} color='white'></MenuItem>
            </Link>

            <Link to='/'>
              <MenuItem icon={<ExitToAppOutlinedIcon />}></MenuItem>
            </Link>

            <MenuItem>
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === 'dark' ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <LightModeIcon />
                )}
              </IconButton>
            </MenuItem>
          </Box>
        </Menu>
      </Sidebar>
    </Grid>
  );
}

export default SideNav;
