import {useState,useEffect} from 'react'
import api from "../api"
import DumpCardInput from "../components/DumpCardInput"

function MindPage(){
    type Dump ={
        id:number
        text:string
        user_id:number
        created_at:string
    }
    const [loading,setLoading]=useState(true)
    const [dumps,setDumps]=useState<Dump[]>([])

    
    const getDumps = async () =>{
        try{
            const response = await api.get("/dump/all")
            setDumps(response.data)
            console.log(dumps)
            setLoading(false)

        }catch(err:any){
            setLoading(false);
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);
        }
    }
    useEffect(() => {
        console.log(dumps);
    }, [dumps]);

    useEffect(()=>{getDumps()},[])

    
    const [text,setText] = useState("")
    
    if (loading){
        return <h1>Loading...</h1>;
    }
    return(
        <div>      
            <DumpCardInput text={text} onChange = {(newText)=>setText(newText)}/>   
            {dumps.length === 0 && <p>No dumps yet.</p>}

            {dumps.map(dump=>(
                <div key = {dump.id}>
                    <p>{dump.text}:{new Date(dump.created_at).toLocaleString()}</p>
                </div>
            ))}

        </div>
    );
}

export default MindPage;