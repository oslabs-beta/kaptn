import { useState } from 'react';

import LightModeIcon from '@mui/icons-material/LightMode';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

const Sidebar2 = () => {
  const [isMenu1Hover, setMenu1IsHover] = useState(false);
  const [isMenu2Hover, setMenu2IsHover] = useState(false);
  const [isMenu3Hover, setMenu3IsHover] = useState(false);

  const handleMouse1Enter = () => {
    setMenu1IsHover(true);
  };

  const handleMouse1Leave = () => {
    setMenu1IsHover(false);
  };

  const handleMouse2Enter = () => {
    setMenu2IsHover(true);
  };

  const handleMouse2Leave = () => {
    setMenu2IsHover(false);
  };

  const handleMouse3Enter = () => {
    setMenu3IsHover(true);
  };

  const handleMouse3Leave = () => {
    setMenu3IsHover(false);
  };

  const sidebarStyle = {
    height: '40px',
    width: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    marginTop: '10px',
    paddingLeft: '0px',
    backgroundColor: '#201556',
    color: isMenu1Hover ? '#b2a4ea' : '#5a4c93',
  };

  const sidebar2Style = {
    height: '40px',
    width: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    marginTop: '10px',
    paddingLeft: '0px',
    backgroundColor: '#201556',
    color: isMenu2Hover ? '#b2a4ea' : '#5a4c93',
  };

  const sidebar3Style = {
    height: '40px',
    width: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    marginTop: '10px',
    paddingLeft: '0px',
    backgroundColor: '#201556',
    color: isMenu3Hover ? '#b2a4ea' : '#5a4c93',
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: '0',
        top: '34px',
        backgroundColor: '#201556',
        alignItems: 'center',
        padding: '5px',
        height: '100%',
        width: '50px',
        // borderRadius: '4px',
      }}
    >
      <div
        style={sidebarStyle}
        onMouseEnter={handleMouse1Enter}
        onMouseLeave={handleMouse1Leave}
      >
        <LightModeIcon />
      </div>
      <div
        style={sidebar2Style}
        onMouseEnter={handleMouse2Enter}
        onMouseLeave={handleMouse2Leave}
      >
        <HomeOutlinedIcon />
      </div>
      <div
        style={sidebar3Style}
        onMouseEnter={handleMouse3Enter}
        onMouseLeave={handleMouse3Leave}
      >
        <ExitToAppOutlinedIcon />
      </div>
    </div>
  );
};

export default Sidebar2;

{
  /* <div
            style={{
              position: 'absolute',
              left: '0',
              top: '69px',
              backgroundColor: '#272727',
              alignItems: 'center',
              padding: '5px',
              height: '100%',
              width: '50px',
              // borderRadius: '4px',
            }}
          >
            <div style={{ marginTop: '10px', paddingLeft: '10px' }}>
              <SettingsBackupRestoreOutlinedIcon />
            </div>
            <div style={{ marginTop: '10px', paddingLeft: '10px' }}>
              <LocalLibraryOutlinedIcon />
            </div>
            <div style={{ marginTop: '10px', paddingLeft: '10px' }}>
              <ManageAccountsOutlinedIcon />
            </div>
          </div> */
}
