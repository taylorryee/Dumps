
import {useState} from "react"
import {useNavigate,Link} from "react-router-dom"
import api from "../api"
import TextInput from "../components/TextInput"
import Button from "../components/Button"

function LoginPage(){
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const navigate = useNavigate();
    const handleLogin = async () =>{
        try{
            const response = await api.post("/user/login",{email,password})
            console.log(response.data,"ya boiz we logged in")
            
            const token = response.data.access_token
            localStorage.setItem("token", token);
            
            navigate("/home")
        
        }catch(err:any){
            console.log("dammit dude wrong login")
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);
        }

    };

    return(
        <div>
            <h1>Login</h1>
            <TextInput label="email" value = {email} onChange = {setEmail}/>
            <TextInput label="password" value={password} onChange ={setPassword}/>
            <Button label="login" onClick = {handleLogin}/>
            <h2>No account? <Link to="/createAccount">Register</Link></h2>

        </div>
    );
}

export default LoginPage