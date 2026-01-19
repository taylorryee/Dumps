import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
import type {User} from "../pages/WorldPage"



type ForceNode = { x: number; y: number; };

export const seededRandom = (str: string) => {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h *= 16777619;
    }
    return (h >>> 0) / 4294967296;
};



export function computeUserPositions(users:User[],sessionSeed:string):User[]{
    //const numUsers = users.length
    const BASE_RADIUS = Math.sqrt(users.length) * 200
            
    const profiles = users.map((user:User)=>{
        const theta = seededRandom(user.id + sessionSeed) * 2 * Math.PI
        const r = Math.sqrt(seededRandom(user.id + "r" + sessionSeed)) * BASE_RADIUS 

        const x = r * Math.cos(theta)
        const y = r * Math.sin(theta)  
                
        return{
            ...user,
            x,
            y
        }
    })


            
    const nodes:ForceNode[] = profiles.map((user:User) => ({x:user.x ?? 0, y:user.y ?? 0 }))
            
    const CARD_WIDTH = 100; 
    const CARD_HEIGHT = 100; 
    const CARD_RADIUS = Math.sqrt(CARD_WIDTH ** 2 + CARD_HEIGHT ** 2) / 2 + 50; // +50 for distance between cards

            
    const simulation = forceSimulation(nodes) //this creates the simulation for the nodes
    .force("collide", forceCollide(CARD_RADIUS)) //this is the collision force, it pushes nodes apart if nodes get closer than CARD_RADIUS
    .force("x", forceX(0).strength(0.001)) // strength of force pulling node towards 0 on x axis -> 
    .force("y", forceY(0).strength(0.001)) //strengh of force pulling node towards 0 on y axis
    .stop()//Stops force simulation

    const finalsimulation = forceSimulation(nodes)
    .force("collide",forceCollide(CARD_RADIUS))
    .stop()


    for (let i = 0; i < 10; i++) simulation.tick() //runs forceSimulation variable nubmer of times -> decreaes iterations for more random distribution

    const VAR_DEPENDING_NUM_USERS = 10
    for (let i=0;i<VAR_DEPENDING_NUM_USERS;i++) finalsimulation.tick()

            // Step 3: Copy final positions back into profiles
    nodes.forEach((node, i) => {
        profiles[i].x = node.x
        profiles[i].y = node.y
    })
    
    return profiles
}
