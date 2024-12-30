import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PlayerGameBoard({ player }) {

  const [buttonDisabled, setButtonDisabled] = useState(false);

  // TODO: after login, setinterval to check if button has been pressed by any other player
  // if it has, disable the button and start checking if active-players is empty to reactivate the button
  // but only if I did not press the button and answered wrongly!

  function answer() {

    // Disable the button immediately when it's pressed
    setButtonDisabled(true);

    // POST request to log button press
    axios.post('/api/button-press/', { user: player.id, timestamp: Date.now() })
      .catch((err) => console.log(err));

    const intervalId = setInterval(() => {
      axios
        .get("/api/active-players/")
        .then((res) => {
          if (res.data.length === 0) {
            clearInterval(intervalId);
            setButtonDisabled(false);
          }
        })
        .catch((err) => console.log(err));
    }, 5000);
  }

  useEffect(() => {
    return () => {
      clearInterval();  // Clear any interval if the component is unmounted
    };
  }, []);


  return (
    <div>
      <h1>Player: {player.name}</h1>
      <button
        id="main-button"
        onClick={() => answer()}
        disabled={buttonDisabled}
      >PUSH</button>
    </div>
  )
}