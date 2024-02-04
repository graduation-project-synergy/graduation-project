import React from 'react';
import './App.css'; // App.css 파일을 import
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.js';
import PathFinder from './components/PathFinderPage.js';

function App() {
  return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/PathFinder" element={<PathFinder />} />
          </Routes>
        </Router>
      </div>
  );
}
export default App;