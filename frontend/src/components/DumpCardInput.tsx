import {useState} from "react"
import api from "../api"
import Button from "../components/Button"
import TextInput from "../components/TextInput"
import styles from "./DumpCardInput.module.css"

type Input = {
    text:string;
    onChange:(text:string) => void;
}

function DumpCardInput({text,onChange}:Input){


    //const [text,setText] = useState("")
    
    const [expanded,toggleExpand] = useState(false)

    return(
        <div onClick = {()=>toggleExpand(!expanded)} className = {expanded ? styles.expanded: styles.card}>
            <textarea value ={text} onChange = {(e)=>onChange(e.target.value)} className={styles.textarea}/>
        </div>
    );
}

export default DumpCardInput;