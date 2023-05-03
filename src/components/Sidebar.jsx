import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useState, useContext } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  AutoFixHigh,
  MenuBook,
  ExitToAppOutlined,
  HomeOutlined,
  LightMode,
  BarChart,
  DarkModeOutlined,
} from '@mui/icons-material';
import Grid from '@mui/system/Unstable_Grid';
import { ColorModeContext } from '../theme.ts';

function SideNav(props) {
  // Color theme is toggled here with the light/dark mode menu item
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Grid xs={props.spacing} container>
      <Sidebar defaultCollapsed backgroundColor=''>
        <Menu>
          <Box paddingLeft={isCollapsed ? undefined : '0%'}>
            <Link to='/dashboard'>
              <MenuItem
                id='dashboard-nav'
                icon={<HomeOutlined />}
              ></MenuItem>
            </Link>

            <Link to='/setup'>
              <MenuItem id='setup-nav' icon={<AutoFixHigh />}></MenuItem>
            </Link>

            <Link to='/cluster'>
              <MenuItem id='cluster-nav' icon={<BarChart />}></MenuItem>
            </Link>

            <Link to='/glossary'>
              <MenuItem
                id='glossary-nav'
                icon={<MenuBook />}
                color='white'
              ></MenuItem>
            </Link>

            <Link to='/'>
              <MenuItem
                id='logout-nav'
                icon={<ExitToAppOutlined />}
              ></MenuItem>
            </Link>

            <MenuItem id='light-dark-button'>
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === 'dark' ? (
                  <DarkModeOutlined />
                ) : (
                  <LightMode />
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
