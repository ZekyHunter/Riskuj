import React from "react";
import "./Modal.css"; // Můžeš přidat vlastní stylování pro modál

const Modal = ({ isOpen, question, onClose, addPoints }) => {
  if (!isOpen) return null; // Pokud není modální okno otevřeno, nevracíme nic

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{question}</h2> {/* Zobrazení otázky */}
        <button onClick={addPoints}>Spravne</button>
        <button>Spatne</button>
        <button onClick={onClose}>Zavřít</button>
      </div>
    </div>
  );
};

export default Modal;