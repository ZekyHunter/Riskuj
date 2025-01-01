import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddPlayer({ setPlayer }) {

  const [name, setName] = useState('');
  const [uniqueUsername, setUniqueUsername] = useState('');

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

  function loadUser(e) {
    e.preventDefault();

    axios
      .get(`/api/users/lookup/${uniqueUsername}`)
      .catch((err) => {console.log(err); alert("error")})
      .then((res) => {
        if (res) {
          setPlayer(res.data); // Set the player data once response is received
        }
      });
  }

  return (
    <div>
      <h1>Přidej hráče</h1>
      <form onSubmit={addUser}>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="jméno"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input type="submit" value="Uložit" />
      </form>

      <h1>Přihlaš se</h1>
      <form onSubmit={loadUser}>
        <input
          type="text"
          id="unique_username"
          name="unique_username"
          pattern="[a-z]+"
          placeholder="unikátní přezdívka"
          value={uniqueUsername}
          onChange={(e) => setUniqueUsername(e.target.value)}
          required
        />
        <input type="submit" value="Přihlásit" />
      </form>
    </div>
  )
}