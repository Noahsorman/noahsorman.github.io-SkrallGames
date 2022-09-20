import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PlayersProvider } from "./context/skrallgaming/PlayersContext_Provider"
import PlayerList from "./pages/skrallgaming/playerlist"
import Calculator from "./pages/skrallgaming/calculator"
import Thornament from "./pages/skrallgaming/Thornament"
import CreateThornament from "./pages/skrallgaming/createThornament"
import ThornamentBracket from "./pages/skrallgaming/ThornamentBracket"


//import Dummy from './pages/Dummy';
// import Login from './pages/Login'; 
// import Logout from './components/Logout'; 
//import HeaderMenu from './pages/HeaderMenu';
//import ProtectedRoute  from "./ProtectedRoute"
//import { RequireAuth, PersistLogin } from './components';
//import './assets/style/App.css';
import { Home, Games, GameRoom } from './pages'
// import Register from './pages/Register';
// import ResetPassword from './pages/ResetPassword';


const App: React.FC = () => {
    return (
        <Routes>
            {/* <Route path="/Login" element={ <Login /> }></Route> */}
            {/* <Route path="/Logout" element={ <Logout /> }></Route>
            <Route path="/Register" element={ <Register /> }></Route>
            <Route path="/ResetPassword/:token" element={<ResetPassword />}></Route>
            <Route path="/ResetPassword" element={ <ResetPassword /> }></Route> */}
            <Route path="/GameRoom" element={ <GameRoom /> }></Route>
            <Route path="/Home" element={ <Home /> }></Route>
            <Route path="/Games" element={ <Games /> }></Route>
            <Route element={<PlayersProvider />}>
                <Route path="/skrallgaming/ratings" element={<PlayerList />} />
                <Route path="/skrallgaming/calculator" element={<Calculator />}></Route>
                <Route path='/skrallgaming/CreateThornament' element={<CreateThornament />} />
                <Route path='/skrallgaming/thornament' element={<Thornament />}/>
                <Route path="/skrallgaming/thornamentbracket" element={<ThornamentBracket />} />
            </Route>
            {/* <Route element={<PersistLogin />}>
                <Route element={<RequireAuth />}>                     */}
                    <Route path="*" element={<Navigate to="/Home" replace />}/>
                {/* </Route>
            </Route> */}
      </Routes>
    )
}

export default App;