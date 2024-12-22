import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
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
    }
  }

  changeModalState(question) {
    this.setState({
      selectedQuestion: question,
      isModalOpen: this.state.isModalOpen ? false : true,
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
    this.setState({questions: questions_list});
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
              /> } />
            <Route path="/player" element={<PlayerPage />} />
          </Routes>
        </Router>
      </div>
    );
  }
}
