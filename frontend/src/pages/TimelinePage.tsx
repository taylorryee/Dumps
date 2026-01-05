import DumpCard from "../components/DumpCard"
import "./TimeLinePage.css"
import api from "../api"
import {useState,useEffect} from "react"

function TimelinePage(){
    type Dump = {
        id:number
        text:string
        created_at:string
    }

    const [dumps,setDumps] = useState<Dump[]>([])
    
    const getDumps = async () => {
        try{
            const response = await api.get("/dump/all")
            setDumps(response.data)
        
        }catch (err:any){
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);
        }
    }

    useEffect(()=>{getDumps()},[])
    
    return(
        <div className = "container">
            {dumps.map(dump=>(
                <div key = {dump.id}>
                    <DumpCard text = {dump.text}/>
                </div>
            ))}

        </div>

    );
}

export default TimelinePage;