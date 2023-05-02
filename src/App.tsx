import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Cluster from './pages/Cluster.jsx';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Topbar from './components/Topbar.jsx';
import Setup from './pages/Setup.jsx';
import Glossary from './pages/Glossary.jsx';
import { ColorModeContext, useMode } from './theme.js';
import { CssBaseline, ThemeProvider } from '@mui/material';

function App() {
  const [theme, colorMode] = useMode();

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
                <Route path='/glossary' element={<Glossary />} />
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
