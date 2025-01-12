import React, { useState, useEffect } from "react";
import "./GameBoard.css";
import axios from "axios";

export default function GameBoard({
  activePlayer,
  changeModalState,
  answeredQuestions,
}) {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [openedBricks, setOpenedBricks] = useState([]);

  function revealGold(question, questionIndex) {
    setOpenedBricks([...openedBricks, question]);

    const playerDivs = document.getElementsByClassName("player");
    for (let element of playerDivs) {
      const usernameElement = element.querySelector("p.username");

      if (usernameElement.parentElement.id === String(activePlayer)) {
        const pointsElement = element.querySelector("p.points");
        let playerPoints = parseInt(pointsElement.textContent, 10);
        playerPoints = playerPoints + (questionIndex * 100 + 100);
        pointsElement.textContent = playerPoints;
        break;
      }
    }
  }

  function createGameBoard(data) {
    let categories = [];
    let questions_list = [];
    for (let [category, questions] of Object.entries(data)) {
      categories.push(category);
      questions_list.push(questions);
    }
    setCategories(categories);

    // add gold bricks into randomly generated spots
    for (let i = 0; i < 3; i++) {
      questions_list[Math.floor(Math.random() * 6)][
        Math.floor(Math.random() * 5)
      ] = `GOLD ${i + 1}`;
    }

    // set questions
    setQuestions(questions_list);
  }

  useEffect(() => {
    axios
      .get("/api/questions/")
      .then((res) => {
        createGameBoard(res.data);
      })
      .catch((err) => alert("Pravděpodobně vám chybí otázky v databázi."));
  }, []); // Empty dependency array means this runs only on mount and unmount

  function viewQuestion(q, questionIndex) {
    if (q.includes("GOLD")) {
      if (openedBricks.includes(q)) {
        return (
          <div className="gold-cell" key={questionIndex}>
            Zlatá cihla!
          </div>
        );
      } else {
        return (
          <div
            className="question-cell"
            key={questionIndex}
            onClick={() => revealGold(q, questionIndex)}
          >
            {questionIndex * 100 + 100}
          </div>
        );
      }
    } else if (answeredQuestions.includes(q)) {
      return <div className="question-cell-empty" key={questionIndex}></div>;
    } else {
      return (
        <div
          className="question-cell"
          key={questionIndex}
          onClick={() => changeModalState(q, questionIndex)}
        >
          {questionIndex * 100 + 100}
        </div>
      );
    }
  }

  return (
    <div className="game-board">
      {categories.map((category, mapIndex) => (
        <div key={mapIndex}>
          <div className="oneCategoryRow">
            <div className="category">{category}</div>
            {questions[mapIndex].map((question, questionIndex) =>
              viewQuestion(question, questionIndex)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
