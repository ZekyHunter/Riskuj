import React from "react";
import "./GameBoard.css";


export default function GameBoard({categories, questions}) {
  const categoryList = categories.map((category, mapIndex) =>
    <>
      <div className="category-cell">{category}</div>
      {questions[mapIndex].map((question, questionIndex) =>
        <div
          className="question-cell"
          key={questionIndex}
          //onClick={() => onQuestionClick(question)}
        >
          {questionIndex * 100 + 100}{" "}
        </div>
      )}
    </>
  );

  return (
    <div className="game-board">
      {categoryList}
    </div>
  );

};
