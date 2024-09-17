import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

// Reddit API links (no proxy needed)
const subreddits = {
  HumansBeingBros: 'https://www.reddit.com/r/HumansBeingBros.json',
  DankMemes: 'https://www.reddit.com/r/dankmemes.json',
  CatsBeingCats: 'https://www.reddit.com/r/CatsBeingCats.json'
};

// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const HomePage = () => {
  const [selectedSubreddit, setSelectedSubreddit] = useState('All');
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialLoadDone, setInitialLoadDone] = useState(false); // Track if initial loading is done
  const [expandedPostId, setExpandedPostId] = useState(null); // Track which post is expanded

  // Fetch posts from all subreddits
  const fetchAllSubreddits = async () => {
    setLoading(true);
    try {
      const requests = Object.values(subreddits).map(subreddit =>
        axios.get(subreddit, { params: { limit: 20 } }) // Fetch 20 posts from each subreddit
      );
      const responses = await Promise.all(requests);

      const combinedPosts = responses.flatMap(response =>
        response.data.data.children.map((child) => ({
          ...child.data,
          subreddit: child.data.subreddit.toLowerCase() // Ensure subreddit names are lowercase
        }))
      );

      const shuffledPosts = shuffleArray(combinedPosts); // Shuffle the combined posts list

      setAllPosts(shuffledPosts); // Cache all fetched posts
      setFilteredPosts(shuffledPosts); // Initially show all posts
      setLoading(false);
      setInitialLoadDone(true); // Mark that the initial load is done
    } catch (error) {
      setError('Failed to load posts.');
      console.error('Error fetching subreddits:', error);
      setLoading(false);
    }
  };

  // Filter the cached posts based on the selected subreddit
  const filterPosts = (subreddit) => {
    setSelectedSubreddit(subreddit);
    if (subreddit === 'All') {
      setFilteredPosts(allPosts); // Show all posts if "All" is selected
    } else {
      const filtered = allPosts.filter((post) => post.subreddit === subreddit.toLowerCase());
      setFilteredPosts(filtered);
    }
  };

  // Toggle expand/collapse of a post
  const togglePostExpansion = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  // Fetch posts only once when the component mounts
  useEffect(() => {
    if (!initialLoadDone) {
      fetchAllSubreddits(); // Only fetch once
    }
  }, [initialLoadDone]);

  return (
    <div className="feed">
      {/* Main headline */}
      <h1>Your daily dose of Wholesome</h1>

      {/* Filter buttons */}
      <div className="filter-buttons">
        <button
          className={selectedSubreddit === 'All' ? 'active' : ''}
          onClick={() => filterPosts('All')}
        >
          All
        </button>
        <button
          className={selectedSubreddit === 'HumansBeingBros' ? 'active' : ''}
          onClick={() => filterPosts('HumansBeingBros')}
        >
          Humans Being Bros
        </button>
        <button
          className={selectedSubreddit === 'DankMemes' ? 'active' : ''}
          onClick={() => filterPosts('DankMemes')}
        >
          Dank Memes
        </button>
        <button
          className={selectedSubreddit === 'CatsBeingCats' ? 'active' : ''}
          onClick={() => filterPosts('CatsBeingCats')}
        >
          Cats Being Cats
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Display cached posts */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => {
          const isExpanded = expandedPostId === post.id; // Check if the current post is expanded

          return (
            <div key={post.id} className={`post ${isExpanded ? 'expanded' : ''}`}>
              <div className="post-header">
                {/* Link the title to the detailed view */}
                <Link to={`/post/${post.id}`}>
                  <h2>{post.title}</h2>
                </Link>
                <p>Posted by u/{post.author} in {post.subreddit}</p>
              </div>
              <div className="post-content">
                {post.selftext && <p>{post.selftext}</p>}
                {post.url && post.post_hint === 'image' && (
                  <img
                    src={post.url}
                    alt={post.title}
                    className={`post-media ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => togglePostExpansion(post.id)} // Expand/collapse on click
                  />
                )}
                {post.media && post.media.reddit_video && (
                  <video
                    controls
                    className={`post-media ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => togglePostExpansion(post.id)} // Expand/collapse on click
                  >
                    <source src={post.media.reddit_video.fallback_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className="post-footer">
                <span>👍 {post.ups}</span>
                <span>💬 {post.num_comments} Comments</span>
                <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                  View on Reddit
                </a>
              </div>
            </div>
          );
        })
      ) : (
        !loading && <p>No posts available.</p>
      )}
    </div>
  );
};

export default HomePage;
