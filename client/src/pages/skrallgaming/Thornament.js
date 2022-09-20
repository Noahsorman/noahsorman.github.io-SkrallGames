import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../assets/style/skrallgaming/thornament.css"

export default function Thornament(){
    const loc = useLocation();

    const [ teams, setTeams] = useState([]);
    const [ matches, setMatches ] = useState([]);
    const [ groups, setGroups ] = useState([]);
    const [ playOffMatches, setPlayOffMatches] = useState([])

    const teamColor = (teamName) => {
        // let hash = 0;
        // for (let i = 0; i < teamName.length; i++) {
        //     hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
        //     hash = hash & hash;
        // }
        // return hash % 360
        
        let c = teams?.findIndex(t => t.name === teamName)
        return Math.round(c / teams?.length * 360)
    }
    /**
     * 
     * @param {number} matchIndex 
     * @param {number} gameIndex 
     * @param {empty | team1 | team2} winner 
     */
    const updateGameResult = (matchIndex, gameIndex, winner) => {
        // winner = empty, team1, team2
        let arr = [...matches]
        const bo = matches[matchIndex].bo
        let won = 0; 
        let lost = 0;

        if (gameIndex === null)
            gameIndex = arr[matchIndex].gameResults.findIndex(m => m === undefined) || 0

        if (winner === "empty"){
            for (let i = gameIndex; i < bo ; i++){
                arr[matchIndex].gameResults[i] = undefined    
            }
        }
        
        for (let i = 0; i < bo; i++){
            if (won > bo/2 || lost > bo/2){                
                arr[matchIndex].gameResults[i] = false
                continue
            }
            if (i === gameIndex) arr[matchIndex].gameResults[gameIndex] = (winner === "team1" ? 1 : (winner === "team2" ? 2 : undefined))
            if (arr[matchIndex].gameResults[i] === 1) won += 1;
            if (arr[matchIndex].gameResults[i] === 2) lost += 1;
        }        
        arr[matchIndex].winner = won > bo/2 ? 1 : 
                                lost > bo/2 ? 2 : 
                                won === lost && bo % 2 === 0 && arr[matchIndex].gameResults.every(r => r !== undefined) ? true:
                                undefined;
        setMatches(arr)


        let thisGroup = matches[matchIndex]?.group
        if (thisGroup !== undefined){ // Is a group/pool match.
            if (matches.every(m => m?.group !== thisGroup || m.winner !== undefined)){ //Every match in this group is done!
                let tempGroups = [...groups]
                tempGroups[thisGroup].forEach((team, i) => { //Update Team wins
                    tempGroups[thisGroup][i].wins = arr.reduce((pre, cur) => {
                        if (cur.team1 === team.name) return pre + cur.gameResults.reduce((pre, cur) => pre + (cur === 1 ? 1 : 0), 0)
                        if (cur.team2 === team.name) return pre + cur.gameResults.reduce((pre, cur) => pre + (cur === 2 ? 1 : 0), 0)
                        else return pre
                    }, 0)
                })
                
                tempGroups[thisGroup].sort((a, b) => {
                    if (b.wins - a.wins !== 0)
                        return b.wins - a.wins;
                    const i = matches.findIndex(m => [a.name, b.name].includes(m.team1) && [a.name, b.name].includes(m.team2))
                    let teamA = a.name === matches[i].team1 ? 1 : 2
                    let teamB = teamA === 1 ? 2 : 1
                    teamA = matches[i].gameResults.filter(gr => gr === teamA)
                    teamB = matches[i].gameResults.filter(gr => gr === teamB)

                    if (teamB - teamA !== 0)
                        return teamB - teamA;

                    return 0
                    //return asdasd
                })

                let tempUpperBracket = [...playOffMatches]
                tempGroups[thisGroup].forEach((team, i) => {
                    
                    let ind = -1
                    let j = 2
                    while (j > 0 && ind === -1){
                        j--
                        ind = tempUpperBracket[j].findIndex(m => (
                            typeof m.team1 === "object" && m.team1.group === thisGroup && m.team1.placement === i + 1) 
                            || (typeof m.team2 === "object" && m.team2.group === thisGroup && m.team2.placement === i + 1))
                    }                  
                    //if (i < 0) //break
                    if (ind >= 0){
                        let replTeam = (tempUpperBracket[j][ind].team1.group === thisGroup && tempUpperBracket[j][ind].team1.placement === i + 1) ? "team1" : "team2";
                        tempUpperBracket[j][ind][replTeam] = team.name
                    }                                 
                })

                setPlayOffMatches(tempUpperBracket)            
                setGroups(tempGroups)
            }
        }else{
            let tempUpperBracket = [...playOffMatches];
            let m = matches[matchIndex]

            if (m.round === tempUpperBracket.length - 1 && m.winner !== undefined){
                alert(`AND THE WINNER IS ${m.winner === 1 ? m.team1 : m.team2}`)
                return
            }

            if (m.winner !== undefined){
                if(tempUpperBracket[m.round + 1][m.toLink].team1[0] === "∀")
                    tempUpperBracket[m.round + 1][m.toLink].team1 = m.winner === 1 ? m.team1 : m.team2
                else
                    tempUpperBracket[m.round + 1][m.toLink].team2 = m.winner === 1 ? m.team1 : m.team2
            }                    
        }
    }

    useEffect(() => {
        let arr = [...[], ...loc?.state?.groupMatches]
        loc?.state?.upperBracket.forEach(r => {
            arr = [...arr, ...r]
        })
        console.log("ins loc useEffect", loc?.state, "arr:", arr)
        setTeams(loc?.state?.teams)
        setGroups(loc?.state?.groups)
        setPlayOffMatches(loc?.state?.upperBracket)
        setMatches(arr);
    }, [loc])

    useEffect(() => {              
        const currentMatch = document.getElementById(`row${matches.findIndex(m => m.winner === undefined)}`);  
        if (!currentMatch) return
        currentMatch.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
        });
    }, [matches])

    return <>        
        <div className="thornamentBody">
            <div className="ulkeeper">
                <div>
                    {matches?.length > 0  &&
                        matches.map((match, index) => {
                            return <div id={`row${index}`} className={`${match.winner !== undefined ? 'finished' : ''} ` + 
                                `${(index === matches.findIndex(m => m.winner === undefined)) ? 
                                    (match.gameResults.some(gr => gr !== undefined) ? 'current' : 'tobe') 
                                    : ''}`
                            }>
                                <span className="matchcount">{match.name}</span>
                                {typeof match.team1 === "string" && !match.team1.includes("∀") ?
                                    <div className="teambody" onClick={() => {updateGameResult(index, null, "team1")}} 
                                    style={{
                                        background: `hsl(${teamColor(match.team1)}, 100%, 24%)`,
                                        boxShadow: `inset 12px 12px 12px hsl(${teamColor(match.team1)}, 100%, 15%), inset -12px -12px 12px hsl(${teamColor(match.team1)}, 100%, 29%)`,
                                        opacity: `${match.winner === 2 ? 35 : 100}%`
                                    }}>
                                        <div className="teamplayers">
                                            {/* {teams?.length > 0 && teams[match.team1].map(p => <p>{p}</p>)} */}
                                        </div>
                                        <div className="teamname ">{match.team1}</div>
                                    </div>
                                    :
                                    <div className="teambody" 
                                    style={{
                                        background: `hsl(0, 0%, 24%)`,
                                        boxShadow: `inset 12px 12px 12px hsl(0, 0%, 15%), inset -12px -12px 12px hsl(0, 0%, 29%)`,
                                    }}>
                                        <div className="teamplayers">
                                            {/* {teams?.length > 0 && teams[match.team1].map(p => <p>{p}</p>)} */}
                                        </div>
                                        <div className="teamname "></div>
                                    </div>
                                }
                                <div className="scorebody">{match?.bo &&
                                    [...Array(match.bo)].map((_, i ) => {
                                        let gr = match.gameResults?.[i]

                                        if (gr === undefined) return <div className="score"></div>
                                        if (gr === false) return <div className="score" style={{opacity:"0%"}}></div>
                                        return <div className="score" style={{
                                            background: `hsl(${teamColor(match[`team${gr}`])}, 100%, 24%)`,
                                            boxShadow: `inset 8px 8px 8px hsl(${teamColor(match[`team${gr}`])}, 100%, 15%), inset -8px -8px 8px hsl(${teamColor(match[`team${gr}`])}, 100%, 29%)`,                                                
                                        }}
                                            onClick={() => {updateGameResult(index, i, "empty")}}
                                        ></div>
                                    })
                                }</div>
                                {typeof match.team2 === "string" && !match.team2.includes("∀")? 
                                    <div className="teambody" onClick={() => {updateGameResult(index, null, "team2")}}
                                    style={{
                                        background: `hsl(${teamColor(match.team2)}, 100%, 24%)`,
                                        boxShadow: `inset 12px 12px 12px hsl(${teamColor(match.team2)}, 100%, 15%), inset -12px -12px 12px hsl(${teamColor(match.team2)}, 100%, 29%)`,
                                        opacity: `${match.winner === 1 ? 35 : 100}%`
                                    }}>
                                        <div className="teamname">{match.team2}</div>
                                        <div className="teamplayers">
                                            {/* {teams?.length > 0 && teams[match.team2].map(p => {return <p>{p}</p>})} */}
                                        </div>
                                    </div> 
                                :
                                <div className="teambody" 
                                style={{
                                    background: `hsl(0, 0%, 24%)`,
                                    boxShadow: `inset 12px 12px 12px hsl(0, 0%, 15%), inset -12px -12px 12px hsl(0, 0%, 29%)`,
                                }}>
                                    <div className="teamplayers">
                                        {/* {teams?.length > 0 && teams[match.team1].map(p => <p>{p}</p>)} */}
                                    </div>
                                    <div className="teamname "></div>
                                </div>

                                }                                          
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="pageSwitcher">
                <Link to="/skrallgaming/ThornamentBracket" state={{
                    groups: loc?.state?.groups,
                    upperBracket: loc?.state?.upperBracket,
                    groupMatches: loc?.state?.groupMatches,
                    teams
                }}>💱Bracket</Link>
            </div>
        </div>
    </>
}