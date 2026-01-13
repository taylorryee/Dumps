import api from "../api"
import {useState} from "react"
import style form "WorldCard.module.css"

type Dump = {
    text:string
    created_at:string
}
type User = {
    username:string
    dumps:Dump[]
}
function WorldUserCard({username,dumps}:User){

    const [expanded,toggleExpand] = useState(false)

    return(
        <div className = >

        </div>
    );
}

export default WorldUserCard;