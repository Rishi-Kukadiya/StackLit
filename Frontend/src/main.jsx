import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router";
import App from './App.jsx'
import './index.css'
// createRoot(document.getElementById('root')).render(
    // <BrowserRouter>
    // <App />
    // </BrowserRouter>
// )
try {
  createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
} catch (error) {
  console.error("Rendering failed", error);
}

