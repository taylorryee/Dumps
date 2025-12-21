
import Practice from './components/Practice'
import IncDecCounter from './components/PracticeTwo'
import LoginForm from './components/LoginForm'

import { useEffect } from "react";
import api from "./api";

//This is root component. Composes all other components for layout and structure. Holds top level state + routing
function App(){

   //useEffect( () => {function} , [] );  This is the basic usage of useEffect. [] is were you put the dependecny and {function} is the function that runs when this
    //dependency is triggered. 

    useEffect(()=>{ const pingDat = async () =>{ //In this example we need because we are using a await it needs to be inside an async function - the problem is 
      //the function you call in useEffect cannot be async so instead we wrap that function first inside a sync function called "pingDat" then we call an async function 
      //inside "pingDat" so we can use await with tha axios call. The reason why you cannot use async inside the useEffect function is because useEffects expects your function
      //to either return nothing or return a cleanup function -> using asyc always returns a "Promise" object even if you dont specify a return value. Async 
    try{
      const response = await api.get("/ping");
      console.log(response.data);

    }catch(error){
      console.error(error);
    }
    };
    pingDat();

    },[]);


  return (
    <div>
        <Practice/>
        <p>This v2 baby</p>
        <IncDecCounter/>
        <LoginForm/>
    </div>

  );
}

export default App





