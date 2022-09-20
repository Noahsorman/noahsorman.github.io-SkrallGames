import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/style/Games.css'
import { Navbar, Dialog } from '../components'
import { games } from "../globals"

type gameType = {
    id: string,
    name: string,
    logo: string,
    info: string,
    min: number,
    max: number,
    dev: boolean
}

export default function Games(){

    const [ showDialog, setShowDialog ] = useState(false)
    const navigate = useNavigate()

    const JoinGame = (id:string):void => {
        setShowDialog(true)
        setTimeout(() => navigate("/gameRoom", {replace:true, state: id}), 5000)
    }

    function gameDiv(game: gameType){
        return <div className="game" id={game.id}>
            <div className="scrollcontainer">
            <img src={game.logo} alt="SH" />
            <h1>{game.name}</h1>
            <p className="gameplayers">{game.min === game.max ? game.max : game.min + ' - ' + game.max} players</p>
            <p className="gameinfo">{game.info}</p>
            <p><button onClick={() => JoinGame(game.id)}>Join Game</button></p>
            {/* <p><button>Create Game</button></p> */}
            {game.dev && <div className="dev">Upcoming...</div>
            }
        </div>
      </div>
    }

    return <>
    <Navbar></Navbar>
    <div className="gameslist">
        {games.map(game => {
            return gameDiv(game)
        })}
    </div>
    {showDialog &&
        <Dialog options={{
            title:"Waiting for players...", 
            type:"delete", 
            message:"Game will start shortly", 
            noCancel:true, 
            okText:"Leave", 
            onOk: () => setShowDialog(false)}} />
    }    
    </>
}