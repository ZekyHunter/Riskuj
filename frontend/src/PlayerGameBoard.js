import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PlayerGameBoard({ player, setPlayer }) {

  const [buttonDisabled, setButtonDisabled] = useState(true);

  function answer() {
    // Disable the button immediately when it's pressed
    setButtonDisabled(true);

    // POST request to create ActivePlayer entry with timestamp
    axios
      .post('/api/button-press/', { player: player.id, timestamp: Date.now() })
      .catch((err) => console.log(err));

    axios
      .post('/api/can-answer/', { can_answer: false })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    const activePlayerSource = new EventSource("/sse/active-players/");

    activePlayerSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.active_players.length === 0) {
        axios
          .get(`/api/players/${player.id}/`)
          .catch((err) => {console.log(err)})
          .then((res) => {
            if (res.data.can_answer) {
              setButtonDisabled(false);
            } else {
              setButtonDisabled(true);
            }})
      } else {
        setButtonDisabled(true);
      }
    };

    return () => activePlayerSource.close();
  }, []);


  return (
    <div>
      <h1>{player.name}</h1>
      <p>Unikátní přezdívka: { player.unique_username }</p>
      <button
        id="main-button"
        className="button"
        onClick={() => answer()}
        disabled={buttonDisabled}
      >PUSH</button>
    </div>
  )
}