import {useState} from "react";

//Child component	Defines the UI for a specific piece. It is usually “dumb” or “presentational”: 
// renders JSX, receives data/functions via props, calls them when needed. It doesn’t own state (usually).

//Parent component	Holds state and/or logic. Decides what values to pass down to children via props. 
// Orchestrates layout and behavior. Handles events from children.



function IncrementTwo(prop:{onIncrement:()=>void}){ // This defines a child component that receives props as an object called `prop`.
// React passes all attributes from the parent JSX as this props object.
// TypeScript type { onIncrement: () => void } ensures that `onIncrement` is a function
// that takes no arguments and returns nothing. The parent decides what function to pass when rendering <IncrementTwo />.

    return(
        <button onClick={prop.onIncrement}>
            decrement
        </button>
    )

}

function Increment({onIncrement}:{ onIncrement: () => void }){ // THis is better way to define a child component that receives props.
// Here we destructure the props object to directly access `onIncrement`.
// When the parent renders <Increment />, it decides what value, in this case a function, to pass to `onIncrement`.

// Now that you see how this works,the benefits of TypeScript become clearer.
// By defining the type of props in the child component, TypeScript ensures
// that whatever the parent passes matches what the child expects.
// This prevents bugs and makes the code easier to understand and maintain.

    return(<button onClick={onIncrement}>
        increment
    </button>
    )
}

type ButtonProps = {
    label:string
    click:()=>void
}
function CounterButton({label,click}:ButtonProps){ // Reusable button component for incrementing or decrementing.
// Instead of creating separate components for each action, we define a single component with typed props.
// The parent decides what function to run on click and what label to display, making this component reusable.
//You 
    return <button onClick={click}> {label} </button>
}

function IncDecCounter(){ //parent component
    const [count,setCount] = useState(0)
    return(
        <div>
            <h1>Counter</h1>
            <p>The counter val is {count}</p>
            <Increment onIncrement={()=>setCount(c=>c+1)}/>
            <IncrementTwo onIncrement={() => setCount(c => c - 1)} />
            <p>THis da good way</p>
            <CounterButton label="the good way inc" click={()=>setCount(c=>c+1)}/>
            
            <CounterButton label ="the good way dec" click={()=>setCount(c=>c-1)}/>

        </div>
    ) // When you write <Increment onIncrement={() => setCount(c => c + 1)} />,
// this renders the Increment component and passes a function to its `onIncrement` prop.
// That function will be called later when the child component triggers it (e.g., on button click).

}
export default IncDecCounter