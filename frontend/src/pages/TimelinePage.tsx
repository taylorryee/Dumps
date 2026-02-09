import DumpCard from "../components/DumpCard"
import styles from "./TimelinePage.module.css"
import api from "../api"
import {useState,useEffect,useRef} from "react"
import DumpCardInput from "../components/DumpCardInput"
import Button from "../components/Button"



type Dump = {
        id:number
        text:string
        created_at:string
        color?:string
    }


function TimelinePage(){

//************************************** STATE + REF ******************************************************************** */
    const [dumps,setDumps] = useState<Dump[]>([])
    const [text,setText] = useState("")
    
    const [cursor,setCursor]=useState<null | number>(null)
    const [loading,setLoading]=useState(false)
    const [moreData,setMoreData]=useState(true)

    const endTimelineRef = useRef<HTMLDivElement>(null)
    const timelineRef = useRef<HTMLDivElement>(null)

/*************************************** BACKGROUND COLOR **************************************************** */
    const colors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99"]; // example palette
    const getColorForDate = (date: string) => {
        const hash = date.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const assignColors = (dumps:Dump[])=>{
        const coloredDumps = dumps.map(dump=>({
            ...dump,
            color: getColorForDate(new Date(dump.created_at).toLocaleDateString())
        }));
        return coloredDumps
    }

    //*********************************** API CALLS ************************************************************* */
    const getDumps = async () => {
        try{
            const response = await api.get("/dump/all")
            //setDumps(response.data)
            const coloredDumps = assignColors(response.data)
            setDumps(coloredDumps)


        
        }catch (err:any){
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);
        }
    }
    
    const createDump = async (text:string) =>{
        try{    
            const response = await api.post("/dump/",{text})
            const newDump:Dump = {
                ...response.data,
                color:getColorForDate(new Date(response.data.created_at).toLocaleDateString())
            } 
            
            setDumps((prev)=>{return [...prev,newDump]})
            setText("")

        }catch(err:any){
            console.error(err.response?.status);
            console.error(err.response?.data?.detail);
        }
    }





    const loadMore = async () => {
        try{

            if(!moreData || loading)return;
            
            const params = cursor ? {limit:10,cursor} : {limit:10}
            setLoading(true)
            const response = await api.get("/dump/paginated",{params})
            const coloredDumps=assignColors(response.data.dumps)
            setDumps((prev)=>{return[...prev,...coloredDumps]})
            setCursor(response.data.cursor)
            setMoreData(response.data.moreData)
            setLoading(false)


        }catch(err:any){
            console.error(err)
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //useEffect(()=>{getDumps()},[])
    //useEffect(()=>{console.log(loading,"loading rn")},[loading])
    useEffect(() => {
        if (!moreData) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadMore();
            }},
            {rootMargin: "0px 200px 0px 0px" } // load early
        );

        if (endTimelineRef.current) {
            observer.observe(endTimelineRef.current);
        }

        return () => observer.disconnect();
    }, [moreData, cursor]);


    useEffect(()=>{console.log(dumps,cursor,moreData,"dumps, cursor and moreData flag")},[cursor])
    
    return(
        <div>
            <div className ={styles.timelineWrapper} ref={timelineRef}> 
 
                <div className={styles.timelineCardSpacer} style = {{backgroundColor:"#358792",height:"100vh"}}/> 

                <div className={styles.colorWrapper}>
                    
                    <div className={styles.sectionBackground} style = {{backgroundColor:"#358792"}}/>
                    
                    <div className={styles.inputCard}>
                        <DumpCardInput text={text} onChange={setText} />    
                        <Button label="submit" onClick={()=>createDump(text)}/> 
                    </div>

                </div>

                <div className = {styles.timelineCardContainer}> 
                    {[...dumps].reverse().map(dump=>(
                        <div key = {dump.id} className={styles.colorWrapper}>
                                
                                <div className = {styles.sectionBackground} style={{backgroundColor: dump.color}}/>
                                
                                <div className = {styles.cardDate}>
                                    <DumpCard text = {dump.text} date=""/>
                                    <h1>{new Date(dump.created_at).toLocaleTimeString()}</h1>
                                </div>
                        
                        </div>
                    ))}
                </div>
                
                <div ref={endTimelineRef}/>


            </div>



        </div>
    );
}

export default TimelinePage;