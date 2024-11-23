import React, { useState } from "react";
import GameBoard from "./GameBoard";
import Modal from "./Modal";
import { questionsData } from "./questionsData";

const App = () => {
  const categories = ["Historie", "Věda", "Kultura", "Sport", "Příroda"];
  const questions = Array(5).fill([100, 200, 300, 400, 500]); // Pět sloupců, každý má 5 otázek
  const [isModalOpen, setIsModalOpen] = useState(false); // Stav pro modální okno
  const [selectedQuestion, setSelectedQuestion] = useState(null); // Vybraná otázka

  const openModal = (question) => {
    setSelectedQuestion(question); // Nastaví vybranou otázku
    setIsModalOpen(true); // Otevře modální okno
  };

  const closeModal = () => {
    setIsModalOpen(false); // Zavře modální okno
  };

  return (
    <div>
      <h1 className="riskuj">Riskuj!</h1>
      <GameBoard
        categories={categories}
        questions={questionsData}
        onQuestionClick={openModal} // Předání funkce pro otevření modálu
      />
      <Modal
        isOpen={isModalOpen}
        question={selectedQuestion}
        onClose={closeModal}
      />
    </div>
  );
};

export default App;