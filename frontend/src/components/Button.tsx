import "./Button.css"

type ValueProps={
    label:string
    onClick:()=>void
};

function Button({label,onClick}:ValueProps){
    return (
        <button className = "button" onClick={onClick}>{label}</button>
    );
}

export default Button;