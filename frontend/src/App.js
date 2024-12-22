import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, Component } from "react";
import MainPage from "./MainPage";
import PlayerPage from "./PlayerPage";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isModalOpen: false,
      selectedQuestion: null,
      categories: null,
      questions: null,
      answeredQuestions: [],
      openedBricks: [],
    }
  }

  changeModalState(question) {
    this.setState({
      selectedQuestion: question,
      isModalOpen: this.state.isModalOpen ? false : true,
    });
  }

  markQuestionAsAnswered(question) {
    this.setState({
      answeredQuestions: [...this.state.answeredQuestions, question]
    });
  }

  setUsers(data){
    this.setState({users: data});
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

  revealGold(question){
    this.setState({openedBricks: [...this.state.openedBricks, question]});
  }

  render() {
    return (
      <div>
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
              /> } />
            <Route path="/player" element={<PlayerPage />} />
          </Routes>
        </Router>
      </div>
    );
  }
}
