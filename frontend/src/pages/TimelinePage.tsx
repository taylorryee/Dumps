import DumpCard from "../components/DumpCard"
import "./TimeLinePage.css"
import api from "../api"
import {useState,useEffect} from "react"
import DumpCardInput from "../components/DumpCardInput"
import Button from "../components/Button"


type Dump = {
        id:number
        text:string
        created_at:string
    }


function TimelinePage(){

    const [dumps,setDumps] = useState<Dump[]>([])
    
    const getDumps = async () => {
        try{
            const response = await api.get("/dump/all")
            setDumps(response.data.reverse())

        
        }catch (err:any){
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);
        }
    }
    
    const createDump = async (text:string) =>{
        try{    
            const response = await api.post("/dump/",{text})
            getDumps()

        }catch(err:any){
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);
        }
    }
    
    const [text,setText] = useState("")
    useEffect(()=>{console.log(dumps)},[dumps])

    useEffect(()=>{getDumps()},[])
    
    return(
        <div className = "container">
            <div>
                <DumpCardInput text={text} onChange={setText} /> 
                <Button label = "submit" onClick={()=>createDump(text)}/> 
            </div>

            {dumps.map(dump=>(
                
                <div key = {dump.id}>
                    <DumpCard text = {dump.text}/>

                </div>
                
            ))}


        </div>

    );
}

export default TimelinePage;