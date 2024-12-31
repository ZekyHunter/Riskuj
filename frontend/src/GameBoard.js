import React, { useState, useEffect } from "react";
import "./GameBoard.css";
import axios from "axios";


export default function GameBoard({ activePlayer, setActivePlayer, changeModalState, answeredQuestions }) {

  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [openedBricks, setOpenedBricks] = useState([]);

  // Helper function to update player points
  const updatePlayerPoints = (questionIndex) => {
    const playerDiv = document.querySelector(`#player-${activePlayer}`);
    if (playerDiv) {
      const pointsElement = playerDiv.querySelector("p.points");
      let playerPoints = parseInt(pointsElement.textContent, 10);
      playerPoints += (questionIndex * 100 + 100);
      pointsElement.textContent = playerPoints;
    }
  };

  function revealGold(question, questionIndex){
    setOpenedBricks((prevOpenedBricks) => [...prevOpenedBricks, question]);  // prevOpenedBricks is the state before the update

    // Update points for the active player
    updatePlayerPoints(questionIndex);

    axios.delete("/api/active-players/1").catch((err) => console.log(err));
    setActivePlayer(null);

  }

  function initializeGameBoard(data){
    let categories = []
    let questionsList = []
    for (let [category, questions] of Object.entries(data)) {
        categories.push(category);
        questionsList.push(questions)
    }
    setCategories(categories);

    // Add gold bricks to random spots
    const randomQuestionsList = [...questionsList];
    for (let i = 0; i < 3; i++) {
      const randomCategoryIndex = Math.floor(Math.random() * 6);
      const randomQuestionIndex = Math.floor(Math.random() * 5);
      randomQuestionsList[randomCategoryIndex][randomQuestionIndex] = `GOLD ${i + 1}`;
    }
    setQuestions(randomQuestionsList);
  }

  // Fetch data on mount
  useEffect(() => {
    axios
      .get("/api/questions/")
      .then(res => { initializeGameBoard(res.data) })
      .catch((err) => alert("Pravděpodobně vám chybí otázky v databázi."));
  }, []);

  // Render each question cell
  const renderQuestionCell = (q, questionIndex) => {
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
    } else if (answeredQuestions.includes(q)) {
      return <div className="question-cell" key={questionIndex}></div>;
    } else {
      return (
        <div className="question-cell" key={questionIndex} onClick={() => changeModalState(q, questionIndex)}>
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
  );
}
