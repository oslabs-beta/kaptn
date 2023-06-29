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
  DarkMode,
} from '@mui/icons-material';
import Grid from '@mui/system/Unstable_Grid';
import { ColorModeContext } from '../theme.ts';

function SideNav(props) {
  // Color theme is toggled here with the light/dark mode menu item
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  // const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Grid xs={props.spacing} container>
      <Sidebar defaultCollapsed backgroundColor='' style={{ width: '0px' }}>
        <Menu>
          <Box paddingLeft={'0'}>
            <Link to='/dashboard'>
              <MenuItem
                id='dashboard-nav'
                icon={
                  <HomeOutlined
                    style={{
                      color:
                        theme.palette.mode === 'dark' ? 'white' : '#8881ce',
                    }}
                  />
                }
              ></MenuItem>
            </Link>

            <Link to='/setup'>
              <MenuItem
                id='setup-nav'
                icon={
                  <AutoFixHigh
                    style={{
                      color:
                        theme.palette.mode === 'dark' ? 'white' : '#8881ce',
                    }}
                  />
                }
              ></MenuItem>
            </Link>

            <Link to='/cluster'>
              <MenuItem
                id='cluster-nav'
                icon={
                  <BarChart
                    style={{
                      color:
                        theme.palette.mode === 'dark' ? 'white' : '#8881ce',
                    }}
                  />
                }
              ></MenuItem>
            </Link>

            <Link to='/glossary'>
              <MenuItem
                id='glossary-nav'
                icon={
                  <MenuBook
                    style={{
                      color:
                        theme.palette.mode === 'dark' ? 'white' : '#8881ce',
                    }}
                  />
                }
                color='white'
              ></MenuItem>
            </Link>

            <Link to='/'>
              <MenuItem
                id='logout-nav'
                icon={
                  <ExitToAppOutlined
                    style={{
                      color:
                        theme.palette.mode === 'dark' ? 'white' : '#8881ce',
                    }}
                  />
                }
              ></MenuItem>
            </Link>

            <MenuItem id='light-dark-button' style={{position:"fixed", bottom: "10px", left: "0"}}>
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === 'dark' ? (
                  <LightMode style={{ color: '#ac98fa' }} />
                ) : (
                  <DarkMode style={{ color: '#5456ac' }} />
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
