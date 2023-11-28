import React from 'react';
import Sidebar from './Sidebar';
import Conversation from './Conversation';
import GroupsConversation from './GroupsConversation'
import ConvarstionContext from '../context/ConverstionsProvider'
import  SocketContext  from "../context/SocketProvider";
import  AuthContext  from "../context/AuthProvider";
import { useContext , useEffect } from 'react';

import axios from 'axios';


function Dashboard() {
  const { auth } = useContext(AuthContext);
  const {socket} = useContext(SocketContext)
  const {isGroupConversation} = useContext(ConvarstionContext)
  

  useEffect(() => {
    if (auth.id) {
        // Establish a Socket.IO connection only if auth.id is defined
        socket.connect();
        console.log('Socket created:', socket);
        // Handle connection errors
        socket.on("connect_error", (error) => {
            console.log("Socket.IO connection error:", error);
        });

        // Return a cleanup function to disconnect when the component unmounts
        return () => {
            socket.disconnect();
        };
    }
}, [auth.id, socket]);
  
  const tryrefresh = async() => {
    try {
      const response = await axios.get(
        'http://localhost:3000/refresh',
    
        {
         withCredentials:true
        }
      ) 
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <Sidebar  />
    {isGroupConversation ? (<GroupsConversation/>):(<Conversation/>)}
    
    <button onClick={() => tryrefresh()}> try refresh</button> 
    </section>
  );
}

export default Dashboard;
