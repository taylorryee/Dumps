
type ValueProps = {
    label:string
    value:string
    onChange:(input:string)=>void
};

function TextInput({label,value,onChange}:ValueProps){

    return(
        <div>
            <label>
                {label}
                <input value={value} onChange={(e)=>{onChange(e.target.value)}}/>
            </label>
        </div>
    );
}

export default TextInput;