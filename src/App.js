import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import PostDetailPage from './components/PostDetailPage';

const App = () => {
  return (
    <Router>
      <div>
        {/* Centered Navigation Links */}
        <nav className="navigation">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
          </ul>
        </nav>

        {/* Routes for the pages */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
