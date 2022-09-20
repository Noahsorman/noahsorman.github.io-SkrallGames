import React, { useState } from "react";
//import { Navbar, Dialog } from '../components'
import "../assets/style/gameRoom.css"

export default function GameRoom(){

    const [ showRole, setShowRole ] = useState(false)

    const character = {
        partyMemberShip: "Facist",
        name: "Adolf Hitler",
        winCondition: "Get elected Chancellor after the third facist policy has been played"
    }
    const partyMemberShip = "Facist"

    const Role = () => {
        return <>
        {showRole &&
        <div className={`role-overlay ${partyMemberShip}`} onClick={() => setShowRole(false)}>
            <div className="role">
                <div>
                    <img src="https://s-media-cache-ak0.pinimg.com/236x/54/10/ff/5410ff1af50d0ddff7fe25c323c2a39f.jpg" alt="Avatar"/>
                </div>
                <div>
                <h4>{character.name}</h4>
                <p className={character.partyMemberShip}>{character.partyMemberShip}</p>
                <p className="win-condition">{character.winCondition}</p>
                </div>
            </div>
        </div>
        }
        </> 
    }

    return <>
        <div>
            Current Action:
            <p>President chooses policies</p>
        </div>
        <table className="liberal-table">
            <tbody>
                <tr>
                    <td style={{fontSize:42}}>1 / 5</td>
                </tr>
            </tbody>
        </table>
        <table className="facist-table">
            <tbody>
                <tr>
                    <td className="placed-policy"><span>1</span>President looks at another players membership
                        <img src="https://expo.se/sites/default/files/symbols/Svastika.gif" alt="X" />
                    </td>
                </tr>
                <tr>
                    <td className="placed-policy"><span>2</span>President looks at another players membership
                        <img src="https://expo.se/sites/default/files/symbols/Svastika.gif" alt="X" />
                    </td>
                </tr>
                <tr>
                    <td><span>3</span>President chooses the next president</td>
                </tr>
                <tr>
                    <td><span>4</span>President shoots a player</td>
                </tr>
                <tr>
                    <td><span>5</span>President shoots a player</td>
                </tr>
                <tr>
                    <td className="facist-policy-c">2 / 6</td>
                </tr>
            </tbody>
        </table>
        <div className="vote">Vote</div>
        <div className="show-role" onClick={() => setShowRole(!showRole)}>Show role</div>
        {showRole && 
            <Role />
        }
    </>
}