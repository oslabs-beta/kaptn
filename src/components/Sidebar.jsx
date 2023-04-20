import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from 'react-pro-sidebar';
import React from 'react';
import { useState } from 'react';
// import 'react-pro-sidebar/dist/styles';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { tokens } from '../theme';
import LightModeIcon from '@mui/icons-material/LightMode';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { Button } from '@mui/material';
import { AutoFixHigh, MenuBook } from '@mui/icons-material';
import { Create } from '@mui/icons-material';
import { BarChart } from '@mui/icons-material';
import { Hub } from '@mui/icons-material';
import Grid from '@mui/system/Unstable_Grid';
// import { MenuBook } from '@mui/icons-material';

const Item = ({ title, to, icon, selected, setSlected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{ colors: colors.gray[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
      <Link to={to} />
    </MenuItem>
  );
};

function SideNav() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const { collapseSidebar } = useProSidebar();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // state for which page we are on
  const [selected, setSelected] = useState('Dashboard');

  return (
    <Grid xs={2} container>
      <Sidebar defaultCollapsed backgroundColor=''>
        <Menu>
          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : '0%'}>
            <MenuItem
              container={Link}
              href='/dashboard'
              icon={<HomeOutlinedIcon />}
              // selected={selected}
              // setSelect={setSelected}
              onClick={(e) => console.log('hi')}
            >
              Dashboard
            </MenuItem>

            <MenuItem
              container={Link}
              href='/setup'
              icon={<AutoFixHigh />}
              // selected={selected}
              // setSelect={setSelected}
            >
              <Link to='/setup'>Quick Setup</Link>
            </MenuItem>

            <MenuItem
              container={Link}
              href='/cluster'
              icon={<BarChart />}
              // selected={selected}
              // setSelect={setSelected}
            >
              <Link to='/cluster'>Kluster Visualizer</Link>
            </MenuItem>

            <MenuItem
              container={Link}
              href='/glossary'
              icon={<MenuBook />}
              // selected={selected}
              // setSelect={setSelected}
            >
              <Link to='/glossary'>Glossary</Link>
            </MenuItem>

            <MenuItem
              container={Link}
              href='/'
              icon={<ExitToAppOutlinedIcon />}
              // selected={selected}
              // setSelect={setSelected}
            >
              <Link to='/'>Log Out</Link>
            </MenuItem>
          </Box>
        </Menu>
      </Sidebar>
    </Grid>
  );
}
{
  /* </div> */
}

export default SideNav;
