import React, { useEffect, useState } from "react";
//import { Radar } from "react-chartjs-2";
import usePlayers from "../../hooks/skrallgaming/usePlayers";
import playersArray from "../../globals/skrallgaming/players"
import placings from "../../globals/skrallgaming/placings"
import Navbar from "../../components/navigation/skrallgaming/Navbar";
import "../../assets/style/skrallgaming/playerlist.css"

export default function PlayerList(){

    const { players, setPlayers } = usePlayers()
    const [ currentSortBy, setCurrentSortBy ] = useState("Rank")
    const [ showPlayer, setShowPlayer ] = useState({})

    useEffect(() => {
        placings.sort((a, b) => b.year - a.year)
    }, [])

    useEffect(() => {
        let newArray = [...playersArray]
        newArray.sort((a, b) => b.rating - a.rating)
        for (let i = 0; i < newArray.length; i++){
            newArray[i].rank = i+1
        }
        setPlayers(newArray)
    }, [setPlayers])

    const OpenPlayer = (props) => {
        return <>        
        {Object.keys(showPlayer).length > 0 &&
        <div className="playerInfo" onClick={() => setShowPlayer({})}>
            <div>
                <h1>{showPlayer.name}</h1> 
                {showPlayer.nicknames.length > 0 &&
                    <p>A.K.A - <i> {showPlayer.nicknames.join(", ")} </i></p>
                } 
                <p>{showPlayer.info}</p>                               
                    <br />Placings: 
                    <ul>
                        {                            
                            placings.map(e => {
                                if (e?.players){
                                    let i = e.players.findIndex(p => p.name === showPlayer.name)
                                    if (i === -1) return <></>
                                    return <li>#{e.players[i].placing
                                        } at {e.event + ` ${e.year} ${e.game} (${e.format})`}</li>
                                } 
                                else if (e?.teams){
                                    let i = e.teams.findIndex(t => t.players.findIndex(p => p.name === showPlayer.name) > -1)
                                    //console.log(e.teams, i)
                                    if (i === -1) return <></>
                                    return <li>#{e.teams[i].placing
                                        } at {e.event + ` ${e.year} ${e.game} (${e.format}) | ${e.teams[i].name}  ( ${e.teams[i].players.find(p => p.name !== showPlayer.name).name} )`}</li>
                                }
                            })
                        }
                            {/* {
                            showPlayer.placings.map((p) => (
                                <li>{p.placing + (p.placing === 1 ? "st" : (
                                    p.placing === 2 ? "nd" : (p.placing === 3 ? "d" : "th")
                                ))
                                } at {p.event}</li>
                            ))
                        } */}
                    </ul>                 
            </div>
        </div>
        }
        </> 
    }

    const sort = (sortBy) => {
        let newArray = [...players]
        let type
        
        for (let i = 0; i < newArray.length; i++){
            if (newArray[i][sortBy] !== undefined && newArray[i][sortBy] !== ""){
                type = typeof newArray[i][sortBy]
                break;
            }
        }
        
        if (type === "string"){
            if (currentSortBy === sortBy) newArray.sort((a, b) => (b[sortBy] ?? "öö") > ( a[sortBy] ?? "öö") ? 1 : -1)
            else newArray.sort((a, b) => (b[sortBy] ?? "öö") < ( a[sortBy] ?? "öö") ? 1 : -1)
        }
        else{
            if (currentSortBy !== sortBy) newArray.sort((a, b) => b[sortBy] - a[sortBy])
            else newArray.sort((a, b) => a[sortBy] - b[sortBy])
             
        }
        if (currentSortBy === sortBy) setCurrentSortBy("")            
        else setCurrentSortBy(sortBy)
        setPlayers(newArray)
    }
    
    return <>        
        <div className="playerlist">
        <Navbar />
        <table className="content-table" onScroll={() => setShowPlayer({})}>
            <thead>
            <tr>
                <th onClick={() => sort("name")}>Player</th>
                <th onClick={() => sort("rank")}>Rank</th>
                <th onClick={() => sort("rating")}>Smash Rating</th>
                <th onClick={() => sort("main")}>Main</th>
                <th onClick={() => sort("secondary")}>Secondary</th>
                <th onClick={() => sort("beerPong")}>Beer Pong Rating</th>
            </tr>
            </thead>
                <tbody onScroll={() => setShowPlayer({})}>                        
                    { Array.isArray(players) && 
                        players.map((player, index) => (
                            <tr onClick={() => setShowPlayer(player)}>
                                <td>{player.name}</td>
                                <td>{player?.rank}</td>
                                <td>{player.rating}
                                    {player.placementGames > 0 &&
                                        <span className="placementGames">{player.placementGames}</span>
                                    }
                                </td>
                                <td>{player.main || ""}</td>
                                <td>{player.secondary || ""}</td>
                                <td>{player.beerPong || ""}</td>
                            </tr>
                        ))
                    }                          
                </tbody>
        </table>
        <OpenPlayer />            
        </div>
    </>
}