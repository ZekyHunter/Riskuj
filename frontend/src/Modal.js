import React from "react";
import axios from "axios";
import "./Modal.css";


export default function Modal({ modalOpen, question, changeModalState, markQuestionAsAnswered, activePlayer,
  selectedQuestionPoints, setActivePlayer }) {

  if (!modalOpen) return null;

  function answer (response) {

    axios.delete("/api/active-players/1").catch((err) => console.log(err));

      if (response === "correct") {
        markQuestionAsAnswered(question);
        changeModalState(question, selectedQuestionPoints);
        axios.patch(`/api/users/${activePlayer}/`, {answered: false}).catch((err) => console.log(err));
      } else {
        axios.patch(`/api/users/${activePlayer}/`, {answered: true}).catch((err) => console.log(err));
      }

      const playerDiv = document.querySelector(`#player-${activePlayer}`);
      if (playerDiv) {
        const pointsElement = playerDiv.querySelector("p.points");
        let playerPoints = parseInt(pointsElement.textContent, 10);
        if (response === "correct") {
          playerPoints += selectedQuestionPoints;
        } else if (response === "wrong") {
          playerPoints -= selectedQuestionPoints;
        }
        pointsElement.textContent = playerPoints;
        axios.patch(`/api/users/${activePlayer}/`, {points: playerPoints}).catch((err) => console.log(err));
      }

  }

  // when the question is closed, close the modal and update users as not having answered
  function close () {
    changeModalState(question, selectedQuestionPoints);
    axios.patch(`/api/users/${activePlayer}/`, {answered: false}).catch((err) => console.log(err));
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
