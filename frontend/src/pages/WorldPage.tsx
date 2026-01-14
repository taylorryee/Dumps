import api from "../api"
import { useState, useEffect,useRef } from "react"
import WorldUserCard from "../components/WorldUserCard"

type Dump = {
    id: number
    text: string
    created_at: string
}
type User = {
    id: number
    username: string
    dumps: Dump[]
    x?: number
    y?: number
}

// Seeded random function
const seededRandom = (str: string) => {
    let h = 2166136261; // FNV-1a hash base
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i)
        h *= 16777619
    }
    return (h >>> 0) / 4294967296
}

function WorldPage() {
// *****************Session seed (persistent per session)*********************************************************
    let sessionSeed = sessionStorage.getItem("worldSeed")
    if (!sessionSeed) {
        sessionSeed = Math.random().toString(36).substring(2)
        sessionStorage.setItem("worldSeed", sessionSeed)
    }
 
    
 //***************************************STATE********************************************************************* */
    const [expandedUserID, setExpandedUserID] = useState<number | null>(null)
    const [userProfiles, setUserProfiles] = useState<User[]>([])

    
    const [cameraX, setCameraX] = useState(0)
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
    const getUserProfiles = async () => {
        const BASE_RADIUS = 500 // Base radius for clustering near center
        try {
            const response = await api.get("/user/all")
            const profiles = response.data.map((user: User, index: number) => {

                // Polar coordinates for clustering
                const theta = seededRandom(user.id + sessionSeed) * 2 * Math.PI
                const r = Math.sqrt(seededRandom(user.id + "r" + sessionSeed)) * BASE_RADIUS

                const x = r * Math.cos(theta)
                const y = r * Math.sin(theta)

                return {
                    ...user,
                    x,
                    y
                }
            })

            setUserProfiles(profiles)
        } catch (err: any) {
            console.error(err)
        }
    }

    useEffect(() => { getUserProfiles() }, [])
    useEffect(() => { console.log(userProfiles) }, [userProfiles])

//***********************************VISIBLE USERS************************************************************ */
    const visibleUsers = userProfiles.filter(user=>{
        if(user.x==undefined || user.y==undefined)return false
        return(
            user.x > cameraX - viewport.width/2 - 200 && 
            user.x < cameraX + viewport.width/2 + 200 && 
            user.y > cameraY - viewport.height/2 - 200 &&
            user.y < cameraY + viewport.height/2 + 200 
        )
    })
//*********************************** RENDER ******************************************************************** */
     return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        cursor: isDragging.current ? "grabbing" : "grab",
      }}
    >
      {visibleUsers.map(user => {
        const screenX =
          user.x! - cameraX + viewport.width / 2
        const screenY =
          user.y! - cameraY + viewport.height / 2

        return (
          <WorldUserCard
            key={user.id}
            user={user}
            isExpanded={expandedUserID === user.id}
            onExpand={() => setExpandedUserID(user.id)}
            onCollapse={() => setExpandedUserID(null)}
            style={{
              position: "absolute",
              left: screenX,
              top: screenY,
            }}
          />
        )
      })}
    </div>
    )

    /*return (
        <div>
            {userProfiles.map(user => (
                <WorldUserCard
                    key={user.id}
                    user={user}
                    isExpanded={expandedUserID === user.id}
                    onExpand={() => setExpandedUserID(user.id)}
                    onCollapse={() => setExpandedUserID(null)}
                />
            ))}
        </div>
    )*/
}

export default WorldPage
