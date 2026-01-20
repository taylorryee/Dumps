
import DumpCard from "../components/DumpCard"


type Dump = {
    id:number
    text:string
    created_at:string
}

type User ={
    id:number
    username:string
    dumps:Dump[]
}
type Props = {
    user:User
    isExpanded:boolean
    onExpand:()=>void
    onCollapse:()=>void
    style?: React.CSSProperties
}
function WorldUserCard({user,isExpanded,onExpand,onCollapse,style}:Props){


    return(
        <div style = {{...style}}onClick = {isExpanded?onCollapse:onExpand}>
            {user.dumps[0] && <DumpCard text={user.dumps[0].text} date={""} />}
            {isExpanded && user.dumps.map(dump=>(
                <DumpCard text={dump.text} date=""/>    
            ))}
        </div>
    );
}

export default WorldUserCard;