import React, { useState } from "react";

const PlayerPage = () => {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true); // Označí, že jméno bylo zadáno
  };

  return (
    <div className="player-page">
      <h1>Player Registration</h1>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <label>
            Enter your name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div>
          <p>Welcome, {name}!</p>
          <button>Click Me!</button> {/* Tlačítko na budoucí funkce */}
        </div>
      )}
    </div>
  );
};

export default PlayerPage;
