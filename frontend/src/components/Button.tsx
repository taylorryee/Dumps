
type ValueProps={
    label:string
    onClick:()=>void
};

function Button({label,onClick}:ValueProps){
    return (
        <button onClick={onClick}>{label}</button>
    );
}

export default Button;