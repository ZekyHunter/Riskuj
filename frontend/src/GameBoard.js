import React, { useState, useEffect } from "react";
import "./GameBoard.css";
import axios from "axios";


export default function GameBoard({ categories, questions, activePlayer, setActivePlayer, openQuestion,
answeredQuestions, players, currentTurn }) {

  const [openedBricks, setOpenedBricks] = useState([]);

  function revealGold(question, questionIndex){
    setOpenedBricks((prevOpenedBricks) => [...prevOpenedBricks, question]);
    axios
      .patch(`/api/players/${currentTurn.id}/`, {points: currentTurn.points + (questionIndex * 100 + 100)})
      .catch((err) => console.log(err));
  }

  // Render the cell for each question
  const renderQuestionCell = (q, questionIndex) => {
    if (!q) return null;

    // Handle rendering for gold bricks
    if (q.includes("GOLD")) {
      if (openedBricks.includes(q)) {
        return <div className="gold-cell" key={questionIndex}>Zlatá cihla!</div>;
      } else {
        return (
          <div className="question-cell" key={questionIndex} onClick={() => revealGold(q, questionIndex)}>
            {questionIndex * 100 + 100}
          </div>
        );
      }
    }
    // If the question has already been answered, show an empty cell
    else if (answeredQuestions.includes(q)) {
      return <div className="question-cell" key={questionIndex}></div>;
    }
    // Otherwise, render a regular question cell
    else {
      return (
        <div className="question-cell" key={questionIndex} onClick={() => openQuestion(q, questionIndex)}>
          {questionIndex * 100 + 100}
        </div>
      );
    }
  };

  return (
    <div className="game-board">
      {categories.map((category, mapIndex) => (
        <div key={mapIndex}>
          <div className="oneCategoryRow">
            {category}
            {questions[mapIndex]?.map((question, questionIndex) =>
              renderQuestionCell(question, questionIndex)
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
