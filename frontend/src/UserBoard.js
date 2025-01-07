import React, { useState, useEffect } from "react";
import "./UserBoard.css";

export default function UserBoard({ user, activePlayer }) {
  const [playerClass, setPlayerClass] = useState("normal player");

  // Update playerClass when the activePlayer or user changes
  useEffect(() => {
    if (user.id == activePlayer) {
      setPlayerClass("active player");
    } else {
      setPlayerClass("normal player");
    }
  }, [activePlayer, user.id]); // Dependencies: this effect runs when activePlayer or user.id changes

  return (
    <div className={playerClass} id={user.id}>
      <p className="username">{user.name}</p>
      <p className="points">{user.points}</p>
    </div>
  );
}
