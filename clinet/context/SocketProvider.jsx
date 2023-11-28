import React, { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import AuthContext from './AuthProvider';

const SocketContext = createContext({});

export const SocketProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);

  // Initialize the socket instance inside the component
  const socket = io('http://localhost:3000', {
    autoConnect: false,
    query: { id: auth.id },
    withCredentials: true,
  });

  // State to hold the socket instance
  

  // Optional: You can add event listeners or other socket logic here
  // useEffect(() => {
  //   console.log('Socket created:', socket);

  //   // Example: Add a "connect" event listener
  //   socket.on('connect', () => {
  //     console.log('Socket connected');
  //   });

  //   socket.on('connect_error', (error) => {
  //     console.error('Socket connection error:', error);
  //   });

  //   socket.on('connect_timeout', (timeout) => {
  //     console.error('Socket connection timeout:', timeout);
  //   });

  //   // Clean up event listeners when the component unmounts
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [auth.id, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
