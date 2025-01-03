import React, { useState, useEffect } from "react";
import "./GameBoard.css";
import axios from "axios";


export default function GameBoard({ activePlayer, setActivePlayer, changeModalState, answeredQuestions }) {

  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [openedBricks, setOpenedBricks] = useState([]);

  function revealGold(question, questionIndex){
    setOpenedBricks((prevOpenedBricks) => [...prevOpenedBricks, question]);  // prevOpenedBricks is the state before the update

    // Update points for the active player
    setActivePlayer(prevState => ({
      ...prevState,  // keep all other properties intact
      points: prevState.points + (questionIndex * 100 + 100),  // only update points
    }));

    axios.delete(`/api/active-players/${activePlayer.player}/`).catch((err) => console.log(err));
  }

  function initializeGameBoard(data){
    const categories = []
    const questionsList = []
    for (let [category, questions] of Object.entries(data)) {
        categories.push(category);
        questionsList.push(questions)
    }
    setCategories(categories);

    // Add 3 gold bricks in random spots within the question grid
    const randomQuestionsList = [...questionsList];
    for (let i = 0; i < 3; i++) {
      const randomCategoryIndex = Math.floor(Math.random() * 6);
      const randomQuestionIndex = Math.floor(Math.random() * 5);
      randomQuestionsList[randomCategoryIndex][randomQuestionIndex] = `GOLD ${i + 1}`;
    }
    setQuestions(randomQuestionsList);
  }

  // Make an API request to fetch questions data on component mount
  useEffect(() => {
    axios
      .get("/api/questions/")
      .then(res => { initializeGameBoard(res.data) })
      .catch((err) => console.log(err));
  }, []);

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
