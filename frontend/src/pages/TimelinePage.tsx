import DumpCard from "../components/DumpCard"
import styles from "./TimeLinePage.module.css"
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
        
    const [text,setText] = useState("")
    
    const getDumps = async () => {
        try{
            const response = await api.get("/dump/all")
            setDumps(response.data)

        
        }catch (err:any){
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);
        }
    }
    
    const createDump = async (text:string) =>{
        try{    
            const response = await api.post("/dump/",{text})
            setDumps((prev)=>{return [...prev,response.data]})
            setText("")

        }catch(err:any){
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);
        }
    }


    useEffect(()=>{getDumps()},[])
    
    return(
        <div className = {styles.page}>
            <div className={styles.timelineContainer}>
                <div className = {styles.timelineCardContainer}> 
                    <div className={styles.timelineCardSpacer}/>
                    <div>
                        <DumpCardInput text={text} onChange={setText} /> 
                    </div>

                    {[...dumps].reverse().map(dump=>(
                        <div key = {dump.id}>
                            <DumpCard text = {dump.text} date={new Date(dump.created_at).toLocaleString()}/>
                        </div>
                    ))}
                </div>

                <Button label="submit" onClick={()=>{setText(text)}} />
            </div>
        </div>
        


    );
}

export default TimelinePage;