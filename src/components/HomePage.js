import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRedditPosts } from '../redux/actions';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { loading, posts, error } = useSelector((state) => state.reddit);
  const [expandedPostId, setExpandedPostId] = useState(null);

  useEffect(() => {
    dispatch(fetchRedditPosts());
  }, [dispatch]);

  const togglePostExpansion = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const renderPostContent = (post, isExpanded) => {
    if (post.post_hint === 'image') {
      return (
        <img
          src={post.url}
          alt={post.title}
          className={`post-media ${isExpanded ? 'expanded' : ''}`}
          onClick={() => togglePostExpansion(post.id)}
        />
      );
    }

    if (post.media && post.media.reddit_video) {
      return (
        <video
          controls
          muted
          className={`post-media ${isExpanded ? 'expanded' : ''}`}
          onClick={() => togglePostExpansion(post.id)}
        >
          <source src={post.media.reddit_video.fallback_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (post.post_hint === 'link') {
      return (
        <a href={post.url} target="_blank" rel="noopener noreferrer" className="post-link">
          {post.url}
        </a>
      );
    }

    return post.selftext ? <p>{post.selftext}</p> : <p>[No content]</p>;
  };

  return (
    <div className="feed">
      <h1>Humans Being Bros - Reddit Feed</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {posts.length > 0 ? (
        posts.map((post) => {
          const isExpanded = expandedPostId === post.id;

          return (
            <div key={post.id} className={`post ${isExpanded ? 'expanded' : ''}`}>
              <div className="post-header">
                <Link to={`/post/${post.id}`}>
                  <h2>{post.title}</h2> {/* Make title clickable to navigate to the detailed view */}
                </Link>
                <p>Posted by u/{post.author}</p>
              </div>
              <div className="post-content">
                {renderPostContent(post, isExpanded)}
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
