import WelcomeModal from './Pages/WelcomeModal.jsx';
import Start from './Pages/Start.jsx';
import Cluster from './Pages/Cluster.jsx';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard.jsx';
import Topbar from './components/Topbar.js';
import Setup from './Pages/Setup.js';
import { ColorModeContext, useMode } from './theme.js';
import { CssBaseline, ThemeProvider } from '@mui/material';

function App() {
  const [theme, colorMode] = useMode();

  // Hash router is used here to optimize for static file serving from Electron
  // More information here: https://reactrouter.com/en/main/router-components/hash-router
  return (
    <HashRouter>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className='App' id='root'>
            <Topbar />
            <main className='content'>
              <Routes>
                <Route path='/' element={<Start />} />
                <Route path='/welcome' element={<WelcomeModal />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/setup' element={<Setup />} />
                <Route path='/cluster' element={<Cluster />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </HashRouter>
  );
}

export default App;
