import React, { useState } from "react";
import GameBoard from "./GameBoard";
import Modal from "./Modal";
import { questionsData } from "./questionsData";

const GameBoardPage = () => {
  const categories = [
    "Historie",
    "Věda",
    "Kultura",
    "Sport",
    "Příroda",
    "Cokoliv",
  ];
  const questions = Array(6).fill([100, 200, 300, 400, 500]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const openModal = (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1 className="riskuj">Riskuj!</h1>
      <GameBoard
        categories={categories}
        questions={questionsData}
        onQuestionClick={openModal}
      />
      <Modal
        isOpen={isModalOpen}
        question={selectedQuestion}
        onClose={closeModal}
      />
    </div>
  );
};

export default GameBoardPage;
