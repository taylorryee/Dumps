import DumpCard from "../components/DumpCard"
import styles from "./TimeLinePage.module.css"
import api from "../api"
import {useState,useEffect,useRef} from "react"
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


    const cardRef = useRef<HTMLDivElement>(null)    
    
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
  
            <div className ={styles.timelineWrapper}>
                <div className={styles.timelineCardSpacer}/>
                <div className={styles.inputCard}>
                    <DumpCardInput text={text} onChange={setText} />    
                    <Button label="submit" onClick={()=>createDump(text)}/> 
                </div>

                <div className = {styles.timelineCardContainer}> 
                    {[...dumps].reverse().map(dump=>(
                        <div key = {dump.id} className={styles.cardDate}>
                            <DumpCard text = {dump.text} date=""/>
                            <h1>{new Date(dump.created_at).toLocaleTimeString()}</h1>
                        </div>
                    ))}
                </div>

            </div>      



    );
}

export default TimelinePage;