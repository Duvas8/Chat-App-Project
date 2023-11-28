import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import  {ContactsProvider}  from "./context/ContactsProvider";
import  {ConverstionsProvider}  from "./context/ConverstionsProvider.jsx";
import  {GroupsProvider}  from "./context/GroupsProvider.jsx";
import { SocketProvider } from "./context/SocketProvider.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <AuthProvider>
        <SocketProvider>
          <ContactsProvider>
            <GroupsProvider>
              <ConverstionsProvider>
                <App />
                </ConverstionsProvider>
            </GroupsProvider>
          </ContactsProvider> 
        </SocketProvider>
        </AuthProvider>
    </BrowserRouter> 
  </React.StrictMode>,
)
