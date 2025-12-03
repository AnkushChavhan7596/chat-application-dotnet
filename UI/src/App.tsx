import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Home from './pages/Home/Home';
import ProtectedRoute from './helpers/ProtectedRoute';
import PublicRoute from './helpers/PublicRoute';
import { useEffect } from 'react';
import { getLoggedInUser } from './utils/auth';
import { setUser } from './store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { setCurrentChat } from './store/slices/chatSlice';
import { getCurrentChatFromLocal } from './utils/chat';
import { startConnection } from './services/signalRService';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },

]);

function App() {
  const dispatch = useDispatch();

  const loadLoggedInUser = () => {
    // load user from local and set in store, (persistence)
    const loggedInUser = getLoggedInUser();

    // set user in store
    dispatch(setUser({
      id: loggedInUser?.id,
      email: loggedInUser?.email,
      displayName: loggedInUser?.displayName,
      roles: loggedInUser?.roles,
      token: loggedInUser?.token
    }));

    // load current chat from local and set in store (persistence)
    const currentChat = getCurrentChatFromLocal();

    // set current chat in store
    dispatch(setCurrentChat(currentChat));
  }

  useEffect(() => {
    loadLoggedInUser()
  }, []);

  // // Initialize signalR
  // useEffect(() => {
  //   startConnection();
  // }, []);

  return <RouterProvider router={router} />;
}

export default App
