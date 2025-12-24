import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import CreateAccountPage from "./pages/CreateAccountPage"
import HomePage from "./pages/HomePage"
//This is root component. Composes all other components for layout and structure. Holds top level state + routing
function App(){

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/home" element={<HomePage/>} />
        <Route path="/createAccount" element={<CreateAccountPage/>}/>
      </Routes>
    </div>

  );
}

export default App;





