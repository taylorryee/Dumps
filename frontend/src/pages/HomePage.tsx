import Button from "../components/Button"
import {useAuth} from "../AuthContext"
import AutoSizeTextInput from "../components/AutoSizeTextInput"
import api from "../api"
import {useState} from "react"

function HomePage(){
    const auth = useAuth()
    const [text,changeText]=useState("")
    
    const createDump = async () =>{
        try{
            const response = await api.post("/dump/",{text})
            console.log(response.data,"dump created")

        }catch(err:any){
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);

        }
    }
    
    
    return(
        <div>

        <Button label = "logout" onClick = {auth.logout}/>
        <h1>Daily dump number 67</h1>
        <AutoSizeTextInput value = {text} changeText={changeText}/>
        <Button label = "submit" onClick = {createDump}/>

        </div>
    );
}

export default HomePage;