import {useState} from "react"
import styles from "./DumpCard.module.css"

type Dump ={
    text:string
    date:string
}

function DumpCard({text,date}:Dump){

    const [expanded,setExpanded] = useState(false)
    
    return(
        <div onClick ={()=>setExpanded(!expanded)} className={expanded ? styles.expanded : styles.card}>
            <h1 className = {styles.text}>{text}{date}</h1>
        </div>

    );
}

export default DumpCard;