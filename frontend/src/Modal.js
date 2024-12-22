import React from "react";
import "./Modal.css";


export default function Modal({ isOpen, question, changeModalState, markQuestionAsAnswered }) {
  if (!isOpen) return null;

  function answer (response) {
    changeModalState(question);
    markQuestionAsAnswered(question);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 style={{color:"black"}}>{question}</h2>
        <button onClick={() => answer("correct")}>Správná odpověď</button>
        <button onClick={() => answer("wrong")}>Špatná odpověď</button>
        <button onClick={() => changeModalState(question)}>Zavřít</button>
      </div>
    </div>
  );
};
