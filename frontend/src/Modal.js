import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Modal.css";


export default function Modal({ modalOpen, question, openQuestion, closeQuestion, markQuestionAsAnswered, activePlayer,
  selectedQuestionPoints, setActivePlayer, currentTurn, setCurrentTurn, players }) {

  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    setButtonDisabled(!!!activePlayer); // !! converts activePlayer to a boolean
  }, [activePlayer]);

  if (!modalOpen) return null;

  function answer (response) {
    let answered = false;
    let playerPoints = activePlayer.points;

    if (response === "correct") {
      markQuestionAsAnswered(question);
      closeQuestion();
      playerPoints += selectedQuestionPoints;

    } else if (response === "wrong") {
      // if the user answers wrongly, other players may still answer
      playerPoints -= selectedQuestionPoints;
      answered = true;
    }

    setActivePlayer(prevState => ({
      ...prevState,
      points: playerPoints,
    }));

    const player = players.find((item) => item.id === activePlayer.player);
    setCurrentTurn(player)

    axios
      .patch(`/api/players/${activePlayer.player}/`, {points: playerPoints, answered: answered})
      .catch((err) => console.log(err));

    axios.get("/api/clear/").catch((err) => console.log(err));
  }

  // when the question is closed, close the modal, remove activePlayer and update users.answered = false
  function close () {
    markQuestionAsAnswered(question);
    closeQuestion();
    axios.get("/api/clear/").catch((err) => console.log(err));
  }

  return (
    <div className="modal-overlayTEST">
      <div className="modal">
        <h2 style={{color:"black"}}>{question}</h2>
        <button onClick={() => answer("correct")} disabled={buttonDisabled}>Správná odpověď</button>
        <button onClick={() => answer("wrong")} disabled={buttonDisabled}>Špatná odpověď</button>
        <button onClick={() => close()}>Zavřít</button>
      </div>
    </div>
  );
};
