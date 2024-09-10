import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import PostDetailPage from './components/PostDetailPage'; // Update import

const App = () => {
  return (
    <Router>
      <div>
        {/* Basic Navigation Links */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            {/* Remove hardcoded detail link if not needed */}
          </ul>
        </nav>

        {/* Routes for the pages */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} /> {/* Update to correct path */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
