import {useState,useRef,useEffect} from "react"

import styles from "./DumpCardInput.module.css"

type Input = {
    text:string;
    onChange:(text:string) => void;
}

function DumpCardInput({text,onChange}:Input){

    const focusRef= useRef<HTMLTextAreaElement>(null)

    const [expanded,toggleExpand] = useState(false)
    useEffect(()=>{
        if (focusRef.current){
            focusRef.current.focus()
        }

    },[])

    return(
        <div onClick = {()=>toggleExpand(!expanded)} className = {expanded ? styles.expanded: styles.card}>
            <textarea ref = {focusRef} value ={text} onChange = {(e)=>onChange(e.target.value)} className={styles.textarea}/>
        </div>
    );
}

export default DumpCardInput;