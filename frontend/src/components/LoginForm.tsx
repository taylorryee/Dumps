import {useState} from "react"


type ValueProps={
    label:string
    value:string
    onChange:(input:string)=>void
}

// EnterValue is a reusable child component that only defines the UI for a single input.
// It does NOT manage its own state; the parent owns the state (controlled component).
// 
// The <input> element displays the current value of the input via the "value" prop.
// The "onChange" prop is an event handler that React calls whenever the user changes the input.
// In this case, the child extracts the current input value from e.target.value and passes it to
// the parent via the onChange function. The parent (LoginPage) provides a function like setEmail
// or setPassword, which updates the state. React then re-renders the child with the new value,
// keeping the input in sync with the parent state.

function EnterValue({label,value,onChange}:ValueProps){ //resuable child component
    return(
        <div>
            <label>
                {label}
                <input value={value} onChange = {(e)=>onChange(e.target.value)}/> 
            </label>

        </div>
    );

}

function LoginButton({onClick}:{onClick:()=>void}){
    return(<button onClick={onClick}>Login</button>)

}

function LoginForm(){
    const [email, setEmail] = useState(""); // email is the current state, setEmail is the state updater function that updates this state.
// Using setEmail with a value (e.g., setEmail("hello")) will replace the state with that value.
// You can also pass a function to setEmail if the new state depends on the previous state.
// For example: setEmail(prev => prev + "!") will take the current state and append "!" to it.
    const [password,setPassword] = useState("");

    const handleLogin = () => {
        console.log(email);
        console.log(password);
    };


    return(
        <div>
            <h1>Login</h1>
            <EnterValue label="Enter email" value={email} onChange = {setEmail} />
            <EnterValue label="Enter password" value={password} onChange = {setPassword}/>
            <LoginButton onClick={handleLogin} />
        </div>
    )
}

export default LoginForm