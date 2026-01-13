import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import CreateAccountPage from "./pages/CreateAccountPage"
import HomePage from "./pages/HomePage"
import ProtectedRoute from "./ProtectedRoute"
import MindPage from "./pages/MindPage"
import TimelinePage from "./pages/TimelinePage"
import WorldPage from "./pages/WorldPage"
//This is root component. Composes all other components for layout and structure. Holds top level state + routing
function App(){

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
        <Route path="/createAccount" element={<CreateAccountPage/>}/>
        <Route path ="mind" element={<ProtectedRoute><MindPage/></ProtectedRoute>}/>
        <Route path="timeline" element={<ProtectedRoute><TimelinePage/></ProtectedRoute>}/>
        <Route path="/world" element={<ProtectedRoute><WorldPage/></ProtectedRoute>}/>
      </Routes>
    </div>

  );
}

export default App;





