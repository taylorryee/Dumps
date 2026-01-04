import {useState} from "react"
import style from "./DumpCard.module.css"

type Dump ={
    text:string
}

function DumpCard({text}:Dump){

    
    return(
        <div className={style.card}>
            <h1 className = {style.text}>{text}</h1>
        </div>

    );
}

export default DumpCard;