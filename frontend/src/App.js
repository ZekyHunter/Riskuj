import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, Component } from "react";
import axios from "axios";
import MainPage from "./MainPage";
import PlayerPage from "./PlayerPage";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isModalOpen: false,
      selectedQuestion: null,
      selectedQuestionPoints: null,
      categories: null,
      questions: null,
      answeredQuestions: [],
      openedBricks: [],
      isActive: false,
      activePlayer: null,  // id in ActivePlayer Model
      player: null,
    }
  }

  setPlayer(data){
    this.setState({
      player: data,
    })
  }

  changeModalState(question, questionIndex) {
    this.setState({
      selectedQuestion: question,
      isModalOpen: this.state.isModalOpen ? false : true,
      isActive: this.state.isModalOpen ? true : false,
      selectedQuestionPoints: questionIndex * 100 + 100,
    });
  }

  markQuestionAsAnswered(question) {
    // this executes when player answers a question correctly
    this.setState({
      answeredQuestions: [...this.state.answeredQuestions, question],
      activePlayer: null,
      selectedQuestion: null,
      selectedQuestionPoints: null,
      isActive: false,
    });
  }

  setUsers(data){
    this.setState({users: data});
  }

  setActivePlayer(res){
    console.log("setting active player");
    console.log(res);
    if (res && res.data.length > 0) {
      this.setState({ activePlayer: res.data[0]["user"] });
    } else {
      this.setState({ activePlayer: null });
    }
  }

  setQuestions(data){
    let categories = []
    let questions_list = []
    for (let [category, questions] of Object.entries(data)) {
        categories.push(category);
        questions_list.push(questions)
    }
    this.setState({categories: categories});

    // add gold bricks into randomly generated spots
    for (let i=0; i<3; i++) {
      questions_list[Math.floor(Math.random() * 6)][Math.floor(Math.random() * 5)] = `GOLD ${i+1}`;
    }

    // set questions
    this.setState({questions: questions_list});
  }

  revealGold(question, questionIndex){
    this.setState({
      openedBricks: [...this.state.openedBricks, question],
      isActive: false,
    });

    const playerDivs = document.getElementsByClassName("player");
    for (let element of playerDivs) {
      const usernameElement = element.querySelector('p.username');

      if (usernameElement.parentElement.id === this.state.activePlayer) {
        const pointsElement = element.querySelector("p.points")
        let playerPoints = parseInt(pointsElement.textContent, 10);
        playerPoints = playerPoints + (questionIndex * 100 + 100);
        pointsElement.textContent = playerPoints;
        break;
      }
    }
  }

  render() {
    return (
      <div>
      <button onClick={() => this.StopInterval()}>Stop interval</button>
        <Router>
          <Routes>
            <Route path="/" element={ <MainPage
              setUsers={this.setUsers.bind(this)}
              users={this.state.users}
              setQuestions={this.setQuestions.bind(this)}
              categories={this.state.categories}
              questions={this.state.questions}
              isModalOpen={this.state.isModalOpen}
              changeModalState={this.changeModalState.bind(this)}
              selectedQuestion={this.state.selectedQuestion}
              answeredQuestions={this.state.answeredQuestions}
              markQuestionAsAnswered={this.markQuestionAsAnswered.bind(this)}
              openedBricks={this.state.openedBricks}
              revealGold={this.revealGold.bind(this)}
              activePlayer={this.state.activePlayer}
              selectedQuestionPoints={this.state.selectedQuestionPoints}
              setActivePlayer={this.setActivePlayer.bind(this)}
              /> } />
            <Route path="/player" element={<PlayerPage
              isActive={this.state.isActive}
              player={this.state.player}
              setPlayer={this.setPlayer.bind(this)}
            />} />
          </Routes>
        </Router>
      </div>
    );
  }
}
