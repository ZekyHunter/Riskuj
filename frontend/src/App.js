import axios from "axios";
import React, { useState, Component } from "react";
import UserBoard from "./UserBoard";
//import GameBoard from "./GameBoard";
//import Modal from "./Modal";

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      users: [],
      isModalOpen: false,
      setIsModalOpen: false,
      selectedQuestion: null,
      setSelectedQuestion: null,

    }
  }

  openModal(question){
    this.setSelectedQuestion = question; // Nastaví vybranou otázku
    this.setIsModalOpen = true; // Otevře modální okno
  };

  closeModal(){
    this.setIsModalOpen = false; // Zavře modální okno
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
            <UserBoard key={user.id} userName={user.name} userPoints={user.points}/>
          ))}
        </div>
      </div>
    );
  };

};


