import DumpCard from "../components/DumpCard"
import styles from "../components/Timeline.module.css"

import DumpCardInput from "../components/DumpCardInput"
import Button from "../components/Button"



type Dump = {
        id:number
        text:string
        created_at:string
        color?:string
    }
type Props = {
    dumps:Dump[]
    sendMessage?:(text:string)=>void
    text?:string
    setText?:React.Dispatch<React.SetStateAction<string>>
}

function Timeline({dumps,text,sendMessage,setText}:Props){
    
    return(
        <div className ={styles.timelineWrapper}> 
                {text!=undefined && sendMessage && setText && 

                    <div className={styles.colorWrapper}>
    
                        <div className={styles.sectionBackground} style = {{backgroundColor:"#358792"}}/>
             
                        <div className={styles.inputCard}>
                            <DumpCardInput text={text} onChange={setText} />    
                            <Button label="submit" onClick={()=>sendMessage(text)}/> 
                        </div>
                    
                    </div>          
                }


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

export default Timeline;