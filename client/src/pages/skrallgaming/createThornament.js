import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
//import { Radar } from "react-chartjs-2";
import usePlayers from "../../hooks/skrallgaming/usePlayers";
import playersArray from "../../globals/skrallgaming/players"
//import placings from "../../globals/skrallgaming/placings"
import "../../assets/style/skrallgaming/createThornament.css"

export default function CreateThornament(){

    const { players, setPlayers } = usePlayers()
    const [ teams, setTeams ] = useState([
        {name: "Fizzle My Nizzle", players: ["Mikka", "Mangz"]},
        {name: "Damöb", players: ["Izizaki", "Frudrunq"]},
        {name: "Team Moskva", players: ["a", "b"]},
        {name: "Feta pattar och hawaii pizza", players: ["a", "b"]},
        {name: "Bratwurst med lis", players: ["a", "b"]},
        {name: "B-Boyz", players: ["a", "b"]},
        {name: "Det står still", players: ["a", "b"]},
        {name: "Oklart", players: ["a", "b"]},
        {name: "Sneakers Sluts", players: ["a", "b"]},
        {name: "Holk & Kir", players: ["a", "b"]},
        {name: "1Fizzle My Nizzle", players: ["Mikka", "Mangz"]},
        // {name: "1Damöb", players: ["Izizaki", "Frudrunq"]},
        // {name: "1Team Moskva", players: ["a", "b"]},
        // {name: "1Feta pattar och hawaii pizza", players: ["a", "b"]},
        // {name: "1Bratwurst med lis", players: ["a", "b"]},
        // {name: "1B-Boyz", players: ["a", "b"]},
        // {name: "1Det står still", players: ["a", "b"]},
        // {name: "1Oklart", players: ["a", "b"]},
        // {name: "1Sneakers Sluts", players: ["a", "b"]},
        // {name: "1Holk & Kir", players: ["a", "b"]},
        // {name: "2Fizzle My Nizzle", players: ["Mikka", "Mangz"]},
        // {name: "2Damöb", players: ["Izizaki", "Frudrunq"]},
        // {name: "2Team Moskva", players: ["a", "b"]},
        // {name: "2Feta pattar och hawaii pizza", players: ["a", "b"]},
        // {name: "2Bratwurst med lis", players: ["a", "b"]}
    ])
    const navigate = useNavigate();

    const tournamentName = useRef()
    const gameFormat = useRef()
    const game = useRef('smash')

    const [ groupStage, setGroupStage ] = useState(false)
    const groupMaxTeams  = useRef()
    const groupAdvance = useRef()
    const groupBO = useRef()

    const eliminitationType = useRef()

    const teamName = useRef()
    const p1 = useRef()
    const p2 = useRef()

    useState(() => {if (!players?.lenght) setPlayers(playersArray)}, [])

    const registerTeam = () =>{
        if (!p1.current.value || !p2.current.value || !teamName.current.value) return
        let arr = [...[], ...teams]
        arr.push({
            name: teamName.current.value,
            players: [p1.current.value, p2.current.value]
        })
        setTeams(arr);
        teamName.current.select();
    }

    const removeTeam = (i) => {
        let arr = [...[], ...teams]
        arr.splice(i, 1)
        setTeams(arr)
    }    

    const startThornament = () => {
        console.clear()
        if (!teams) return alert("Register teams first!")
        let matches = []
        let uBracketMatches_C = (teams.length - 1)
        let uBracketTeams_C = teams.length;
        let groups = []

        //Create all group matches
        if (groupStage){
            groups = Array(Math.ceil(teams.length / groupMaxTeams.current.value))
            let groupId = 0
            for (let i = 0; i < teams.length; i++){
                if (!groups[groupId]) groups[groupId] = []
                groups[groupId] = [...groups?.[groupId], teams[i]]
                groupId++
                if (groupId === groups.length) groupId = 0
            }
            console.log("Groups:", groups)

            groups.map((group, i) => {
                group.map((_, j) => {
                    for(let k = j+1; k < group.length; k++){
                        matches.push({
                            "group": i,
                            "winner": undefined,
                            "name": `Pools - Group ${String.fromCharCode(65 + i)} `,
                            "bo": 2,
                            "gameResults": [undefined, undefined],
                            "team1": group[j].name,
                            "team2": group[k].name,
                        })
                    }
                })                
            })
            
            //Rearrange so one Group does not finish first
            {
                let max = matches.findIndex(m => m.group > 0)
                let res = [];
                for(let i = 1; i < max; i++){ // Loop through all group 1 matches except first
                    res.push(matches.splice(0, 1)[0])
                    for(let j = 1; j < groups.length; j++){ // loop for all groups except first
                        const ind = matches.findIndex(m => m.group === j)
                        res.push(matches.splice(ind, 1)[0])
                    }
                }
                matches = [...matches, ...res]
            }
            
            uBracketTeams_C = (groupAdvance.current.value * groups.length)
            uBracketMatches_C = uBracketTeams_C - 1
        }

        //get array of matches per round
        const getRounds = (int) => {            
            if (typeof int !== "number") return
            let i = 0
            let ret = [];
            
            while (int > 0){
                let rm = Math.pow(2, i)
                if (int >= rm) ret.unshift(rm)
                else ret.unshift(int)
                int -= rm
                i++                
            }

            return ret
        }
        
        //get opposite opponent if id
        const getGroupStageOpponentsForPlayOff = (round0, restMatches) => {
            if (!groupStage) throw new Error("Cannot execute getGroupStageOpponentsForPlayOff if groupStage === 0")
            let round1Matches = [];
            let round0Matches = [];

            // An array were index corresponds to a group, and the indexarray corrensponds to the standings.
            let opponents = Array.from({length:groups.length}, () => Array.from({length: groupAdvance.current.value}, (_, i) => i + 1))
            
            // Insert round0 and round1 matches.
            {
                let i = 0
                const max = [...[].concat(...opponents)].length// all matches
                while (i < max){
                    for(let j = 0; j < groups.length; j++){
                        if (i >= restMatches.length){
                            round0Matches.push({t1:{group: j, placement: opponents[j][0]}})
                        }else{
                            round1Matches.push({t1:{group: j, placement: opponents[j][0]}});
                        }                        
                        opponents[j].shift()
                        i++
                        if (i >= max) break;       
                    }
                }
            }
            
            // Rearrenge round 1 so all the best wont be in the upper part of the bracket...
            for (let i = 0; i < Math.floor(round1Matches.length / 2); i++){
                if (i % 2 === 1) continue;
                let d = 1;
                if (round1Matches[round1Matches.length - 1].t1.group === round1Matches[i].t1.group) d = 2
                const elem = round1Matches.splice(round1Matches.length-d, 1)[0]
                round1Matches.splice(i + 1, 0, elem)
            }

            // Group Round 0 to matches
            for (let i = 0; i < round0; i++){
                let t2;
                if (round0Matches[i].t1.group !== round0Matches[round0Matches.length - 1].t1.group)
                    t2 = round0Matches.pop().t1;
                else
                    t2 = round0Matches.splice(round0Matches.length - 2, 1)[0].t1                      

                round0Matches[i].t2 = t2;
            }
            // Rearrenge round 0 so all the best wont be in the upper part of the bracket...
            {
                let d = 0
                for (let i = 1; i < Math.floor(round0Matches.length / 2) - 1; i++){
                    const elem = round0Matches.splice(i, 1)[0]
                    round0Matches.splice(round0Matches.length - d, 0, elem)
                    d += 2;
                }
            }            
            return [...round1Matches, ...round0Matches]
        }   

        //Get an array of positions of round 2 that are already placed
        const getRestMatches = (arr, restMatches, rounds) => {            
            let r = [];
            
            if (arr === null) arr = Array.from({length: rounds}, (_, i) => i)
            if (restMatches === 0) return []

            let arr2 = arr.splice(arr.length / 2)
            r.push(arr2.shift())
            restMatches--

            if(restMatches > 0)
                r = [...r, ...getRestMatches(arr, Math.ceil(restMatches/2))]

            if(restMatches > 0)
                r = [...r, ...getRestMatches(arr2, Math.floor(restMatches/2))]

            return r.sort((a, b) => a - b);
        }

        function* nextTeam_Generator(){
            let i = -1            
            while(true){
                i++
                yield teams?.[i]?.name
            }            
        }

        const nextTeam = nextTeam_Generator()

        let rounds = getRounds(uBracketMatches_C)                
        let restMatches = getRestMatches(null, uBracketTeams_C - rounds[0]*2, rounds[1])
        let toLinks;
        const getNextToLink = () => {
            let i = toLinks.findIndex(l => l < 2)
            if(i < 0) throw Error('Oh uh, update ToLinks before fetching new!')
            toLinks[i]++
            return i;
        }
        const updateToLinks = (i) => {
            toLinks = new Array(rounds[i+1])
            toLinks.fill(0);
            if (i === 0){                
                for (let i = 0; i < restMatches.length; i++){
                    let v = restMatches[i]
                    toLinks[v] = (toLinks[v] ?? 0) + 1;
                }
                return
            }            
        }

        console.log(`Teams in playoff: ${uBracketTeams_C}`)
        console.log(`Total playoff matches: ${uBracketMatches_C}`)
        console.log("Playoff Rounds: ", rounds)
        console.log("restMatches: ", restMatches)

        let op;
        if(groupStage) op = getGroupStageOpponentsForPlayOff(rounds[0], restMatches); 
        
        let upperBracket = []
        let groupId = groups.length
        let advanceId = groupAdvance?.current?.value
        let matchCount = 0;
        //Create the upper bracket
        /*
            Lower bracket skall insertas hälften så många nerifrån och upp.
            Dvs första matchen blir loser of 1 & 2 andra 3 & 4.
            Sen på runda 2 däremot (jämna) så vändar man på ordningen.
        */
        rounds.map((r, i) => {
            upperBracket.push([])
            updateToLinks(i);
            
            for(let j = 0; j < r; j++){
                matchCount++
                let toLink
                try{
                    toLink = getNextToLink()
                }catch(e){
                    console.log(toLinks, i, j)
                    throw e;
                }
                let t1
                let t2;
                // Först rundan är bara att kötta på
                if(i === 0){                    
                    if (groupStage){
                        let t = op.pop();                        
                        t1 = t.t1//{group: groupId, placement: advanceId}
                        t2 = t.t2//{group: getOpponent(groupId, "group"), placement: getOpponent(advanceId, "placement")}
                    }else{
                        t1 = nextTeam.next().value
                        t2 = nextTeam.next().value
                    }
                }                                           

                // Runda två så gäller det att det är lag kvar, OCH att den finns i RestMatches-tabellen
                else if (i === 1 && uBracketTeams_C > 0 && restMatches.includes(j)){
                    let pre = upperBracket[0].findIndex(m => m.toLink === j)
                    if (groupStage){
                        let t = op.pop();
                        t1 = t.t1//{group: groupId, placement: advanceId}
                        if (pre === -1) t2 = t.t2//{group: getOpponent(groupId, "group"), placement: getOpponent(advanceId, "placement")}
                        else t2 = `∀Winner of match ${upperBracket[0][pre].match}`
                    }else{
                        t1 = nextTeam.next().value
                        if (pre === -1) t2 = nextTeam.next().value
                        else t2 = `∀Winner of match ${upperBracket[0][pre].match}`
                    }
                }
                
                else{
                    let pre = upperBracket[i-1].findIndex(m => m.toLink === j)
                    t1 = `∀Winner of match ${upperBracket[i-1][pre]?.match ?? "WTF"}`
                    pre = upperBracket[i-1].findIndex((m, ii) => m.toLink === j && ii !== pre)
                    t2 = `∀Winner of match ${upperBracket[i-1][pre]?.match ?? "WTF"}`
                }
                
                if (i === 0 || (i === 1 && uBracketTeams_C > 0 && restMatches.includes(j))){
                    groupId -= 1
                    advanceId -= 1
                    uBracketTeams_C -= i + Math.abs(2*(i-1));
                    if (advanceId === 0) advanceId += groups.length
                    if (groupId === 0) groupId += groups.length
                }

                upperBracket[i].push({
                    "name": "Match " + matchCount,
                    "bo": 3,
                    "gameResults": [undefined, undefined, undefined],
                    "winner": undefined,
                    "team1": t1,
                    "team2": t2,
                    "round": i,
                    "roundId": j,
                    "match": matchCount,
                    "toLink": toLink
                })
                uBracketMatches_C--;                
            }
        })
        console.log("upperBracket:", upperBracket)
        console.log("matches:", matches)


        let lowerBracket = [];        
        // Loser's Bracket
        if (eliminitationType === 2){
            lowerBracket.push([])
            rounds.map((r, i) => {
                for (let j = 0; j < r/2; j++){
                    matchCount++
                    lowerBracket[i].push({
                        "name": "Match " + matchCount,
                        "bo": 3,
                        "gameResults": [undefined, undefined, undefined],
                        "winner": undefined,
                        "team1": {match: j},
                        "team2": {match: j+1},
                        "round": i,
                        "roundId": j,
                        "match": matchCount,
                        "fromLink": undefined
                    }) 
                }
            })
        }            

        navigate("/skrallgaming/ThornamentBracket", {state:{
            groups,
            upperBracket,
            teams,
            groupMatches: matches
        }})
    }

    return <>        
        <div className="CreateThornamentBody">
            <div>                
                <span>
                    <fieldset className="part">
                        <legend>Tournament Info</legend>
                        <div className="inputBox">
                            <input id="tournamentName" required 
                                ref={tournamentName} defaultValue={'SSE-II 2022 Smash Doubles'}
                            /> 
                            <span>Tournament Name</span>
                        </div>
                        <div className="inputBox">
                            <select id="gameFormat" ref={gameFormat}>
                                {/* <option value="1v1">1v1</option> */}
                                <option value="2v2">2v2</option>
                            </select>
                            <span>Game Format</span>
                        </div>
                        <div className="inputBox">
                            <select id="game" ref={game}>
                                <option value="smash">Smash Ultimate</option>
                                <option value="beerPong">Beerpong</option>
                            </select>
                            <span>Game</span>
                        </div>                    
                        <div>
                            <input type="checkbox" id="groupStage" checked={groupStage}
                                onChange={() => setGroupStage(!groupStage)}
                            />
                            <label htmlFor="groupStage">Groupstage?</label>
                        </div>                    
                        {groupStage && <>
                            <div className="inputBox">
                                <input type="number" id="maxTeamsPerGrp" defaultValue={4} ref={groupMaxTeams}/> 
                                <span>Max teams per group</span>
                            </div>
                            <div className="inputBox">
                                <input type="number" id="advance" defaultValue={2} 
                                    ref={groupAdvance} min={1} 
                                /> 
                                <span>Teams advance from each group</span>
                            </div>
                            <div className="inputBox">
                                <input type="number" id="bo" defaultValue={2} ref={groupBO} min={1} max={7}/>
                                <span>Group Best Of</span>
                            </div>
                        </>} 
                        {/* <div className="inputBox">
                            <select required id="eliminitationType" ref={eliminitationType}>
                                <option value={1}>Single Elimination</option>
                                <option value={2}>Double Elimination</option>
                            </select>
                            <span>Elimination type</span>
                        </div> */}
                        {/* <div>
                            <input type="checkbox" id="eloStructure"/>
                            <label htmlFor="eloStructure">Structure by Elo</label>
                        </div>                     */}
                    </fieldset>
                </span>
                <span>
                    <fieldset className="part">
                        <legend>Team Registration</legend>                                            
                        <div className="inputBox">
                            <input list="p1" ref={p1} defaultValue={""}/>
                            <datalist id="p1"  >
                                <option value="" disabled/>
                                {players &&
                                    players.map(p => <option key={"1"+p?.name} value={p?.name}>{p?.name}</option>)
                                }
                            </datalist>
                            <span>Player 1</span>
                        </div>
                        <div className="inputBox">
                            <input list="p2" ref={p2} defaultValue={""}/>
                            <datalist id="p2"  >
                                <option value="" disabled/>
                                {players &&
                                    players.map(p => <option key={"2"+p?.name} value={p?.name}>{p?.name}</option>)
                                }
                            </datalist>
                            <span>Player 2</span>
                        </div>
                        <div className="inputBox">
                            <input id="teamName" required 
                                ref={teamName}
                                onKeyDown={(k) => {if(k.key === "Enter") registerTeam()}} 
                            /> 
                            <span>Team name</span>
                        </div>
                        <button onClick={() => registerTeam()}>Register Team</button>
                    </fieldset>
                </span>
                <span>
                    <fieldset>
                        <legend>Registered Teams</legend>
                        <table className="registeredTeams">
                            <thead><tr>
                                <th></th>
                                <th>Team</th>
                                <th>Players</th>
                            </tr></thead>
                            <tbody>
                                {teams &&
                                    teams.map((t, i) => <tr key={t.name}>
                                        <td>{i+1}</td>
                                        <td>{t.name}</td>
                                        <td>{t.players.join(' & ')}</td>
                                        <td><i onClick={() => removeTeam(i)}>❌</i></td>
                                    </tr>)
                                }
                            </tbody>
                        </table>
                    </fieldset>
                </span>
            </div>            
            {
                teams &&
                <div className="finishButton" onClick={() => startThornament()}>Hold to start Thornament</div>
            }
        </div>    
    </>
}