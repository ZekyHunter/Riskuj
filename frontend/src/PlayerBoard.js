import React, { useState, useEffect } from "react";
import "./UserBoard.css";


export default function UserBoard ({ player, activePlayer }) {

    const [playerClass, setPlayerClass] = useState("normal player");
    const [points, setPoints] = useState(null);

    const playerId = `player-${player.id}`

    // Update player div className when activePlayer changes
    useEffect(() => {
      if (activePlayer && player && (player.id == activePlayer.player)) {
        setPlayerClass("active player");
        setPoints(activePlayer.points);
      } else {
        setPlayerClass("normal player");
        setPoints(player.points);
      }
    }, [activePlayer, player]); // Dependencies: this effect runs when activePlayer or player changes

    return (
      <div className={ playerClass } id={playerId}>
        <p className="username">{player.name}</p>
        <p className="points">{points}</p>
      </div>
    );
}
