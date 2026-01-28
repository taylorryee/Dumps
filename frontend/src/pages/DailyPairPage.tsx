import {useState,useEffect} from "react"
import api from "../api"

type Dump = {
    id:number
    created_at:string
    text:string

}

function DailyPairPage(){

    const [yourDumps,setYourDumps] = useState<Dump[]>([])
    const [pairDumps,setPairDumps] = useState<Dump[]>([])

    const getDumps = async () => {
        try{
            const response = await api.get("/dump/all")
            const responseTwo = await api.get("/dump/pairDumps")
            setYourDumps(response.data)
            setPairDumps(responseTwo.data)

        }catch(err:any){
            console.error(err)
        }
    }
    useEffect(()=>{console.log(yourDumps,pairDumps)},[yourDumps])
    useEffect(()=>{getDumps()},[]);
    
    return(
        <div>
            
        </div>
    );
}


export default DailyPairPage;