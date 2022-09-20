import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../assets/style/skrallgaming/thornamentBracket.css"

export default function ThornamentBracket(){
    const loc = useLocation();

    const findScore = (team1, team2, type) => {
        let arr = [];
        if (type === "group") arr = [...arr, ...loc?.state?.groupMatches]
        if (type === "upperBracket") arr = [...arr, ...loc?.state?.upperBracket]

        // This means we want the total score of that team.
        if (team1 !== undefined && team2 === null){
            let p = 0
            p = arr.reduce((pre, m) => {
                if (m.team1 === team1) 
                    return pre+m.gameResults.reduce((pre, cur) => {
                        if (cur === 1){
                            return pre+1
                        } 
                        return pre
                    }, p)
                if (m.team2 === team1) 
                    return pre+m.gameResults.reduce((pre, cur) => {
                        if (cur === 2) return pre+1
                        return pre
                    }, p)
                return pre
            }, 0)
            return p
        }

        const i = arr.findIndex(m => 
            (m.team1 === team1 && m.team2 === team2) ||
            (m.team2 === team1 && m.team1 === team2)
        );

        let t1p = 0; 
        let t2p = 0;
        let t1Checker = arr[i].team1 === team1 ? 1 : 2;
        let t2Checker = t1Checker === 1 ? 2 : 1;

        let p = arr[i].gameResults.forEach(r => {
            if (r === t1Checker) t1p++
            if (r === t2Checker) t2p++
        })
        
        return `${t1p} - ${t2p}`
    }
    
    const placementString = (team) => {
        let pl; 
        if (team.placement === 1) pl = '1st'
        else if (team.placement === 2) pl = '2nd'
        else if (team.placement === 3) pl = '3rd'
        else pl = `${team.placement}th`

        return pl + ' from Group ' + String.fromCharCode(65 + team.group)
    }

    return <>
        <div className="bracketBody">
            <div className="group">
            {loc?.state?.groups && 
                loc.state.groups.map((g, gi) => {
                    return <div>
                        <table>
                            <thead>
                                <tr>
                                    {
                                        [...[""], ...g].map((t, i) => {
                                            if(i === 0) return <th>GROUP {String.fromCharCode(65 + gi)}</th>
                                            return <th>{t.name}</th>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    g.map((t, i) => {
                                        return <tr>
                                            {
                                                [...[""], ...g].map((t2, j ) => {
                                                    if (j === 0) return <td>{t.name}</td>
                                                    else if (t.name === t2.name) return <td className="empty">{findScore(t.name, null, "group")}</td>
                                                    return <td>{findScore(t.name, t2.name, "group")}</td>
                                                })
                                            }                                
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>          
                    </div>
                })
            }
            </div>
            <div className="playoff">
                {loc?.state?.upperBracket &&
                    loc.state.upperBracket.map((r, i) => {
                        return <span key={i} className="round">
                            <h1>Round {i+1}</h1>
                            {r &&
                                r.map((m, j) => {
                                    return <>
                                    <div key={j} className="match"> 
                                        {typeof m.team1 === "object" ?
                                        <div>                                            
                                            <div className="team placeholder">{m.team1 ? placementString(m.team1) : ""}</div>
                                            <div className="score">{m.gameResults.reduce((pre, cur) => pre + (cur === 1 ? 1: 0), 0)}</div>
                                        </div>:
                                        <div>                                            
                                            <div className={`team ${m?.team1?.includes("∀") ? "placeholder" : ""}`}
                                                title={loc?.state?.teams?.find(t => t.name === m.team1)?.players?.join(" & ")}
                                                >{m?.team1?.replace("∀", "")}</div>
                                            <div className="score">{m.gameResults.reduce((pre, cur) => pre + (cur === 1 ? 1: 0), 0)}</div>
                                        </div>
                                        }                                       
                                        
                                        {typeof m.team2 === "object" ?
                                            <div>                                        
                                                <div className="team placeholder">{m.team2 ? placementString(m.team2) : ""}</div>
                                                <div className="score">{m.gameResults.reduce((pre, cur) => pre + (cur === 2 ? 1: 0), 0)}</div>
                                            </div>:
                                            <div>                                        
                                                <div className={`team ${m?.team2?.includes("∀") ? "placeholder" : ""}`}
                                                    title={loc?.state?.teams?.find(t => t.name === m.team2)?.players?.join(" & ")}
                                                    >{m?.team2?.replace("∀", "")}</div>
                                                <div className="score">{m.gameResults.reduce((pre, cur) => pre + (cur === 2 ? 1: 0), 0)}</div>
                                            </div>
                                        }                                        
                                        
                                        <p className="matchnumber">{m.match}</p>
                                    </div>                                    
                                    </>
                                })
                            }
                        </span>
                    })
                }
            </div>
            <div className="pageSwitcher">
                <Link to="/skrallgaming/Thornament" state={{
                    groups: loc?.state?.groups,
                    upperBracket: loc?.state?.upperBracket,
                    groupMatches: loc?.state?.groupMatches,
                    teams: loc?.state?.teams
                }}>💱Scheduler</Link>
            </div>
        </div>
    </>
}