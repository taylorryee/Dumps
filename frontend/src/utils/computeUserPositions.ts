import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";
import type {Dump,User} from "../pages/WorldPage"



type ForceNode = { x: number; y: number; };

export const seededRandom = (str: string) => {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h *= 16777619;
    }
    return (h >>> 0) / 4294967296;
};

export function computeUserPositions(users: User[], sessionSeed: string, cardSize = 100): User[] {
    const numUsers = users.length;
    const BASE_RADIUS = Math.sqrt(numUsers) * 200; //Scaling factor for intial distance of cards from center - scales by how many users there are

    const profiles = users.map(user => { //creates the intial random positon of all the cards 
        const theta = seededRandom(user.id + sessionSeed) * 2 * Math.PI;
        const r = Math.sqrt(seededRandom(user.id + "r" + sessionSeed)) * BASE_RADIUS;
        return { ...user, x: r * Math.cos(theta), y: r * Math.sin(theta) };
    });

    const nodes: ForceNode[] = profiles.map(user => ({ x: user.x!, y: user.y! })); //Creates a node for each user -> each node has the x,y coordinates of the user
    const CARD_RADIUS = cardSize * Math.sqrt(2) + 10; 

    const simulation = forceSimulation(nodes) //creates simulation with nodes 
        .force("collide", forceCollide(CARD_RADIUS)) //creates the "force" which pushes cards apart if they are within CARD_RADIUS
        .force("x", forceX(0).strength(0.03))//The force that pulls cards towards 0 on the x axis -> stronger force pulls cards further
        .force("y", forceY(0).strength(0.03))//force that pulls cards towards 0 on y axis
        .stop();

    for (let i = 0; i < 100; i++) simulation.tick();//runs forceSimulation variable number of times -> more runs cards are pulled closer to eachother

    nodes.forEach((node, i) => {//maps the now seperated x,y coordiantes of the nodes back to the profiles
        profiles[i].x = node.x;
        profiles[i].y = node.y;
    });

    return profiles;
}



    