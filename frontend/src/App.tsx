
import Practice from './components/Practice'
import IncDecCounter from './components/PracticeTwo'


//This is root component. Composes all other components for layout and structure. Holds top level state + routing
function App(){


  return (
    <div>
        <Practice/>
        <p>This v2 baby</p>
        <IncDecCounter/>
    </div>

  );
}

export default App