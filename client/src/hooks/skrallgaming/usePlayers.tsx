import { useContext } from "react";
import PlayersContext from "../../context/skrallgaming/PlayersContext_Provider"

const usePlayers = () => {
    return useContext(PlayersContext)
}

export default usePlayers
