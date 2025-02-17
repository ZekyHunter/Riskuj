import React, { useState, useEffect } from "react";
import "./GameBoard.css";
import axios from "axios";
import gold from './sounds/gold.mp3';


export default function GameBoard({ categories, questions, activePlayer, setActivePlayer, openQuestion,
answeredQuestions, setAnsweredQuestions, openedBricks, setOpenedBricks, players, currentTurn }) {


  function bonusQuestionIsActive(categoryIndex) {
    const questionsInCategory = questions[categoryIndex] || [];
    const unansweredCount = questionsInCategory.filter(q => !answeredQuestions.includes(q)).length;
    return unansweredCount > 1;
  }

  function revealGold(question, questionIndex){
    const audio = new Audio(gold);
    audio.play();

    setOpenedBricks((prevOpenedBricks) => [...prevOpenedBricks, question]);
    setAnsweredQuestions([...answeredQuestions, question]);

    setTimeout(() => {
      setOpenedBricks((prevOpenedBricks) => prevOpenedBricks.filter(q => q !== question));
    }, 5000);

    axios
      .patch(`/api/players/${currentTurn.id}/`, {points: currentTurn.points + (questionIndex * 100)})
      .catch((err) => console.log(err));
  }

  // Render the cell for each question
  const renderQuestionCell = (q, questionIndex, category, mapIndex) => {
    if (!q) return null;

    // Handle rendering for gold bricks
    if (q.includes("GOLD")) {
      if (openedBricks.includes(q)) {
        return <div className="gold-cell" key={questionIndex}>Zlatá cihla!</div>;
      }
      else if (answeredQuestions.includes(q)) {
        return <div className="question-cell-empty" key={questionIndex}></div>;
      }
      else if (questionIndex === 0) {
        return (
          <button className="category" key={questionIndex} disabled={bonusQuestionIsActive(mapIndex)}
          onClick={() => revealGold(q, questionIndex)}>
            { category }
          </button>
        );
      }
      else {
        return (
          <div className="question-cell" key={questionIndex} onClick={() => revealGold(q, questionIndex)}>
            {questionIndex * 100}
          </div>
        );
      }
    }
    // If the question has already been answered, show an empty cell
    else if (answeredQuestions.includes(q)) {
      return <div className="question-cell-empty" key={questionIndex}></div>;
    }
    // Handle rendering bonus questions
    else if (questionIndex === 0) {
      return (
        <button className="category" key={questionIndex} disabled={bonusQuestionIsActive(mapIndex)}
        onClick={() => openQuestion(q, questionIndex)}>
          { category }
        </button>
      );
    }
    // Otherwise, render a regular question cell
    else {
      return (
        <div className="question-cell" key={questionIndex} onClick={() => openQuestion(q, questionIndex)}>
          {questionIndex * 100}
        </div>
      );
    }
  };

  return (
    <div className="game-board">
      {categories.map((category, mapIndex) => (
        <div key={mapIndex}>
          <div className="oneCategoryRow">
            {questions[mapIndex]?.map((question, questionIndex) =>
              renderQuestionCell(question, questionIndex, category, mapIndex)
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
