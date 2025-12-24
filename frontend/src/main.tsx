
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import {AuthProvider} from "./AuthContext"
 //tells React where to mount the app, and React internally manages the Virtual DOM and updates the browser DOM efficiently
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
          <App />
    </AuthProvider>

  </BrowserRouter>,
)
