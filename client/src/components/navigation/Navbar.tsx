import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../../assets/style/Navbar.css'

// export default function Navbar(){
//     return <div className="navbar">
//         <div>
//             <svg viewBox="0 0 100 80" width="40" height="40">
//             <rect width="100" height="20"></rect>
//             <rect y="30" width="100" height="20"></rect>
//             <rect y="60" width="100" height="20"></rect>
//             </svg>
//             <Link to="/games">Play Game</Link>
//             <Link to="">Skrall Gaming</Link>
//             <Link to="">GenStock</Link>
//         </div>
//         <div>
//             <Link to="">Account</Link>
//             <Link to="">Logout</Link>
//         </div>
//     </div>
// }

export default function Navbar(){

    const [ showNavMenu, setShowNavMenu ] = useState(false)

    return <nav>
        <div className="navbar">
            <div className="navbar-title">Skrall</div>
            <svg fill="white" height="40" viewBox="4 4 20 20" width="40" className="toggle-button" onClick={() => setShowNavMenu(!showNavMenu)}>
                <path d="M4 6H20M4 12H20M4 18H20" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            </svg>
            <div className={`navbar-links ${showNavMenu ? "active" : ""}`}>
                <ul>
                    <li><Link to="/games">Play Game</Link></li>
                    <li><Link to="/skrallgaming/ratings">Skrall Gaming</Link></li>
                    <li><Link to="">GenStock</Link></li>
                    <li><Link to="">Login</Link></li>
                </ul>
            </div>
        </div>
    </nav>
}