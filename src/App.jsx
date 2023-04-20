import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Cluster from './Pages/Grafana/Cluster';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Topbar from './components/Topbar';
import SideNav from './components/Sidebar'


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
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path:'/cluster',
    element: <Cluster />
  }
]);

function App() {
  const [theme, colorMode] = useMode();
  // useMode hook is for applying dark and light mode easily
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App" id='root'>
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
