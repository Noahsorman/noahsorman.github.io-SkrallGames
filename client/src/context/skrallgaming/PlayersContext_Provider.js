import React, { createContext, useState } from "react";
import { Outlet } from "react-router-dom";

const PlayersContext = createContext({});

export const PlayersProvider = () => {
    const [players, setPlayers] = useState([]);

    return (
        <PlayersContext.Provider value={{ players, setPlayers }}>
            <Outlet />
        </PlayersContext.Provider>
    )
}

export default PlayersContext;

