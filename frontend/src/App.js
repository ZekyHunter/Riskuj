import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, Component } from "react";
import axios from "axios";
import MainPage from "./MainPage";
import PlayerPage from "./PlayerPage";

// Martymu se obcas objevuje chyba TypeError: Cannot read properties of null (reading 'useRef')
// je zpusobena spatnou verzi knihovny react-router-dom

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Router>
          <Routes>
            <Route path="/" element={ <MainPage /> } />
            <Route path="/player" element={<PlayerPage />} />
          </Routes>
        </Router>
      </div>
    );
  }
}
