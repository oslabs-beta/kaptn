import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Cluster from './pages/Cluster.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Topbar from './components/Topbar.jsx';
import SideNav from './components/Sidebar.jsx';
import Setup from './pages/Setup.jsx';
import Glossary from './pages/Glossary.jsx';
import { ColorModeContext, useMode } from './theme.js';
import { CssBaseline, ThemeProvider } from '@mui/material';

const routes = createBrowserRouter([
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/setup',
    element: <Setup />,
  },
  {
    path: '/glossary',
    element: <Glossary />,
  },
  {
    path: '/cluster',
    element: <Cluster />,
  },
]);

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='App' id='root'>
          <Topbar />
          {/* <SideNav /> */}
          <main className='content'>
            <RouterProvider router={routes} />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
