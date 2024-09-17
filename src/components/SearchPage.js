import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SearchPage.css';

const subreddits = ['HumansBeingBros', 'dankmemes', 'CatsBeingCats'];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchWithinSubreddits, setSearchWithinSubreddits] = useState(true); // Toggle for subreddit search
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle search
  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent form submission

    if (!searchTerm.trim()) {
      setError('Please enter a valid search term');
      return;
    }

    setLoading(true);
    setError('');
    try {
      let queryUrl;

      // Search only within the defined subreddits
      if (searchWithinSubreddits) {
        const subredditsQuery = subreddits.join('+');
        queryUrl = `https://www.reddit.com/r/${subredditsQuery}/search.json?q=${searchTerm}&restrict_sr=1`; // `restrict_sr=1` limits search to subreddits
      } else {
        // Search all of Reddit
        queryUrl = `https://www.reddit.com/search.json?q=${searchTerm}`;
      }

      const response = await axios.get(queryUrl);
      const results = response.data.data.children.map((child) => ({
        ...child.data,
        subreddit: child.data.subreddit.toLowerCase(),
      }));
      setSearchResults(results);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch search results.');
      setLoading(false);
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className="search-page">
      <h1>Search Reddit</h1>

      {/* Search form */}
      <form onSubmit={handleSearch} className="search-form">
  <div className="search-input-container">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search for something..."
    />
    <button type="submit">Search</button>
  </div>

  {/* Container for the toggle label and checkbox */}
  <div className="toggle-container">
    <label className="toggle-label">
      Search only in defined subreddits
      <input
        type="checkbox"
        checked={searchWithinSubreddits}
        onChange={() => setSearchWithinSubreddits(!searchWithinSubreddits)}
      />
    </label>
  </div>
</form>


      {/* Warning message if searching all of Reddit */}
      {!searchWithinSubreddits && (
        <p className="warning">
          Warning: Searching all of Reddit may yield results that are not wholesome!
        </p>
      )}

      {/* Show loading state */}
      {loading && <p>Loading...</p>}

      {/* Show error message */}
      {error && <p className="error">{error}</p>}

      {/* Display search results */}
      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((result) => (
            <div key={result.id} className="post">
              <div className="post-header">
                {/* Link the title to the detailed view */}
                <Link to={`/post/${result.id}`}>
                  <h2>{result.title}</h2>
                </Link>
                <p>Posted by u/{result.author} in {result.subreddit}</p>
              </div>
              <div className="post-content">
                {/* Display thumbnail if available */}
                {result.thumbnail && result.thumbnail !== 'self' && result.thumbnail !== 'default' && (
                  <img src={result.thumbnail} alt={result.title} className="post-media" />
                )}
                {result.media && result.media.reddit_video && (
                  <video controls className="post-media">
                    <source src={result.media.reddit_video.fallback_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className="post-footer">
                <span>👍 {result.ups}</span>
                <span>💬 {result.num_comments} Comments</span>
                <a href={`https://reddit.com${result.permalink}`} target="_blank" rel="noopener noreferrer">
                  View on Reddit
                </a>
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
