import DumpCard from "../components/DumpCard"
import styles from "./TimelinePage.module.css"
import api from "../api"
import {useState,useEffect} from "react"
import DumpCardInput from "../components/DumpCardInput"
import Button from "../components/Button"



type Dump = {
        id:number
        text:string
        created_at:string
        color?:string
    }


function TimelinePage(){

//************************************** STATE ******************************************************************** */
    const [dumps,setDumps] = useState<Dump[]>([])
    const [text,setText] = useState("")

//*************************************** BACKGROUND COLOR **************************************************** */
    const colors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99"]; // example palette
    const getColorForDate = (date: string) => {
        const hash = date.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const assignColors = (dumps:Dump[])=>{
        const coloredDumps = dumps.map(dump=>({
            ...dump,
            color: getColorForDate(new Date(dump.created_at).toLocaleDateString())
        }));
        setDumps(coloredDumps)
    }

    //*********************************** API CALLS ************************************************************* */
    const getDumps = async () => {
        try{
            const response = await api.get("/dump/all")
            //setDumps(response.data)
            assignColors(response.data)

        
        }catch (err:any){
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);
        }
    }
    
    const createDump = async (text:string) =>{
        try{    
            const response = await api.post("/dump/",{text})
            const newDump:Dump = {
                ...response.data,
                color:getColorForDate(new Date(response.data.created_at).toLocaleDateString())
            } 
            
            setDumps((prev)=>{return [...prev,newDump]})
            setText("")

        }catch(err:any){
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);
        }
    }
    
    useEffect(()=>{getDumps()},[])

    return(

            <div className ={styles.timelineWrapper}> 
 
                <div className={styles.timelineCardSpacer} style = {{backgroundColor:"#358792",height:"100vh"}}/> 

                <div className={styles.colorWrapper}>
                    
                    <div className={styles.sectionBackground} style = {{backgroundColor:"#358792"}}/>
                    
                    <div className={styles.inputCard}>
                        <DumpCardInput text={text} onChange={setText} />    
                        <Button label="submit" onClick={()=>createDump(text)}/> 
                    </div>

                </div>

                <div className = {styles.timelineCardContainer}> 
                    {[...dumps].reverse().map(dump=>(
                        <div key = {dump.id} className={styles.colorWrapper}>
                                
                                <div className = {styles.sectionBackground} style={{backgroundColor: dump.color}}/>
                                
                                <div className = {styles.cardDate}>
                                    <DumpCard text = {dump.text} date=""/>
                                    <h1>{new Date(dump.created_at).toLocaleTimeString()}</h1>
                                </div>
                        
                        </div>
                    ))}
                </div>

   
            
            </div>
    );
}

export default TimelinePage;