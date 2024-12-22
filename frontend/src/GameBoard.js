import React from "react";
import "./GameBoard.css";


export default function GameBoard({
categories, questions, modalIsOpen, changeModalState, answeredQuestions, openedBricks, revealGold}) {

  if (!categories) return null;

  function viewQuestion(q, questionIndex) {

    if (q.includes("GOLD")) {
      if (openedBricks.includes(q)) {
        return (<div className="gold-cell" key={questionIndex}>Zlatá cihla!</div>)
      } else {
        return (
          <div className="question-cell" key={questionIndex} onClick={() => revealGold(q, questionIndex)}>
            {questionIndex * 100 + 100}
          </div>
        )
      }
    } else if (answeredQuestions.includes(q)) {
      return (<div className="question-cell" key={questionIndex}></div>)
    } else {
      return (
        <div className="question-cell" key={questionIndex} onClick={() => changeModalState(q, questionIndex)}>
          {questionIndex * 100 + 100}
        </div>
      )
    }

  }


  const categoryList = categories.map((category, mapIndex) =>
    <div key={mapIndex}>
      <div className="oneCategoryRow">

        {category}

        {questions[mapIndex].map((question, questionIndex) => (
          viewQuestion(question, questionIndex)
        ))}

      </div>
    </div>
  );

  return <div className="game-board">{categoryList}</div>;
}
