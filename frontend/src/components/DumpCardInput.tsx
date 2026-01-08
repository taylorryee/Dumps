import {useState,useRef,useEffect,useCallback} from "react"

import styles from "./DumpCardInput.module.css"

type Input = {
    text:string;
    onChange:(text:string) => void;
}

function DumpCardInput({text,onChange}:Input){

    const focusRef= useRef<HTMLTextAreaElement>(null)
    
    const [expanded,toggleExpand] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    
    const handleClickOutside = useCallback((event:MouseEvent)=>{
        if (expanded && containerRef.current && !containerRef.current.contains(event.target as Node)){
            toggleExpand(false);
        }
    },[expanded])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    
    }, [handleClickOutside]);

    
    useEffect(()=>{
        if (focusRef.current){
            focusRef.current.focus()
        }

    },[])

    return(
        <div  ref={containerRef} onClick = {expanded ? ()=>{} : ()=>toggleExpand(true)} className = {expanded ? styles.expanded: styles.card}>
            
            <textarea ref = {focusRef} value ={text} onChange = {(e)=>onChange(e.target.value)} className={styles.textarea}/>
        </div>
    );
}

export default DumpCardInput;