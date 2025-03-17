import {BrowserRouter, Navigate,Route,Routes} from "react-router-dom"
import MainApp from "./components/MainApp.js";
import { useSelector } from "react-redux";
import LoginPage  from "./components/LoginPage.js";
import SignupPage  from "./components/SignupPage.js";





function App(){
    const isAuth = Boolean(useSelector((state)=>state.token))

    

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainApp/>} />
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignupPage/>}/>
            </Routes>
        </BrowserRouter>
    )


}


export default App;