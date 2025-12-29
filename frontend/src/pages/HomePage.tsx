import Button from "../components/Button"
import {useAuth} from "../AuthContext"

function HomePage(){
    const auth = useAuth()
    return(<div>

        <Button label = "logout" onClick = {auth.logout}/>

        </div>);
}

export default HomePage;