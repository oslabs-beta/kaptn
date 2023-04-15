import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar'


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
  }
]);

function App() {
  const [theme, colorMode] = useMode();
  // useMode hook is for applying dark and light mode easily
  return (
<<<<<<< HEAD
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App" id='root'>
          <main className='content'>
            <RouterProvider router={routes} />
          </main>
          
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    
=======
    <div className='App'>
      <RouterProvider router={routes} />
    </div>
>>>>>>> dev
  );
}

export default App;
