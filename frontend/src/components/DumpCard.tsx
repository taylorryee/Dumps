import {useState,useCallback,useRef,useEffect} from "react"
import styles from "./DumpCard.module.css"

type Dump ={
    text:string
    date:string
}


function DumpCard({text,date}:Dump){

    const [expanded,setExpanded] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)

    const handleClickOutside = useCallback((event:MouseEvent)=>{
        if(containerRef.current && expanded && !containerRef.current.contains(event.target as Node)){
            setExpanded(false)
        }

    },[expanded])


    useEffect(()=>{

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    },[handleClickOutside])
    

    
    return(
        <div ref = {containerRef} onClick = {!expanded?()=>setExpanded(true):()=>{}} className={expanded ? styles.expanded : styles.card}>
            <h1 className = {styles.text}>{text}{date}</h1>
        </div>

    );
}

export default DumpCard;