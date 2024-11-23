import React from "react";
import "./GameBoard.css";

//const GameBoard = ({ categories, questions, onQuestionClick }) => {
//  return (
//    <div className="game-board">
//      {categories.map((category, catIndex) => (
//        <React.Fragment key={catIndex}>
//          <div className="category-cell">{category}</div>
//          {questions[catIndex].map((question, qIndex) => (
//            <div
//              className="question-cell"
//              key={qIndex}
//              onClick={() => onQuestionClick(question)} // Předání otázky do modálního okna
//            >
//              {qIndex * 100 + 100}{" "}
//              {/* Zobrazení čísla otázky (100, 200, 300, ...) */}
//            </div>
//          ))}
//        </React.Fragment>
//      ))}
//    </div>
//  );
//};
//
//export default GameBoard;

//export default function GameBoard({categories, questions, onQuestionClick}) {
//  const categoryList = categories.map(category => <li>{category}</li>);
//  return (
//    <div className="game-board">
//            <ul>{categoryList}</ul>
//
//    </div>
//  );
//}

export default function GameBoard({categories, questions, onQuestionClick}) {
  return (
    <div className="game-board">Hello!</div>
  );
}