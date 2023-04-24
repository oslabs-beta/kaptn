import Signup from './pages/Signup';
import Login from './pages/Login';
import Cluster from './pages/Cluster';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Topbar from './components/Topbar';
import SideNav from './components/Sidebar';
import Setup from './pages/Setup';
import Glossary from './pages/Glossary';
import { ColorModeContext, useMode } from './theme';
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
