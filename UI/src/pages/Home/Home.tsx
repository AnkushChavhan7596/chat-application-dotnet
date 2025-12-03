import React, { useEffect } from 'react';
import "./Home.css";
import Sidebar from '../../components/Sidebar/Sidebar';
import Chat from '../../components/Chat/Chat';
import { startConnection } from '../../services/signalRService';

const Home = () => {

  // Initialize signalR
  // useEffect(() => {
  //   startConnection();
  // }, []);

  return (
    <div className="home">

      <div className="container">
        <Sidebar />
        <Chat />
      </div>

    </div>
  )
}

export default Home