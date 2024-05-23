import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddBook from './pages/AddBook';
import ViewBooks from './pages/ViewBooks';
import './App.css';
function App() {
  return (
    <Router>
      <nav className="navbar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/add-book">Add Book</Link></li>
          <li><Link to="/view-books">View Books</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/view-books" element={<ViewBooks />} />
      </Routes>
    </Router>
  );
}

export default App;
