import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/Dashboard';

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
  return (
    <div className='App'>
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
