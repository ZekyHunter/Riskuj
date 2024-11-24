import React from "react";
import "./Modal.css";


export default function Modal({ isOpen, question, changeModalState }) {
  if (!isOpen) return null; // Pokud není modální okno otevřeno, nevracíme nic

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 style={{color:"black"}}>{question}</h2>
        <button onClick={() => changeModalState(question)}>Zavřít</button>
      </div>
    </div>
  );
};
