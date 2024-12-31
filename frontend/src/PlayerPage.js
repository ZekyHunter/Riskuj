import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PlayerPage.css";
import PlayerGameBoard from "./PlayerGameBoard";
import AddPlayer from "./AddPlayer";


export default function PlayerPage() {

  const [player, setPlayer] = useState(null);

  return (
    <div id="player-page">
      { player ? (
        <PlayerGameBoard
          player={player}
          setPlayer={setPlayer}
        />
      ) : (
        <AddPlayer
          setPlayer={setPlayer}
        />
      ) }
    </div>
  );

}
