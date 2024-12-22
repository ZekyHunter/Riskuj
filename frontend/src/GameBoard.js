import React from "react";
import "./GameBoard.css";


export default function GameBoard({categories, questions, modalIsOpen, changeModalState}) {

  if (!categories) return null;

  const categoryList = categories.map((category, mapIndex) =>
    <div key={mapIndex}>
      <div className="oneCategoryRow">

        {category}

        {questions[mapIndex].map((question, questionIndex) => (
          <div
            className="question-cell"
            key={questionIndex}
            onClick={() => changeModalState(question)}
          >
            {questionIndex * 100 + 100}{" "}
          </div>
        ))}

      </div>
    </div>
  );

  return <div className="game-board">{categoryList}</div>;
}
