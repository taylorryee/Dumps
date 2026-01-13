import api from "../api"
import {useState,useEffect} from "react"

type Dump = {
    id:number
    text:string
    created_at:string
}
type User = {
    id:number
    username:string
    dumps:Dump[]

}
function WorldPage(){
    
    const [expandedUserID,setExpandedUserID] = useState<number | null>(null)
    const [userProfiles,setUserProfiles] = useState<User[]>([])
    
    const getUserProfiles = async () => {
        try{
            const response = await api.get("/user/all")
            setUserProfiles(response.data)
            console.log(userProfiles)
        }catch(err:any){

        }
    }
    useEffect(()=>{getUserProfiles()},[])
    useEffect(()=>{console.log(userProfiles)},[userProfiles])
    
    return(
        <div>
            <h1>Big booty boi</h1>
        </div>
    );
}

export default WorldPage;