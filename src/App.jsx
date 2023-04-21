import Signup from './components/Signup';
import Login from './components/Login';
import Cluster from './Pages/Grafana/Cluster';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Topbar from './components/Topbar';
import SideNav from './components/Sidebar';
import Setup from './components/Setup';
import Glossary from './components/Glossary';
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
        <div className="App" id='root'>
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
