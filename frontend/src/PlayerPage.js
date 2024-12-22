import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PlayerPage.css";


export default function PlayerPage({ isActive, player, setPlayer }) {

  const [name, setName] = useState('');
  const [uniqueUsername, setUniqueUsername] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // TODO: after login, setinterval to check if button has been pressed by any other player
  // if it has, disable the button and start checking if active-players is empty to reactivate the button
  // but only if I did not press the button and answered wrongly!

  function answer(name) {
    const timestamp = Date.now();

    // POST request to log button press
    axios.post('/api/button-press/', { username: name, timestamp })
      .catch((err) => console.log(err));

    // Disable the button immediately when it's pressed
    setButtonDisabled(true);

    const intervalId = setInterval(() => {
        axios
          .get("/api/active-players/")
          .then((res) => {
            console.log(res);
            if (res.data.length === 0) {
              clearInterval(intervalId);
              setButtonDisabled(false);
            }
          })
          .catch((err) => console.log(err));
      }, 5000);
  }

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      // Clear any interval if the component is unmounted
      clearInterval();
    };
  }, []);

  function addUser(e) {
    e.preventDefault();
    axios
      .post("/api/users/", { name: name, unique_username: uniqueUsername })
      .catch((err) => {console.log(err); alert("This username already exists.")})
      .then((res) => {
        if (res) {
          setPlayer(res.data); // Set the player data once response is received
        }
      });
  }

  return (
    <div id="player-page">
      { player ? (
      <div>
        <h1>we have a player</h1>
          <h1>{player.unique_username}</h1>
          <button
            id="main-button"
            onClick={() => answer(player.id)}
            disabled={buttonDisabled}
          >
            PUSH
          </button>
          </div>
      ) : (
            <div>

        <h1>we do not have a player</h1>
        <h1>Přidej hráče</h1>
        <form onSubmit={addUser}>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="jméno"
            value={name}
            onChange={(e) => setName(e.target.value)} // This updates the state correctly
          />
          <input
            type="text"
            id="unique_username"
            name="unique_username"
            value={uniqueUsername}
            pattern="[a-z]+"
            onChange={(e) => setUniqueUsername(e.target.value)} // This updates the state correctly
            title="Použijte pouze malá písmena bez diakritiky"
            placeholder="unikátní přezdívka"
            required
          />
          <input type="submit" value="Uložit" />
        </form>
                  </div>

      )}
    </div>
  );
}
