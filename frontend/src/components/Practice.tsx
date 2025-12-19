import { useState } from "react";

function Practice(){
    
    const [count,setCount] = useState(0)//useState(0) creates a piece of state for this component and initializes it to 0.
//count holds the current state value, and setCount is the function React provides to update that state.
//When setCount is called (for example, when clicking the button), React updates the state and re-runs the App component with the new value, causing the UI to update.

//State lives in React, not in your function
//Your component is a snapshot of that state at render time
//setCount asks React for a new snapshot

    const incrementCount = () => {setCount(prevCount=>prevCount+1)}//These are event handlers, in this case its the event for clicking the incremnt buton
  //This line literally means Define a function called handleIncrementClick that takes no arguments and runs setCount(count + 1)”
  // => means "this is a function"
    const decrementCount = () => {setCount(prevCount=>prevCount-1)}
    
    return(<div>
                <h1>Counter</h1>
                <p>Count is {count}</p>
                <button onClick = {incrementCount}>
                    Increment
                </button>
                <button onClick = {decrementCount}>
                    Decrement
                </button>
    </div>

    )//onClick={} In react each element has a prop called onClick. Then you can declare a function to run if 
//element is clicked by doing ()=>function(param)

}

export default Practice