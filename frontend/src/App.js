import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameBoard from "./GameBoard";
import Modal from "./Modal";
import { questionsData } from "./questionsData";

const App = () => {
  const categories = ["Historie", "Věda", "Kultura", "Sport", "Příroda", "Cokoliv"];
  const questions = Array(6).fill([100, 200, 300, 400, 500]); // Pět sloupců, každý má 5 otázek
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
      <Router>
        <Routes>
          {/* Definice různých stránek */}
          <Route path="/" element={<GameBoardPage />} /> {/* Hlavní stránka */}
          <Route path="/player" element={<PlayerPage />} /> {/* Stránka hráče */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;