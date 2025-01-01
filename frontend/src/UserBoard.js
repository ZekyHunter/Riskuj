import React, { useState, useEffect } from "react";
import "./UserBoard.css";


export default function UserBoard ({ user, activePlayer }) {

    const [playerClass, setPlayerClass] = useState("normal player");
    const [points, setPoints] = useState(null);

    const playerId = `player-${user.id}`

    // Update player div className when activePlayer changes
    useEffect(() => {
      if (activePlayer && user && (user.id == activePlayer.user)) {
        setPlayerClass("active player");
        setPoints(activePlayer.points);
      } else {
        setPlayerClass("normal player");
        setPoints(user.points);
      }
    }, [activePlayer, user]); // Dependencies: this effect runs when activePlayer or user.id changes

    return (
      <div className={ playerClass } id={playerId}>
        <p className="username">{user.name}</p>
        <p className="points">{points}</p>
      </div>
    );
}
