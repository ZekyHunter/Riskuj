import React, { useState, useEffect } from "react";
import axios from "axios";
import GameBoard from "./GameBoard";
import Modal from "./Modal";
import UserBoard from "./UserBoard";

export default function MainPage() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedQuestionPoints, setSelectedQuestionPoints] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [activePlayer, setActivePlayer] = useState(null); // ActivePlayer.user.id

  useEffect(() => {
    // Start interval on mount
    const getUsers = setInterval(() => {
      axios
        .get("/api/users/")
        .then((res) => {
          setUsers(res.data);
        })
        .catch((err) => console.log(err));
    }, 5000); // Interval runs every 5000ms (5 seconds)

    const getActivePlayers = setInterval(() => {
      axios
        .get("/api/active-players/")
        .then((res) => {
          if (res && res.data.length > 0) {
            setActivePlayer(res.data[0]["user"]);
          } else {
            setActivePlayer(null);
          }
        })
        .catch((err) => {
          console.error("Error fetching active players:", err);
        });
    }, 5000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(getUsers);
      clearInterval(getActivePlayers);
    };
  }, []); // Empty dependency array means this runs only on mount and unmount

  function markQuestionAsAnswered(question) {
    setAnsweredQuestions([...answeredQuestions, question]);
    setSelectedQuestion(null);
    setSelectedQuestionPoints(null);
    setActivePlayer(null);
  }

  function changeModalState(question, questionIndex) {
    setModalOpen(modalOpen ? false : true);
    setSelectedQuestion(question);
    setSelectedQuestionPoints(questionIndex * 100 + 100);
  }

  return (
    <div>
      <div id="users" className="player-container">
        {/* <h1>Players: </h1> */}
        {users.map((user) => (
          <UserBoard key={user.id} user={user} activePlayer={activePlayer} />
        ))}
      </div>

      <GameBoard
        activePlayer={activePlayer}
        changeModalState={changeModalState}
        answeredQuestions={answeredQuestions}
      />

      <Modal
        modalOpen={modalOpen}
        question={selectedQuestion}
        changeModalState={changeModalState}
        markQuestionAsAnswered={markQuestionAsAnswered}
        activePlayer={activePlayer}
        selectedQuestionPoints={selectedQuestionPoints}
        setActivePlayer={setActivePlayer}
      />
    </div>
  );
}
