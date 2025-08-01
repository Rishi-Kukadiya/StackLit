import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router";
import App from './App.jsx'
import './index.css'
import { SocketProvider } from './contexts/SocketContext.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
        <App />
  </BrowserRouter>
);
