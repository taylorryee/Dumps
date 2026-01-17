import api from "../api"
import { useState, useEffect,useRef } from "react"
import WorldUserCardTest from "../components/WorldUserCardTest"
import { computeUserPositions } from "../utils/computeUserPositions";
import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";

export type Dump = {
    id: number
    text: string
    created_at: string
}
export type User = {
    id: number
    username: string
    dumps: Dump[]
    x?: number
    y?: number
}

type ForceNode = { x: number; y: number; };

export const seededRandom = (str: string) => {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h *= 16777619;
    }
    return (h >>> 0) / 4294967296;
};
function WorldPage() {
// *****************Session seed (persistent per session)*********************************************************
    /*let sessionSeed = sessionStorage.getItem("worldSeed")
    if (!sessionSeed) {
        sessionSeed = Math.random().toString(36).substring(2)
        sessionStorage.setItem("worldSeed", sessionSeed)
    }*/

    const sessionSeed = Math.random().toString(36).substring(2); // new seed every refresh

 
    
 //***************************************STATE********************************************************************* */
    const [expandedUserID, setExpandedUserID] = useState<number | null>(null)
    const [userProfiles, setUserProfiles] = useState<User[]>([])

    
    const [cameraX, setCameraX] = useState(0) // x,y coordinate of center of camera 
    const [cameraY, setCameraY] = useState(0)

//************************************** VIEWPORT ***********************************************************/
    const [viewport, setViewport] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    useEffect(() => {
        const onResize = () =>
        setViewport({ width: window.innerWidth, height: window.innerHeight })
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])
//**** ********************/ ---------- CAMERA DRAG ---------- **********************************************/
    const isDragging = useRef(false)
    const lastMouse = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const onMouseDown = (e: MouseEvent) => {
            isDragging.current = true
            lastMouse.current = { x: e.clientX, y: e.clientY }
        }

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return
            
            const dx = e.clientX - lastMouse.current.x
            const dy = e.clientY - lastMouse.current.y

            setCameraX(prev => prev - dx)
            setCameraY(prev => prev - dy)

            lastMouse.current = { x: e.clientX, y: e.clientY }
        }

        const onMouseUp = () => {
            isDragging.current = false
        }

        window.addEventListener("mousedown", onMouseDown)
        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mouseup", onMouseUp)

        return () => {
            window.removeEventListener("mousedown", onMouseDown)
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mouseup", onMouseUp)
        }
    }, [])

//******************************** CREATING USER PROFILES + GIVING PROFILES A COORDINATE **************************** */
    
/*const getUserProfiles = async () => { FIX THIS LATER -> ABSTRACT D3
        try{
            
            const response = await api.get("/users.all")
            const profiles = computeUserPositions(response.data,sessionSeed)
            setUserProfiles(profiles)
        
        }catch(err:any){

        }
    }*/
        const createUserProfiles = async () =>{
            try{
                const response = await api.get("/user/all")
                const profiles = computeUserPositions(response.data,sessionSeed)
                setUserProfiles(profiles)

            }catch(err:any){
                console.error(err)
            }
        }


    useEffect(() => { createUserProfiles() }, [])
    //useEffect(() => { console.log(userProfiles) }, [userProfiles])


//***********************************VISIBLE USERS************************************************************ */
    const visibleUsers = userProfiles.filter(user=>{
        if(user.x==undefined || user.y==undefined)return false
        return(
            user.x > cameraX - viewport.width/2 - 1000 && //checking if user is within right edge of viewport + 200 buffer
            user.x < cameraX + viewport.width/2 + 1000 && //left edge
            user.y > cameraY - viewport.height/2 - 1000 && //bottom edge 
            user.y < cameraY + viewport.height/2 + 1000  //top edge 
        )
    })
    //useEffect(() => {console.log("Visible users:", visibleUsers)}, [visibleUsers])

//*********************************** RENDER ******************************************************************** */
    return (
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", cursor: isDragging.current ? "grabbing" : "grab",}}>
            
            {visibleUsers.map(user => {
                const screenX = user.x! - cameraX + viewport.width / 2
                const screenY = user.y! - cameraY + viewport.height / 2
                return(
                    <WorldUserCardTest key={user.id} user={user} style={{position:"absolute",left:screenX,top:screenY}}/>

                )
            })}
        
        </div>
    )

}

export default WorldPage
