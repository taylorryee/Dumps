import {useState,useEffect,useRef} from "react"
import api from "../api"

type Dump = {
    id:number
    created_at:string
    text:string

}

function DailyPairPage(){

    const [yourDumps,setYourDumps] = useState<Dump[]>([])
    const [pairDumps,setPairDumps] = useState<Dump[]>([])
    const [timelineID,setTimelineID] = useState(0)
    const [pairID,setPairID]=useState(0)


    const wsRef = useRef<WebSocket | null>(null)

    const getDumps = async () => {
        try{
            const response = await api.get("/dump/all")
            const pairData = await api.get("/user/pair")

            setYourDumps(response.data)
            setPairDumps(pairData.data.dumps)
            setPairID(pairData.data.id)

            setTimelineID(pairData.data.timeline_id)

        }catch(err:any){
            console.error(err)
        }
    }
    useEffect(()=>{getDumps()},[])

    useEffect(()=>{
        if(timelineID==0)return;

        const token = localStorage.getItem("token")
        if(!token){
            console.log("yo ass aint logged in no token")
            return
        }
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        const backendHost = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/^http(s)?:\/\//, "");

        const ws = new WebSocket(`${protocol}://${backendHost}/dump/ws/pair/${timelineID}?token=${token}`);
        
        ws.onopen = () => {
            console.log("connected");
        };

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            if(data.user_id==pairID){
                setYourDumps((prev)=>[...prev,data.dump])
            }
            else{
                setPairDumps((prev)=>[...prev,data.dump])
            }
        };

        wsRef.current = ws

        return () => {
            ws.close();
        };
    },[timelineID,pairID])

    const sendMessage = (dump: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        const msg = {
            dump,
            created_at: new Date().toISOString(),
        };
        wsRef.current.send(JSON.stringify(msg));
    };
    
    return(
        <div>

        </div>
    );
}


export default DailyPairPage;