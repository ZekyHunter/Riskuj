import React, { useState } from "react";
import axios from "axios";
import GameBoard from "./GameBoard";
import Modal from "./Modal";
import UserBoard from "./UserBoard";


export default function MainPage({
  setUsers, users, setQuestions, categories, questions, isModalOpen, changeModalState, selectedQuestion,
  answeredQuestions, markQuestionAsAnswered, openedBricks, revealGold }) {

  function getUsers () {
    axios
      .get("/api/users/")
      .then(res => { setUsers(res.data) })
      .catch((err) => console.log(err));
  }

  function getQuestions () {
    axios
      .get("/api/questions/")
      .then(res => { setQuestions(res.data) })
      .catch((err) => alert("Pravděpodobně vám chybí otázky v databázi."));
  }

  return (
    <div>
      <div id="users">
        <button onClick={() => getUsers()}>Get users</button>
        {users.map(user => (
          <UserBoard
            key={user.id}
            userName={user.name}
            userPoints={user.points}
          />
        ))}
      </div>

      <button onClick={() => getQuestions()}>Get questions</button>

      <GameBoard
          categories={categories}
          questions={questions}
          modalIsOpen={isModalOpen}
          changeModalState={changeModalState}
          answeredQuestions={answeredQuestions}
          openedBricks={openedBricks}
          revealGold={revealGold}
        />

        <Modal
          isOpen={isModalOpen}
          question={selectedQuestion}
          changeModalState={changeModalState}
          markQuestionAsAnswered={markQuestionAsAnswered}
        />
    </div>
  );

};
