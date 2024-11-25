import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameBoardPage from "./GameBoardPage";
import PlayerPage from "./PlayerPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Definice různých stránek */}
        <Route path="/" element={<GameBoardPage />} /> {/* Hlavní stránka */}
        <Route path="/player" element={<PlayerPage />} /> {/* Stránka hráče */}
      </Routes>
    </Router>
  );
};

export default App;
