import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/Dashboard';
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
  }
]);

function App() {

  // useMode hook is for applying dark and light mode easily
  return (
        <div className="App" id='root'>
          <main className='content'>
            <RouterProvider router={routes} />
          </main>
          
        </div>
    
  );
}

export default App;
