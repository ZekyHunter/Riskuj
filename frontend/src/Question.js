import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Question.css";


export default function Question({ questionOpened, question, openQuestion, closeQuestion, markQuestionAsAnswered, activePlayer,
  selectedQuestionPoints, setActivePlayer, currentTurn, setCurrentTurn, players }) {

  const [buttonDisabled, setButtonDisabled] = useState(false);

  // when the question is closed, close the Question component, remove activePlayer and update users.answered = false
  function close () {
    markQuestionAsAnswered(question);
    closeQuestion();  // TODO: answered
  }

  useEffect(() => {
    setButtonDisabled(!!!activePlayer); // !! converts activePlayer to a boolean, ! negates the statement
  }, [activePlayer]);

  if (!questionOpened) return null;

  function answer (response) {
    let answered_wrong = false;

    let playerPoints = activePlayer.points;

    if (response === "correct") {
      markQuestionAsAnswered(question);
      closeQuestion();  // TODO: answered
      playerPoints += selectedQuestionPoints;
      axios.get("/api/clear/").catch((err) => console.log(err));
    }
    else if (response === "wrong") {
      if (selectedQuestionPoints !== 0) {
          // TODO: answered
          axios
          .post('/api/answered-wrong/', { player_id: activePlayer.player })
          .catch((err) => console.log(err));

          playerPoints -= selectedQuestionPoints;
      }

    answered_wrong = true;
      // if the user answers wrongly, other players may still answer

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
      .patch(`/api/players/${activePlayer.player}/`, {points: playerPoints, answered_wrong: answered_wrong })
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
