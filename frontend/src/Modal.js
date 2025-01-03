import React from "react";
import axios from "axios";
import "./Modal.css";


export default function Modal({ modalOpen, question, changeModalState, markQuestionAsAnswered, activePlayer,
  selectedQuestionPoints, setActivePlayer }) {

  if (!modalOpen) return null;

  function answer (response) {

    axios.delete(`/api/active-players/${activePlayer.player}/`).catch((err) => console.log(err));

    let answered = false;
    let playerPoints = activePlayer.points;

    if (response === "correct") {
      markQuestionAsAnswered(question);
      changeModalState(question, selectedQuestionPoints);
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

    axios
      .patch(`/api/players/${activePlayer.player}/`, {points: playerPoints, answered: answered})
      .catch((err) => console.log(err));
  }

  // when the question is closed, close the modal and update users as not having answered
  function close () {
    changeModalState(question, selectedQuestionPoints);
    axios.get("/api/clear/").catch((err) => console.log(err));
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 style={{color:"black"}}>{question}</h2>
        <button onClick={() => answer("correct")}>Správná odpověď</button>
        <button onClick={() => answer("wrong")}>Špatná odpověď</button>
        <button onClick={() => close()}>Zavřít</button>
      </div>
    </div>
  );
};
