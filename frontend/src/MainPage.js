import React, { useState, useEffect } from "react";
import axios from "axios";
import GameBoard from "./GameBoard";
import Modal from "./Modal";
import PlayerBoard from "./PlayerBoard";
import { INTERVAL_DURATION } from "./config";


export default function MainPage() {

  const [players, setPlayers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedQuestionPoints, setSelectedQuestionPoints] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [activePlayer, setActivePlayer] = useState(null);  // ActivePlayer object
  const [currentTurn, setCurrentTurn] = useState(null);  // Player object

  useEffect(() => {
    const fetchPlayers = () => {
      axios
        .get("/api/players/")
        .then(res => {
          setPlayers(res.data);
          if (!currentTurn) {
            const randomPlayer = res.data[Math.floor(Math.random() * res.data.length)];
            setCurrentTurn(randomPlayer);
          }
        })
        .catch(err => console.log(err));

      axios
        .get("/api/active-players/")
        .then(res => setActivePlayer(res?.data?.[0] || null))
        .catch(err => console.error("Error fetching active players:", err));
    };

    const intervalId = setInterval(fetchPlayers, INTERVAL_DURATION);

    axios
      .get("/api/questions/")
      .then(res => { initializeGameBoard(res.data) })
      .catch((err) => console.log(err));

    axios
        .get("/api/players/")
        .then(res => {setPlayers(res.data); setCurrentTurn(res.data[Math.floor(Math.random() * res.data.length)]);})
        .catch(err => console.log(err));

    return () => clearInterval(intervalId);
  }, []);

  function markQuestionAsAnswered(question) {
    setAnsweredQuestions([...answeredQuestions, question]);
    setSelectedQuestion(null);
    setSelectedQuestionPoints(null);
  }

  function openQuestion(question, questionIndex) {
    setModalOpen(true);
    setSelectedQuestion(question);
    setSelectedQuestionPoints(questionIndex * 100 + 100);
  }

  function closeQuestion() {
    setModalOpen(false);
    setSelectedQuestion(null);
    setSelectedQuestionPoints(null);
  }

  function initializeGameBoard(data){
    const categories = Object.keys(data);
    const questionsList = Object.values(data);

    setCategories(categories);

    // Add 3 gold bricks in random spots within the question grid
    const randomQuestionsList = [...questionsList];
    for (let i = 0; i < 3; i++) {
      const randomCategoryIndex = Math.floor(Math.random() * categories.length);
      const randomQuestionIndex = Math.floor(Math.random() * questionsList[randomCategoryIndex].length);
      randomQuestionsList[randomCategoryIndex][randomQuestionIndex] = `GOLD ${i + 1}`;
    }
    setQuestions(randomQuestionsList);
  }

  return (
    <div>
      <div id="users">
        <p>Hráč na tahu: {currentTurn ? (currentTurn.name) : (null)}</p>
        <h1>Players: </h1>
        {players.map(player => (
          <PlayerBoard
            key={player.id}
            player={player}
            activePlayer={activePlayer}
          />
        ))}
      </div>

      {!modalOpen ? (
        <GameBoard
          categories={categories}
          questions={questions}
          activePlayer={activePlayer}
          setActivePlayer={setActivePlayer}
          openQuestion={openQuestion}
          answeredQuestions={answeredQuestions}
          players={players}
          currentTurn={currentTurn}
        />
      ) : (
        <Modal
          modalOpen={modalOpen}
          question={selectedQuestion}
          openQuestion={openQuestion}
          closeQuestion={closeQuestion}
          markQuestionAsAnswered={markQuestionAsAnswered}
          activePlayer={activePlayer}
          selectedQuestionPoints={selectedQuestionPoints}
          setActivePlayer={setActivePlayer}
          currentTurn={currentTurn}
          setCurrentTurn={setCurrentTurn}
          players={players}
        />
      )}

    </div>
  );

};
