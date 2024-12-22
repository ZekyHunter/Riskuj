import React from "react";
import axios from "axios";
import "./Modal.css";


export default function Modal({ isOpen, question, changeModalState, markQuestionAsAnswered, activePlayer,
  selectedQuestionPoints, setActivePlayer }) {

  if (!isOpen) return null;

  function answer (response) {

    console.log("you pushed a button")
    console.log(activePlayer);

    const playerDivs = document.getElementsByClassName("player");
    for (let element of playerDivs) {
      const p = element.querySelector('p.username');

      console.log(p)

      if (p.parentElement.id == activePlayer) {
        const pointsElement = element.querySelector("p.points")
        let playerPoints = parseInt(pointsElement.textContent, 10);

        if (response === "correct") {
          playerPoints = playerPoints + selectedQuestionPoints;
          pointsElement.textContent = playerPoints;
        } else if (response === "wrong") {
          playerPoints = playerPoints - selectedQuestionPoints;
          pointsElement.textContent = playerPoints;
        }
        break;
      }

      if (response === "correct") {
        markQuestionAsAnswered(question, response);
        changeModalState(question, selectedQuestionPoints);
      } else {
        axios.patch(`/api/users/${activePlayer}/`, {answered: true}).catch((err) => console.log(err));
        // deselect active player
        setActivePlayer(null);
        //TODO: find out player id
        // TODO: update player in db { answered: true }
      }

    }

    axios.delete("/api/active-players/1").catch((err) => console.log(err));
    // TODO: send update to backend api with player points to save to db in case of page crash
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 style={{color:"black"}}>{question}</h2>
        <button onClick={() => answer("correct")}>Správná odpověď</button>
        <button onClick={() => answer("wrong")}>Špatná odpověď</button>
        <button onClick={() => changeModalState(question)}>Zavřít</button>
      </div>
    </div>
  );
};
