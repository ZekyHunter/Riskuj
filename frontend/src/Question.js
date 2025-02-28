import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Question.css";


export default function Question({ questionOpened, question, openQuestion, closeQuestion, markQuestionAsAnswered, activePlayer,
  selectedQuestionPoints, setActivePlayer, currentTurn, setCurrentTurn, players }) {

  const [buttonDisabled, setButtonDisabled] = useState(false);

  // when the question is closed, close the Question component, remove activePlayer and update users.answered = false
  function close () {
    markQuestionAsAnswered(question);
    closeQuestion();
    axios.get("/api/clear/").catch((err) => console.log(err));
  }

  useEffect(() => {
    setButtonDisabled(!!!activePlayer); // !! converts activePlayer to a boolean, ! negates the statement
  }, [activePlayer]);

  if (!questionOpened) return null;

  function answer (response) {
    let answered = false;
    let playerPoints = activePlayer.points;

    if (response === "correct") {
      // TODO: what happens when this is a bonus question? (therefore no points to award)
      markQuestionAsAnswered(question);
      closeQuestion();
      playerPoints += selectedQuestionPoints;
      axios.get("/api/clear/").catch((err) => console.log(err));
    }
    else if (response === "wrong") {
      // if the user answers wrongly, other players may still answer
      playerPoints -= selectedQuestionPoints;
      answered = true;
      axios
        .delete(`/api/active-players/${activePlayer.id}/`)
        .catch((err) => console.log(err));
    }

    setActivePlayer(prevState => ({
      ...prevState,
      points: playerPoints,
    }));

    // Set CurrentPlayer to be the player who answered the question (no matter if correctly or not)
    const player = players.find((item) => item.id === activePlayer.player);
    setCurrentTurn(player)

    axios
      .patch(`/api/players/${activePlayer.player}/`, {points: playerPoints, answered: answered})
      .catch((err) => console.log(err));
  }

  return (
    <div className="question">
      <h2 id="questionText">{question}</h2>

      <div>
        <button className="button" onClick={() => answer("correct")} disabled={buttonDisabled}>Správná odpověď</button>
        <button className="button" onClick={() => answer("wrong")} disabled={buttonDisabled}>Špatná odpověď</button>
      </div>

      <button className="button" onClick={() => close()}>Zavřít</button>
    </div>
  );
};
