import {useState} from "react"
import styles from "./DumpCard.module.css"

type Dump ={
    text:string
}

function DumpCard({text}:Dump){

    const [expanded,setExpanded] = useState(false)
    
    return(
        <div onClick ={()=>setExpanded(!expanded)} className={expanded ? styles.expanded : styles.card}>
            <h1 className = {styles.text}>{text}</h1>
        </div>

    );
}

export default DumpCard;