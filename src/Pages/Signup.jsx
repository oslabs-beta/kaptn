import { Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import { Backdrop, Button } from '@mui/material';
import { ColorModeContext, useMode } from '../theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

function Signup() {
  const [theme, colorMode] = useMode();
  return (
    <>
      <div
        style={{
          position: 'absolute',
          color: 'white',
          top: '17.2%',
          left: '13.7%',
          width: '800px',
          height: '550px',
          backgroundColor: '#5753af',
          zIndex: '15950',
          borderRadius: '20px',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0px 0px 10px 10px rgb(0, 0, 0, 0.3)',
        }}
      >
        {' '}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'center',
            paddingTop: '3%',
            fontFamily: 'Outfit',
            fontWeight: '900',
            fontSize: '34px',
            textShadow: '2px 2px 10px rgb(0, 0, 0, 0.5)',
          }}
        >
          Welcome to Kaptn!
        </div>
        <div
          style={{
            display: 'block',
            flexDirection: 'row',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center',
            margin: '3% 40px 0 40px',
            // fontFamily: 'Outfit',
            fontWeight: '300',
            fontSize: '22px',
          }}
        >
          If this is your <strong> first time </strong> using Kuberentes, please
          use the links below to install kubectl commands locally BEFORE trying
          to use Kaptn*:
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            textAlign: 'left',
            alignItems: 'start',
            margin: '3% 40px 0 40px',
            paddingLeft: '240px',
            // fontFamily: 'Outfit',
            fontWeight: '700',
            fontSize: '20px',
          }}
        >
          <a
            href='https://kubernetes.io/docs/tasks/tools/install-kubectl-macos'
            target='blank'
          >
            Install kubectl on Mac
          </a>

          <a
            href='https://kubernetes.io/docs/tasks/tools/install-kubectl-windows'
            target='blank'
          >
            Install kubectl on Windows
          </a>

          <a
            href='https://kubernetes.io/docs/tasks/tools/install-kubectl-linux'
            target='blank'
          >
            Install kubectl on Linux
          </a>
        </div>
        <div
          style={{
            display: 'block',
            flexDirection: 'row',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center',
            margin: '3% 40px 0 40px',
            // fontFamily: 'Outfit',
            fontWeight: '300',
            fontSize: '22px',
          }}
        >
          Before using kubectl commands, please make sure your{' '}
          <strong> Docker and/or clusters are up and running! </strong>
        </div>
        <Link to='/dashboard'>
          <Button
            variant='contained'
            type='submit'
            size='large'
            sx={{
              position: 'relative',
              top: '3%',
              left: '36.5%',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '22px',
              fontFamily: 'Outfit',
              transitionProperty: 'background-image',
              transition: 'all 2s',
              mozTransition: 'all 2s',
              webkitTransition: 'all 2s',
              oTransition: 'all 2s',
              zIndex: '15950',
              borderRadius: '10px',
              border:
                theme.palette.mode === 'dark'
                  ? '1px solid #68617f'
                  : '3px solid #9621f9',
              letterSpacing: '1.5px',
              backgroundColor:
                theme.palette.mode === 'dark' ? '#22145a' : '#3c3c9a',
              mt: 2,
              // mb: 3,
              ':hover': {
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#a021f9' : '#8e77ec',
                backgroundImage:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(to right top, #dc44e3, #c53fe0, #ac3add, #9237d9, #7634d5, #6c33d6, #6132d8, #5432d9, #5f32e1, #6933e9, #7433f0, #7f32f8)'
                    : 'linear-gradient(to right bottom, #5d2aed, #7329e7, #8529e1, #932adc, #9f2cd6, #a12dd7, #a32ed8, #a52fd9, #9e2fe0, #952fe8, #8b30f0, #7f32f8);',
                border:
                  theme.palette.mode === 'dark'
                    ? '1px solid #af21f9'
                    : '3px solid #9621f9',
              },
            }}
          >
            START KAPTN!
          </Button>
        </Link>
        <div
          style={{
            display: 'block',
            flexDirection: 'row',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center',
            margin: '5.5% 100px 0 100px',
            // fontFamily: 'Outfit',
            fontWeight: '300',
            fontSize: '17px',
          }}
        >
          {' '}
          * It is strongly recommended that those new to Kubernetes visit the Easy
          Setup page on the left to use the Kaptn Learning Center!
        </div>
      </div>
      <Link to='/dashboard'>
        <div
          style={{
            backgroundColor: '#00000080',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: '0',
            right: '0',
            zIndex: '15949',
            width: '100%',
            height: '100%',
          }}
        ></div>
      </Link>
      <Dashboard />
    </>
  );
}

export default Signup;
