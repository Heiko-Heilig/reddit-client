import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRedditPosts } from '../redux/actions';
import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { loading, posts, error } = useSelector((state) => state.reddit);

  useEffect(() => {
    dispatch(fetchRedditPosts());
  }, [dispatch]);

  // Function to render media content based on the post type
  const renderPostContent = (post) => {
    // Handle images
    if (post.post_hint === 'image') {
      return <img src={post.url} alt={post.title} className="post-media" />;
    }
    
    // Handle videos (like Reddit videos)
    if (post.media && post.media.reddit_video) {
      return (
        <video controls className="post-media">
          <source src={post.media.reddit_video.fallback_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    // Handle external links or other media types
    if (post.post_hint === 'link') {
      return (
        <a href={post.url} target="_blank" rel="noopener noreferrer" className="post-link">
          {post.url}
        </a>
      );
    }

    // Default case: text content or no media
    return post.selftext ? <p>{post.selftext}</p> : <p>[No content]</p>;
  };

  return (
    <div className="feed">
      <h1>Humans Being Bros - Reddit Feed</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-header">
              <h2>{post.title}</h2>
              <p>Posted by u/{post.author}</p>
            </div>
            <div className="post-content">
              {renderPostContent(post)} {/* Render the media content */}
            </div>
            <div className="post-footer">
              <span>👍 {post.ups}</span>
              <span>💬 {post.num_comments} Comments</span>
              <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                View on Reddit
              </a>
            </div>
          </div>
        ))
      ) : (
        !loading && <p>No posts available.</p>
      )}
    </div>
  );
};

export default HomePage;
