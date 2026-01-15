type Dump={
    id:number
    text:string
    created_at:string
}

type User={
    id:number
    dumps:Dump[]
}

type Props={
    user:User
    style:React.CSSProperties
}


function WorldUserCardTest({user,style}:Props){

    return(
        <div style = {{...style,         border: "1px solid #ccc", // border around the card
        borderRadius: "8px",      // rounded corners
        padding: "12px",          // spacing inside the card
        backgroundColor: "white", // optional: card background
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)", // subtle shadow
        width:"100px",
        height:"100px",
        maxHeight:"100px",
        maxWidth: "100px",        // optional: constrain width
        }}>
            <h1 style={{ margin: 0, fontSize: "16px" }}>
                {user.dumps[0]?user.dumps[0].text:"no dumps"}
            </h1>
        </div>
    )

}

export default WorldUserCardTest