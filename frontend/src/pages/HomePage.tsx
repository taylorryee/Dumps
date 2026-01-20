import Button from "../components/Button"


import api from "../api"
import {useState} from "react"
import styles from "./HomePage.module.css"
import {Link} from "react-router-dom"

import DumpCardInput from "../components/DumpCardInput"

function HomePage(){

    const [text,setText]=useState("")
    
    const createDump = async (text:string) =>{
        try{
            const response = await api.post("/dump/",{text})
            setText("")
            console.log(response.data,"dump created")

        }catch(err:any){
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);

        }
    }
    
    
    return(
        <div className={styles.page}>
            <div className={styles.inputContainer}>
                <DumpCardInput text = {text} onChange={setText}/>
                <Button label="submit" onClick ={()=>{createDump}}/>               
            </div>

            <div className={styles.yourWorldContainer}>
                <Link to="/timeline">Your World</Link>

            </div>

            <div className={styles.worldContainer}>
                <Link to="/world">Da World</Link>
            </div>

            <div className = {styles.friendsWorldContainer}>

                <Link to="/friends">Friends World</Link>
            </div>






        </div>
    );
}

export default HomePage;