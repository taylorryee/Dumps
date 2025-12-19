
//this is a component.
function Message(){
    
    return <h1>Hello booboo</h1>; //this looks like html but it is actually jsx -> under the hood 
    // this is compiled to JavaScript that describes what the UI should look like. React compares this description to the previous one and updates the DOM efficiently
}




function Messagetwo(){
    const name = "Dic"
    if (name)
        return <h2>Hi {name}</h2>
}
export default function App() {
  return (
    <div>
      <Message />
      <Messagetwo />
    </div>
  );
}