import React, { useState, useEffect } from "react";
import axios from "axios";
import GameBoard from "./GameBoard";
import Question from "./Question";
import PlayerBoard from "./PlayerBoard";
import { INTERVAL_DURATION } from "./config";
import "./MainPage.css";


export default function MainPage() {

  const [players, setPlayers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [openedBricks, setOpenedBricks] = useState([]);
  const [questionOpened, setQuestionOpened] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedQuestionPoints, setSelectedQuestionPoints] = useState(null);
  const [activePlayer, setActivePlayer] = useState(null);  // ActivePlayer object
  const [currentTurn, setCurrentTurn] = useState(null);  // Player object
  const [errorMessage, setErrorMessage] = useState(null);
  const [showGameBoard, setShowGameBoard] = useState(false);

  function getQuestions () {
    axios
      .get("/api/questions/")
      .then(res => { initializeGameBoard(res.data) })
      .catch((err) => setErrorMessage("Nepodařilo se načíst hrací plochu."));
  }

  useEffect(() => {
    const fetchPlayers = () => {
      axios
        .get("/api/players/")
        .then(res => setPlayers(res.data))
        .catch(err => console.log(err));

      axios
        .get("/api/active-players/")
        .then(res => setActivePlayer(res?.data?.[0] || null))
        .catch(err => console.error("Error fetching active players:", err));
    };

    const intervalId = setInterval(fetchPlayers, INTERVAL_DURATION);

    axios
      .get("/api/players/")
      .then(res => {
        setPlayers(res.data);
        const randomPlayer = res.data[Math.floor(Math.random() * res.data.length)];
        setCurrentTurn(randomPlayer);
      })
      .catch(err => console.log(err));

    return () => clearInterval(intervalId);
  }, []);

  function markQuestionAsAnswered(question) {
    setAnsweredQuestions([...answeredQuestions, question]);
    setSelectedQuestion(null);
    setSelectedQuestionPoints(null);
  }

  function openQuestion(question, questionIndex) {
    if (questionIndex === 0) {
      axios
      .post('/api/bonus-question/', { player: currentTurn.id })
      .catch((err) => console.log(err));
    } else {
      axios
      .post('/api/players-answered/', { answered: false })
      .catch((err) => console.log(err));
    }
    setQuestionOpened(true);
    setSelectedQuestion(question);
    setSelectedQuestionPoints(questionIndex * 100);
  }

  function closeQuestion() {
    setQuestionOpened(false);
    setSelectedQuestion(null);
    setSelectedQuestionPoints(null);
  }

  function initializeGameBoard(data){
    setErrorMessage(null);

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
    setShowGameBoard(true);
  }

  return (
    <div className="mainContainer">


      { errorMessage &&  (
        <div className="message" >
          <h1>{ errorMessage }</h1>
          <button className="button" onClick={() => getQuestions()} >Zkusit znovu</button>
        </div>
      )}

      { !showGameBoard &&  (
        <div className="message" >
          <button className="button" onClick={() => getQuestions()} >Načíst hrací plochu</button>
        </div>
      )}

      {!questionOpened ? (
        <GameBoard
          categories={categories}
          questions={questions}
          activePlayer={activePlayer}
          setActivePlayer={setActivePlayer}
          openQuestion={openQuestion}
          answeredQuestions={answeredQuestions}
          setAnsweredQuestions={setAnsweredQuestions}
          openedBricks={openedBricks}
          setOpenedBricks={setOpenedBricks}
          players={players}
          currentTurn={currentTurn}
        />
      ) : (
        <Question className="questionContainer"
          questionOpened={questionOpened}
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

      <div className="playerContainer fixed-bottom">
        {players.map(player => (
          <PlayerBoard
            key={player.id}
            player={player}
            activePlayer={activePlayer}
            currentTurn={currentTurn}
          />
        ))}
      </div>

    </div>
  );
}
