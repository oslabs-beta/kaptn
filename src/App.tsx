import Signup from './Pages/Signup.jsx';
import Login from './Pages/Login.jsx';
import Cluster from './Pages/Cluster.jsx';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard.jsx';
import Topbar from './components/Topbar2.jsx';
import Setup from './Pages/Setup.jsx';
import Glossary from './Pages/Glossary.jsx';
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
                <Route path='/' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/setup' element={<Setup />} />
                {/* <Route path='/glossary' element={<Glossary />} /> */}
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
