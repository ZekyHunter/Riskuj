import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Question.css";


export default function Question({ questionOpened, question, openQuestion, closeQuestion, markQuestionAsAnswered, activePlayer,
  selectedQuestionPoints, setActivePlayer, currentTurn, setCurrentTurn, players }) {

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      const id = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      setTimerId(id);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(timerId);
    setTimerId(null);
    setTimeLeft(30);
  };

  useEffect(() => {
    if (timeLeft <= 0 && isRunning) {
      alert("Time out!");
      stopTimer();
    }
  }, [timeLeft, isRunning]);

  useEffect(() => {
    return () => clearInterval(timerId);
  }, [timerId]);

  useEffect(() => {
    setButtonDisabled(!!!activePlayer); // !! converts activePlayer to a boolean
  }, [activePlayer]);

  useEffect(() => {
    startTimer();
  }, [])

  if (!questionOpened) return null;

  function answer (response) {
    stopTimer();
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

  // when the question is closed, close the Question component, remove activePlayer and update users.answered = false
  function close () {
    markQuestionAsAnswered(question);
    closeQuestion();
    axios.get("/api/clear/").catch((err) => console.log(err));
  }

  return (
    <div>
      <div className="question">
        <h2 style={{color:"black"}}>{question}</h2>
        <button onClick={() => answer("correct")} disabled={buttonDisabled}>Správná odpověď</button>
        <button onClick={() => answer("wrong")} disabled={buttonDisabled}>Špatná odpověď</button>
        <button onClick={() => close()}>Zavřít</button>

        <div id="progressBar">
          <div
            style={{
              width: "100%",
              height: "20px",
              backgroundColor: "#e0e0e0",
              overflow: "hidden",
              marginBottom: "20px",
            }}
          >
        <div
          style={{
            width: `${(timeLeft / 30) * 100}%`,
            height: "100%",
            backgroundColor: "#c64100",
            transition: "width 1s linear",
          }}
        ></div></div>
        </div>
      </div>
    </div>
  );
};
