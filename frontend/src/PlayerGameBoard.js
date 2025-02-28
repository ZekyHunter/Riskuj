import React, { useState, useEffect } from "react";
import axios from "axios";
import { INTERVAL_DURATION } from "./config";

export default function PlayerGameBoard({ player, setPlayer }) {

  const [buttonDisabled, setButtonDisabled] = useState(true);

  function answer() {
    // Disable the button immediately when it's pressed
    setButtonDisabled(true);

    // POST request to create ActivePlayer entry with timestamp
    axios
      .post('/api/button-press/', { player: player.id, timestamp: Date.now() })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    // Start interval on component mount
    // Continuously check if the button should be enabled or disabled
    const intervalId = setInterval(() => {
      axios
        .get("/api/active-players/")
        .then((res) => {
          // If there is no ActivePlayer, check if the player already answered (wrongly)
          // If they did not answer, enable the button
          // Otherwise disable the button
          if (res.data.length === 0) {
            axios
              .get(`/api/players/${player.id}/`)
              .catch((err) => {console.log(err)})
              .then((res) => {
                if (!res.data.answered) {
                  setButtonDisabled(false);
                }})
          } else {
            setButtonDisabled(true);
          }
        })
        .catch((err) => console.log(err));
    }, INTERVAL_DURATION);

    return () => {
      clearInterval(intervalId);  // Clear any interval if the component is unmounted
    };
  }, []);


  return (
    <div>
      <h1>{player.name}</h1>
      <button
        id="main-button"
        className="button"
        onClick={() => answer()}
        disabled={buttonDisabled}
      >PUSH</button>
    </div>
  )
}