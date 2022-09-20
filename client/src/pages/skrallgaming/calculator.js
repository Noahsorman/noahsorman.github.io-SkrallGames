import React, { useEffect, useState } from "react";
import usePlayers from "../../hooks/skrallgaming/usePlayers";
import Navbar from "../../components/navigation/skrallgaming/Navbar";
import "../../assets/style/skrallgaming/calculator.css"
import playersArray from "../../globals/skrallgaming/players"

export default function Calculator(){
    
    const { players, setPlayers } = usePlayers()

    const [ selectedPlayers , setSelectedPlayers ] = useState([undefined, undefined, undefined, undefined])
    const [ winningPercentage , SetWinningPercentage ] = useState(undefined)
    const [ gamesWon , setGamesWon ] = useState([undefined, undefined, undefined])
    const [ gameType , setGameType ] = useState("smash2")

    useEffect(() => {
        if (players.length > 0) return
        let newArray = [...playersArray]        
        for (let i = 0; i < newArray.length; i++){
            newArray[i].rank = i+1
        }
        setPlayers(newArray)
    }, [])

    const FindPlayer = (id, playerName) => {
        const player = players.find(player => player.name === playerName)
        let newSelectedPlayers = [ ...selectedPlayers ]
        newSelectedPlayers[id] = player
        setSelectedPlayers(newSelectedPlayers)
    }

    const playerOptions = () => { //Denna körs för mkt, kör i en useEffect på ngt sätt istället..
        return( 
            <>
            <option value="" disabled >-Choose Skraller-</option>
            {   players && players.length > 0 &&
                players.map(player => (
                    <option value={player.name}>{player.name}</option>
                ))
            }
            </>
        )     
    }

    const calculateNewRating = () => {
        let lostGames = 0;
        let wonGames = 0;
        let tempPlayers = [];

        let wp = {
            value: undefined,
            recalc: () => {
                wp.value = parseInt((1 / (1 + Math.pow(10, (
                    (getRating(2, tempPlayers) ?? 1500) + (getRating(3, tempPlayers) ?? 1500) - 
                    ((getRating(0, tempPlayers) ?? 1500) + (getRating(1, tempPlayers) ?? 1500))
                ) / 400)))*100)
            }
        }

        selectedPlayers.map(player => {
            tempPlayers.push(player)
        })                            

        for (let i = 0; i < gamesWon.length; i++){            
            if (lostGames > gamesWon.length / 2 || wonGames > gamesWon.length / 2) break
            
            wonGames += gamesWon[i] ? 1 : 0;
            lostGames += !gamesWon[i] ? 1 : 0;                        

            let team1 = getRating(0, tempPlayers) + (getRating(1, tempPlayers) || 0)
            let team2 = getRating(2, tempPlayers) + (getRating(3, tempPlayers) || 0)

            wp.recalc()
            let dif = Math.round((-2*wp.value/10)+20)*(+!!gamesWon[i])-Math.round((-2*(100-wp.value)/10)+20)*(+!gamesWon[i]);            
            let opponentTeam = (gameType === "smash1" ? getRating(2, tempPlayers) : team2 / 2)
            let fooArr = [0, 0, 0, 0]

            for (let j = 0; j < tempPlayers.length; j++){
                if (gameType === "smash1" && j % 2) continue
                if (j === 2 ){
                    opponentTeam = (gameType === "smash1" ? getRating(0, tempPlayers) : team1 / 2)
                }
                const p = tempPlayers[j]
                let rating = getRating(j, tempPlayers)
                rating = Math.round(Math.pow(-(Math.pow(((1/(1+Math.pow(10,((opponentTeam - rating)/400))))*100)-50,2)/(500/4))+20,3));
                fooArr[j] = rating;      
            }

            for (let j = 0; j < fooArr.length; j++){
                if (gameType === "smash1" && j % 2) continue
                if (j === 2) dif = -dif
                const p = tempPlayers[j]
                const x = ([1, 3].includes(j) ? j-1 : j+1)
                const rating = getRating(j, tempPlayers)
                const pg = (p.placementGames || gameType === "beerPong" ? 2 : 1)
                const newRating = Math.round(rating + fooArr[j]/(fooArr[j] + (fooArr[x])) * dif * pg);
                // debugger
                // console.group(p.name)
                // console.log(p)
                // console.log("Rating:", rating, fooArr)
                // console.log("New Rating:", newRating, dif)
                // console.groupEnd(p.name)
                if (gameType === "beerPong") tempPlayers[j].beerPong = newRating
                else tempPlayers[j].rating = newRating
                
                if (pg > 1 && gameType !== "beerPong") tempPlayers[j].placementGames -= 1
            }
        }     
        setSelectedPlayers(tempPlayers)
    }

    const getRating = (id, arr) => {
        if (arr[id] === undefined || (gameType === "smash1" && id % 2)) return undefined
        if (gameType === "beerPong") return arr[id]?.beerPong ?? 1500
        else return arr[id]?.rating ?? 1500
    }

    useEffect(() => {
        if (gameType !== "smash1" && selectedPlayers.includes(undefined)) return
        if (gameType === "smash1" && (selectedPlayers[0] === undefined || selectedPlayers[2] === undefined)) return

        if (gameType === "beerPong")
            SetWinningPercentage(parseInt((1 / (1 + Math.pow(10, (
                    (selectedPlayers[2]?.beerPong ?? 1500) + (selectedPlayers[3]?.beerPong ?? 1500) - 
                    ((selectedPlayers[0]?.beerPong ?? 1500) + (selectedPlayers[1]?.beerPong ?? 1500))
                ) / 400)))*100))     
        else if (gameType === "smash1")
            SetWinningPercentage(parseInt((1 / (1 + Math.pow(10, ((selectedPlayers[2]?.rating ?? 1500) - (selectedPlayers[0]?.rating ?? 1500)) / 400)))*100))          
        else 
            SetWinningPercentage(parseInt((1 / (1 + Math.pow(10, (
                (selectedPlayers[2]?.rating ?? 1500) + (selectedPlayers[3]?.rating ?? 1500) - 
                ((selectedPlayers[0]?.rating ?? 1500) + (selectedPlayers[1]?.rating ?? 1500))
            ) / 400)))*100))       
            
        
    }, [selectedPlayers, gameType] )

    return <>
        <Navbar />
        <div className="calculatorBody"> 
        <div className="selectContainer" id="gametype">
            <div className="select">
                <select id="gametype" onChange={(e) => setGameType(e.target.value)}>
                    <option value="smash2">Smash 2v2</option>
                    <option value="beerPong">Beer Pong</option>
                    <option value="smash1">Smash 1v1</option>
                </select>
            </div>
        </div>        
            <div className="versusBody">
                <div className="teamBody">
                    <h1>Team 1</h1>
                    <table><tbody>
                        <tr>
                            <td>
                                <div className="selectContainer">
                                    <div className="select">
                                        <select onChange={(e) => FindPlayer(0, e.target.value)} defaultValue={""}>
                                            {playerOptions()}
                                        </select>
                                    </div>
                                    <span>{getRating(0, selectedPlayers)}</span>
                                </div>
                            </td>
                            {gameType !== "smash1" &&
                            <td>
                                <div className="selectContainer">
                                    <div className="select">
                                        <select onChange={(e) => FindPlayer(1, e.target.value)} defaultValue={""}>
                                            {playerOptions()}
                                        </select>
                                    </div>
                                    <span>{getRating(1, selectedPlayers)}</span>
                                </div>
                            </td>
                            }
                        </tr>
                        {gameType !== "smash1" &&
                            <tr>
                                <td>Average Rating</td>
                                <td>{(getRating(0, selectedPlayers) + getRating(1, selectedPlayers)) / 2 || ""}</td>
                            </tr>
                        }
                        <tr>
                            <td>Win Percentage</td>
                            <td>{winningPercentage ?? ""}%</td>
                        </tr>
                    </tbody></table>                                        
                </div>
                <div className="teamBody">
                    <h1>Team 2</h1>                                  
                    <table><tbody>
                        <tr>
                            <td>
                                <div className="selectContainer">
                                    <div className="select">
                                        <select onChange={(e) => FindPlayer(2, e.target.value)} defaultValue={""}>
                                            {playerOptions()}
                                        </select>
                                    </div>
                                    <span>{getRating(2, selectedPlayers)}</span>
                                </div>
                            </td>
                            {gameType !== "smash1" &&
                            <td>
                                <div className="selectContainer">
                                    <div className="select">
                                        <select onChange={(e) => FindPlayer(3, e.target.value)} defaultValue={""}>
                                            {playerOptions()}
                                        </select>
                                    </div>
                                    <span>{getRating(3, selectedPlayers)}</span>
                                </div>
                            </td>
                            }
                        </tr>
                        {gameType !== "smash1" &&
                            <tr>
                                <td>Average Rating</td>
                                <td>{(getRating(2, selectedPlayers) + getRating(3, selectedPlayers)) / 2 || ""}</td>
                            </tr>
                        }
                        <tr>
                            <td>Win Percentage</td>
                            <td>{100 - winningPercentage || ""}%</td>
                        </tr>
                    </tbody></table> 
                </div>
                <div className="selectContainer bestOf">
                    <div className="select">
                        <select id="bestOf" defaultValue={"3"} onChange={(e) => {
                            let arr = []
                            for (let i = 0; i < parseInt(e.target.value); i++){
                                arr.push(false)
                            }
                            setGamesWon(arr)
                        }}>
                            <option value="1">Best of 1</option>
                            <option value="2">Best of 2</option>
                            <option value="3">Best of 3</option>
                            <option value="5">Best of 5</option>
                        </select>
                    </div>
                    {(  (selectedPlayers[0] !== undefined && selectedPlayers[2] !== undefined && gameType === "smash1") ||
                        (!selectedPlayers.includes(undefined))
                    ) &&
                        <button onClick={() => calculateNewRating()}>Commit Result</button>
                    }                    
                </div>
                <div className="matchResults">
                    <table><tbody>
                        {
                            gamesWon.map((gameResult, i) => {
                                let foo = [...gamesWon]                                
                                foo.splice(i)

                                const lostGames = foo.reduce((pre, cur) => pre + (!cur && 1) , 0)
                                const wonGames = foo.reduce((pre, cur) => pre + (cur && 1) , 0)                                
                                let hideNext = false;

                                if (lostGames > gamesWon.length / 2 || wonGames > gamesWon.length / 2) hideNext = true

                                return( <tr className={hideNext ? "hide" : ""}>
                                    <td><div>
                                        <span className={gameResult ? "checked" : ""} onClick={() => {
                                            let newArr = [...gamesWon]
                                            newArr[i] = !newArr[i]
                                            setGamesWon(newArr)                                            
                                        }} />
                                    </div></td>
                                </tr>)
                            })
                        }                        
                    </tbody></table>                    
                </div>                
            </div>
        </div>
    </>
}