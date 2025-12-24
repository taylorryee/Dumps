import {useState} from "react"
import Button from "../components/Button"
import TextInput from "../components/TextInput"
import api from "../api"
import {useNavigate} from "react-router-dom"

function CreateAccountPage(){
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const navigate = useNavigate()
    const HandleCreateAccount = async () =>{
        try{
            const response = await api.post("/user/create",{email,password})
            console.log(response.data,"yay acc created")
            navigate("/")

        }catch(err:any){
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);
        }

    };
    
    return(
        <div>
            <h1>Create Account</h1>
            <TextInput label="email" value={email} onChange={setEmail}/>
            <TextInput label="password" value={password} onChange={setPassword}/>
            <Button label="register" onClick = {HandleCreateAccount}/>

        </div>
    );
}

export default CreateAccountPage;