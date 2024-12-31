import React from "react";
import axios from "axios";
import "./Modal.css";


export default function Modal({ modalOpen, question, changeModalState, markQuestionAsAnswered, activePlayer,
  selectedQuestionPoints, setActivePlayer }) {

  if (!modalOpen) return null;

  function answer (response) {

    const playerDivs = document.getElementsByClassName("player");

    for (let element of playerDivs) {

      if (response === "correct") {
        markQuestionAsAnswered(question);
        changeModalState(question, selectedQuestionPoints);
        axios.patch(`/api/users/${activePlayer}/`, {answered: false}).catch((err) => console.log(err));
      } else {
        axios.patch(`/api/users/${activePlayer}/`, {answered: true}).catch((err) => console.log(err));
      }

      const p = element.querySelector('p.username');

      if (p.parentElement.id === String(activePlayer)) {
        const pointsElement = element.querySelector("p.points")
        let playerPoints = parseInt(pointsElement.textContent, 10);

        if (response === "correct") {
          playerPoints = playerPoints + selectedQuestionPoints;
          pointsElement.textContent = playerPoints;
          axios.patch(`/api/users/${activePlayer}/`, {points: playerPoints}).catch((err) => console.log(err));
        } else if (response === "wrong") {
          playerPoints = playerPoints - selectedQuestionPoints;
          pointsElement.textContent = playerPoints;
          axios.patch(`/api/users/${activePlayer}/`, {points: playerPoints}).catch((err) => console.log(err));
        }
        break;
      }

    }

    axios.delete("/api/active-players/1").catch((err) => console.log(err));

  }

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
