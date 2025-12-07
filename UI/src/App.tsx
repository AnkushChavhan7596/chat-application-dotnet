import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Home from './pages/Home/Home';
import ProtectedRoute from './helpers/ProtectedRoute';
import PublicRoute from './helpers/PublicRoute';
import { useEffect } from 'react';
import { getLoggedInUser } from './utils/auth';
import { setOnlineUserIds, setUser } from './store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { setCurrentChat } from './store/slices/chatSlice';
import { getCurrentChatFromLocal } from './utils/chat';
import { getConnection, startConnection } from './services/signalRService';
import { useAppSelector } from './store/hooks';

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
  const currentUser = useAppSelector((state) => state.auth.user);

  const loadLoggedInUser = () => {
    // load user from local and set in store, (persistence)
    const loggedInUser = getLoggedInUser();

    // set user in store
    dispatch(setUser({
      id: loggedInUser?.id,
      email: loggedInUser?.email,
      displayName: loggedInUser?.displayName,
      roles: loggedInUser?.roles,
      token: loggedInUser?.token,
      lastSeen: loggedInUser?.lastSeen
    }));

    // load current chat from local and set in store (persistence)
    const currentChat = getCurrentChatFromLocal();

    // set current chat in store
    dispatch(setCurrentChat(currentChat));
  }

  // load logged in user
  useEffect(() => {
    loadLoggedInUser()
  }, []);

  // Connecting to signalR
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let conn: any;

    const init = async () => {
      await startConnection();    // Start SignalR first
      conn = getConnection();     // Now get connection
      if (!conn) return;

      // Listen for online user updates
      conn.on("OnlineUsersUpdated", (userIds: string[]) => {
        dispatch(setOnlineUserIds(userIds));
      });
    };

    init();

    return () => {
      if (conn) {
        conn.off("OnlineUsersUpdated");
      }
    };
  }, [currentUser]);

  return <RouterProvider router={router} />;
}

export default App
