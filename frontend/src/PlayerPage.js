import React, { useState } from "react";
import axios from "axios";


export default function PlayerPage() {

  function addUser (e) {
    axios
      .post("/api/users/", e.target)
      .catch((err) => console.log(err));
  }


  return (
    <div>
      <h1>Přidej hráče</h1>
      <form onSubmit={addUser}>
        <input type="text" id="name" name="name" placeholder="jméno"/>
        <input type="submit" value="Uložit"/>
      </form>
    </div>
  );

};
