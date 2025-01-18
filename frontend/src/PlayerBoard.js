import React, { useState, useEffect } from "react";
import "./PlayerBoard.css";


export default function UserBoard ({ player, activePlayer, currentTurn }) {

    const [activePlayerClass, setActivePlayerClass] = useState("normal");
    const [currentTurnClass, setCurrentTurnClass] = useState("");
    const [points, setPoints] = useState(null);

    const playerId = `player-${player.id}`

    // Update player div className when activePlayer changes
    useEffect(() => {
      console.log(activePlayer);
      if (activePlayer && player && (player.id == activePlayer.player)) {
        setActivePlayerClass("active");
        setPoints(activePlayer.points);
      } else {
        setActivePlayerClass("normal");
        setPoints(player.points);
      }
    }, [activePlayer, player]); // Dependencies: this effect runs when activePlayer or player changes

    useEffect(() => {
      if (currentTurn && player && (player.id == currentTurn.id)) {
        setCurrentTurnClass("current");
      } else {
        setCurrentTurnClass("");
      }
    }, [currentTurnClass, player])

    return (
      <div className={"player " + activePlayerClass + " " + currentTurnClass} id={playerId}>
        <p className="username">{player.name}</p>
        <p className="points">{points}</p>
      </div>
    );
}
