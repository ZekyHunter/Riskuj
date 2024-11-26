import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import React, { useState, Component } from "react";
import UserBoard from "./UserBoard";
import GameBoard from "./GameBoard";
import Modal from "./Modal";

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      users: [],
      isModalOpen: false,
      selectedQuestion: null,
      categories: ["Historie", "Věda", "Kultura", "Sport", "Příroda", "Cokoliv"],
      questions: [
        ["Otázka 1", "Otázka 2", "Otázka 3", "Otázka 4", "Otázka 5"],
        ["Otázka 6", "Otázka 7", "Otázka 8", "Otázka 9", "Otázka 10"],
        ["Otázka 11", "Otázka 12", "Otázka 13", "Otázka 14", "Otázka 15"],
        ["Otázka 16", "Otázka 17", "Otázka 18", "Otázka 19", "Otázka 20"],
        ["Otázka 21", "Otázka 22", "Otázka 23", "Otázka 24", "Otázka 25"],
      ],
    }
  }

  changeModalState(question){
    this.setState({
      selectedQuestion: question,
      isModalOpen: this.state.isModalOpen ? false : true
    });
  };

  getUsers(){
    axios
      .get("/api/users/")
      .then(res => {this.setState({users: res.data})})
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div>
        <h1 className="riskuj">Riskuj!</h1>

        <div id="users">
          <button onClick={() => this.getUsers()}>Get users</button>
          {this.state.users.map(user => (
            <UserBoard
              key={user.id}
              userName={user.name}
              userPoints={user.points}
            />
          ))}
        </div>

        <br/>

        <GameBoard
          categories={this.state.categories}
          questions={this.state.questions}
          modalIsOpen={this.state.isModalOpen}
          changeModalState={this.changeModalState.bind(this)}
        />

        <Modal
          isOpen={this.state.isModalOpen}
          question={this.state.selectedQuestion}
          changeModalState={this.changeModalState.bind(this)}
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

};





