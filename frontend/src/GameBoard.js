import React from "react";
import "./GameBoard.css";

export default function GameBoard({
  categories,
  questions,
  modalIsOpen,
  changeModalState,
}) {
  const categoryList = categories.map((category, mapIndex) => (
    <div className="oneCategoryRow" key={mapIndex}>
      <div className="category-cell">{category}</div>
      {questions[mapIndex].map((question, questionIndex) => (
        <div
          className="question-cell"
          key={questionIndex}
          onClick={() => changeModalState(question)}
        >
          {" "}
          {question}:{questionIndex * 100 + 100}{" "}
        </div>
      ))}
    </div>
  ));

  return <div className="game-board">{categoryList}</div>;
}
